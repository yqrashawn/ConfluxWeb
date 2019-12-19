const { loop } = require('../utils');

class LogPoll {
  constructor(cfx, { threshold, ...filter }) {
    this.cfx = cfx;
    this.filter = filter;
    this.threshold = threshold;

    this._epoch = filter.fromEpoch;
    this._toEpoch = filter.toEpoch;
    this._limit = filter.limit;
    this._count = 0;
    this._queue = [];
  }

  async _isConfirmed(epochNumber) {
    if (epochNumber === undefined) {
      return false;
    }

    const risk = await this.cfx.getRiskCoefficient(epochNumber);
    return risk < this.threshold;
  }

  async _getNextEpochNumber() {
    const [log] = await this.cfx.getLogs({
      ...this.filter,
      fromEpoch: this._epoch,
      limit: 1,
    });

    return log ? log.epochNumber : undefined;
  }

  async _readLogs(epochNumber) {
    const logs = await this.cfx.getLogs({
      ...this.filter,
      fromEpoch: this._epoch,
      toEpoch: epochNumber,
      limit: this._limit === undefined ? undefined : this._limit - this._count,
    });

    this._epoch = epochNumber + 1;
    this._count += logs.length;
    return logs;
  }

  async _waitLogs({ delta = 1000, timeout = 30 * 60 * 1000 } = {}) {
    return loop(
      async () => {
        if (this._epoch > this._toEpoch || this._count >= this._limit) {
          return [];
        }

        if (await this._isConfirmed(this._epoch)) {
          if (this._toEpoch && await this._isConfirmed(this._toEpoch)) {
            return this._readLogs(this._toEpoch);
          }

          const nextEpochNumber = await this._getNextEpochNumber();
          if (nextEpochNumber && await this._isConfirmed(nextEpochNumber)) {
            return this._readLogs(nextEpochNumber);
          }
        }

        return undefined; // continue
      },
      { delta, timeout },
    );
  }

  async next(options) {
    if (this._epoch === undefined) {
      this._epoch = await this.cfx.epochNumber();
    }

    if (!this._queue.length) {
      const logs = await this._waitLogs(options);
      this._queue.push(...logs);
    }

    return this._queue.pop();
  }
}

module.exports = LogPoll;
