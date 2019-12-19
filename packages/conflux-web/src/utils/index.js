const parse = require('./parse');

/**
 * Await sleep.
 *
 * @memberOf utils
 * @param ms {number} - Sleep duration in ms.
 * @return {Promise<undefined>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Loop execute `func` if it return `undefined`
 *
 * @memberOf utils
 * @param [options] {object}
 * @param [options.delta=1000] {number} - Loop transaction interval in ms.
 * @param [options.timeout=30*1000] {number} - Loop timeout in ms.
 * @param func {function} - Function to execute.
 * @return {Promise<*>}
 */
async function loop({ delta = 1000, timeout = 30 * 1000 }, func) {
  const startTime = Date.now();

  for (let lastTime = startTime; Date.now() - startTime < timeout; lastTime = Date.now()) {
    const ret = await func();
    if (ret !== undefined) {
      return ret;
    }

    await sleep(lastTime + delta - Date.now());
  }

  throw new Error(`Timeout after ${Date.now() - startTime} ms`);
}

function decorate(instance, name, func) {
  const method = instance[name];
  instance[name] = function (...params) {
    return func(method.bind(this), params);
  };
}

class LazyPromise {
  constructor(func, params) {
    this._func = func;
    this._params = params;
    this._promise = null; // not call `func(...params)` immediately
  }

  async then(resolve, reject) {
    this._promise = this._promise || this._func(...this._params);

    try {
      resolve(await this._promise);
    } catch (e) {
      reject(e);
    }
  }
}

module.exports = {
  sleep,
  loop,
  decorate,
  LazyPromise,
  parse,
};
