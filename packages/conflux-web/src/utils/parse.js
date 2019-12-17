/*
 NOTE:
   - check Hex array before Hex, eg: `parse([BlockHash]).or(parse(BlockHash))`
   - check null before number, eg: `(parse.null).or(parse.number)`
 */

const lodash = require('lodash');
const BigNumber = require('bignumber.js');

const { Hex, TxHash, Hex32, Address, EpochNumber, BlockHash } = require('conflux-web-utils/src/type');
const parse = require('../../lib/parse');

parse.any = parse(v => v);
parse.null = parse.any.validate(lodash.isNull);
parse.boolean = v => Boolean(Number(v));
parse.number = Number;
parse.bigNumber = BigNumber;

parse.transaction = parse({
  nonce: parse.number,
  value: parse.bigNumber,
  gasPrice: parse.bigNumber,
  gas: parse.bigNumber,
  v: parse.number,
  transactionIndex: (parse.null).or(parse.number),
  status: (parse.null).or(parse.number), // XXX: might be remove in rpc returned
});

parse.block = parse({
  epochNumber: parse.number,
  height: parse.number,
  size: parse.number,
  timestamp: parse.number,
  gasLimit: parse.bigNumber,
  difficulty: parse.bigNumber,
  transactions: [(parse.transaction).or(TxHash)],
  stable: (parse.null).or(parse.boolean),
});

parse.receipt = parse({
  index: parse.number, // XXX: number already in rpc return
  epochNumber: parse.number, // XXX: number already in rpc return
  outcomeStatus: parse.number, // XXX: number already in rpc return
  gasUsed: parse.bigNumber,
  logs: [
    {
      // FIXME: getTransactionReceipt returned log.data is array of number
      data: data => (Array.isArray(data) ? Hex(Buffer.from(data)) : data),
    },
  ],
});

parse.logs = parse([
  {
    epochNumber: parse.number,
    logIndex: parse.number,
    transactionIndex: parse.number,
    transactionLogIndex: parse.number,
  },
]);

// ----------------------------------------------------------------------------
parse.getLogs = parse({
  limit: Hex.fromNumber,
  fromEpoch: EpochNumber,
  toEpoch: EpochNumber,
  blockHashes: parse([BlockHash]).or(parse(BlockHash)),
  address: parse([Address]).or(parse(Address)),
  topics: [(parse.null).or(parse([Hex32])).or(parse(Hex32))],
});

module.exports = parse;
