const { EpochNumber } = require('conflux-web-utils/src/type');
const Conflux = require('../index');

// ----------------------------------------------------------------------------

test('constructor()', () => {
  const cfx = new Conflux();

  expect(cfx.defaultEpoch).toBe(EpochNumber.LATEST_STATE);
  expect(cfx.defaultGasPrice).toBe(undefined);
  expect(cfx.defaultGas).toBe(undefined);
  expect(cfx.provider).toBe(null);
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
  expect(cfx.provider).toBe(null);

  cfx.setProvider('http://localhost:80');
  expect(cfx.provider.constructor.name).toBe('HttpProvider');

  cfx.setProvider('ws://localhost:443');
  expect(cfx.provider.constructor.name).toBe('WebsocketProvider');

  cfx.setProvider('');
  expect(cfx.provider).toBe(null);

  expect(() => cfx.setProvider()).toThrow('provider url must by string');
});

test('cfx.close', () => {
  const cfx = new Conflux();

  cfx.close();
});
