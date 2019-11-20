const { EpochNumber } = require('conflux-web-utils/src/type');
const Conflux = require('../index');

// ----------------------------------------------------------------------------

test('constructor()', async () => {
  const cfx = new Conflux();

  expect(cfx.defaultEpoch).toBe(EpochNumber.LATEST_STATE);
  expect(cfx.defaultGasPrice).toBe(undefined);
  expect(cfx.defaultGas).toBe(undefined);
  expect(cfx.provider.constructor.name).toBe('BaseProvider');

  await expect(cfx.provider.call()).rejects.toThrow('call not implement');
});

test('constructor({...})', () => {
  const cfx = new Conflux({
    url: 'http://localhost:12537',
    defaultEpoch: EpochNumber.LATEST_MINED,
    defaultGasPrice: 100,
    defaultGas: 1000000,
  });

  expect(cfx.defaultEpoch).toBe(EpochNumber.LATEST_MINED);
  expect(cfx.defaultGasPrice).toBe(100);
  expect(cfx.defaultGas).toBe(1000000);
  expect(cfx.provider.constructor.name).toBe('HttpProvider');
});

test('cfx.setProvider', () => {
  const cfx = new Conflux();

  expect(cfx.provider.constructor.name).toBe('BaseProvider');
  expect(cfx.provider.timeout).toBe(60 * 1000);

  cfx.setProvider('http://localhost:80', { timeout: 30 * 1000 });
  expect(cfx.provider.constructor.name).toBe('HttpProvider');
  expect(cfx.provider.timeout).toBe(30 * 1000);

  cfx.setProvider('ws://localhost:443');
  expect(cfx.provider.constructor.name).toBe('WebsocketProvider');
  expect(cfx.provider.timeout).toBe(30 * 1000);

  cfx.setProvider('');
  expect(cfx.provider.constructor.name).toBe('BaseProvider');
  expect(cfx.provider.timeout).toBe(30 * 1000);

  expect(() => cfx.setProvider()).toThrow('url must be string');
});

test('cfx.close', () => {
  const cfx = new Conflux();

  cfx.close();
});
