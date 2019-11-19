const BigNumber = require('bignumber.js');
const { Hex, EpochNumber } = require('conflux-web-utils/src/type');

const Conflux = require('../index');
const MockProvider = require('./__mocks__/provider');

const KEY = '0xa816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393';
const ADDRESS = '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b';
const BLOCK_HASH = '0xe0b0000000000000000000000000000000000000000000000000000000000000';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';
const DEFAULT_GAS = 100;
const DEFAULT_GAS_PRICE = 1000000;

// ----------------------------------------------------------------------------
const cfx = new Conflux({
  defaultGas: DEFAULT_GAS,
  defaultGasPrice: DEFAULT_GAS_PRICE,
});
cfx.provider = new MockProvider();

beforeAll(() => {
  expect(cfx.defaultEpoch).toBe(EpochNumber.LATEST_STATE);
  expect(cfx.defaultGas).toBe(DEFAULT_GAS);
  expect(cfx.defaultGasPrice).toBe(DEFAULT_GAS_PRICE);
});

test('getLogs', async () => {
  await expect(cfx.getLogs()).rejects.toThrow('Cannot destructure property');

  cfx.provider.call = async (method, options) => {
    expect(method).toBe('cfx_getLogs');
    expect(options.fromEpoch).toBe(undefined);
    expect(options.toEpoch).toBe(undefined);
    expect(options.address).toBe(undefined);
    expect(options.topics).toBe(undefined);
  };
  await cfx.getLogs({});

  cfx.provider.call = async (method, options) => {
    expect(method).toBe('cfx_getLogs');
    expect(options.fromEpoch).toBe('0x00');
    expect(options.toEpoch).toBe(EpochNumber.LATEST_MINED);
    expect(options.address).toBe(ADDRESS);
    expect(Array.isArray(options.topics)).toBe(true);
  };
  await cfx.getLogs({
    fromEpoch: 0,
    toEpoch: EpochNumber.LATEST_MINED,
    address: Hex.toBuffer(ADDRESS),
    topics: [],
  });
});

test('getBalance', async () => {
  await expect(cfx.getBalance()).rejects.toThrow('do not match hex string');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toBe('cfx_getBalance');
    expect(address).toBe(ADDRESS);
    expect(epochNumber).toBe(cfx.defaultEpoch);
  };
  await cfx.getBalance(ADDRESS);
  await cfx.getBalance(ADDRESS.replace('0x', ''));
  await cfx.getBalance(ADDRESS, EpochNumber.LATEST_STATE);

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toBe('cfx_getBalance');
    expect(address).toBe(ADDRESS);
    expect(epochNumber).toBe('0x00');
  };
  await cfx.getBalance(ADDRESS, 0);
});

test('getTransactionCount', async () => {
  await expect(cfx.getTransactionCount()).rejects.toThrow('do not match hex string');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toBe('cfx_getTransactionCount');
    expect(address).toBe(ADDRESS);
    expect(epochNumber).toBe(cfx.defaultEpoch);
  };
  await cfx.getTransactionCount(ADDRESS);
  await cfx.getTransactionCount(ADDRESS.replace('0x', ''));
  await cfx.getTransactionCount(ADDRESS, EpochNumber.LATEST_STATE);

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toBe('cfx_getTransactionCount');
    expect(address).toBe(ADDRESS);
    expect(epochNumber).toBe('0x00');
  };
  await cfx.getTransactionCount(ADDRESS, 0);
});

test('getBlocksByEpoch', async () => {
  await expect(cfx.getBlocksByEpoch()).rejects.toThrow('do not match hex string');

  cfx.provider.call = async (method, epochNumber) => {
    expect(method).toBe('cfx_getBlocksByEpoch');
    expect(epochNumber).toBe('0x00');
  };
  await cfx.getBlocksByEpoch(0);
});

test('getBlockByHash', async () => {
  await expect(cfx.getBlockByHash()).rejects.toThrow('do not match hex string');
  await expect(cfx.getBlockByHash(ADDRESS)).rejects.toThrow('do not match BlockHash');
  await expect(cfx.getBlockByHash(BLOCK_HASH, 0)).rejects.toThrow('detail must be boolean');

  cfx.provider.call = async (method, blockHash, detail) => {
    expect(method).toBe('cfx_getBlockByHash');
    expect(blockHash).toBe(BLOCK_HASH);
    expect(detail).toBe(false);
  };
  await cfx.getBlockByHash(BLOCK_HASH);
  await cfx.getBlockByHash(BLOCK_HASH.replace('0x', ''));
  await cfx.getBlockByHash(BLOCK_HASH, false);

  cfx.provider.call = async (method, blockHash, detail) => {
    expect(method).toBe('cfx_getBlockByHash');
    expect(blockHash).toBe(BLOCK_HASH);
    expect(detail).toBe(true);
  };
  await cfx.getBlockByHash(BLOCK_HASH, true);
});

test('getBlockByEpochNumber', async () => {
  await expect(cfx.getBlockByEpochNumber()).rejects.toThrow('do not match hex string');
  await expect(cfx.getBlockByEpochNumber(0, 1)).rejects.toThrow('detail must be boolean');

  cfx.provider.call = async (method, epochNumber, detail) => {
    expect(method).toBe('cfx_getBlockByEpochNumber');
    expect(epochNumber).toBe(cfx.defaultEpoch);
    expect(detail).toBe(false);
  };
  await cfx.getBlockByEpochNumber(EpochNumber.LATEST_STATE);
  await cfx.getBlockByEpochNumber(EpochNumber.LATEST_STATE, false);

  cfx.provider.call = async (method, epochNumber, detail) => {
    expect(method).toBe('cfx_getBlockByEpochNumber');
    expect(epochNumber).toBe('0x00');
    expect(detail).toBe(true);
  };
  await cfx.getBlockByEpochNumber(0, true);
  await cfx.getBlockByEpochNumber('0', true);
});

test('getBlockByHashWithPivotAssumption', async () => {
  // TODO
});

test('getRiskCoefficient', async () => {
  // TODO
});

test('getTransactionByHash', async () => {
  await expect(cfx.getTransactionByHash()).rejects.toThrow('do not match hex string');
  await expect(cfx.getTransactionByHash(ADDRESS)).rejects.toThrow('do not match TxHash');

  cfx.provider.call = async (method, txHash) => {
    expect(method).toBe('cfx_getTransactionByHash');
    expect(txHash).toBe(TX_HASH);
  };
  await cfx.getTransactionByHash(TX_HASH);
  await cfx.getTransactionByHash(TX_HASH.replace('0x', ''));
});

test('getTransactionReceipt', async () => {
  await expect(cfx.getTransactionReceipt()).rejects.toThrow('do not match hex string');
  await expect(cfx.getTransactionReceipt(ADDRESS)).rejects.toThrow('do not match TxHash');

  cfx.provider.call = async (method, txHash) => {
    expect(method).toBe('cfx_getTransactionReceipt');
    expect(txHash).toBe(TX_HASH);
  };
  await cfx.getTransactionReceipt(TX_HASH);
  await cfx.getTransactionReceipt(TX_HASH.replace('0x', ''));
});

test('sendTransaction by address', async () => {
  cfx.getTransactionCount = async (address) => {
    expect(address).toBe(ADDRESS);
    return 0;
  };

  await expect(cfx.sendTransaction()).rejects.toThrow('Cannot read property');
  await expect(cfx.sendTransaction({ nonce: 0 })).rejects.toThrow('`from` is required and should match `Address`');

  cfx.provider.call = async (method, options) => {
    expect(method).toBe('cfx_sendTransaction');
    expect(options.from).toBe(ADDRESS);
    expect(options.nonce).toBe('0x00');
    expect(options.gasPrice).toBe(Hex(cfx.defaultGasPrice));
    expect(options.gas).toBe(Hex(cfx.defaultGas));
    expect(options.to).toBe(undefined);
    expect(options.value).toBe(undefined);
    expect(options.data).toBe('0x');
  };
  await cfx.sendTransaction({ from: ADDRESS });
  await cfx.sendTransaction({ nonce: 0, from: ADDRESS });

  cfx.provider.call = async (method, options) => {
    expect(method).toBe('cfx_sendTransaction');
    expect(options.from).toBe(ADDRESS);
    expect(options.nonce).toBe('0x64');
    expect(options.gasPrice).toBe(Hex(cfx.defaultGasPrice));
    expect(options.gas).toBe('0x01');
    expect(options.to).toBe(ADDRESS);
    expect(options.value).toBe('0x00');
    expect(options.data).toBe('0x');
  };
  await cfx.sendTransaction({
    nonce: '100',
    from: ADDRESS.replace('0x', ''),
    to: Hex.toBuffer(ADDRESS),
    gas: BigNumber(1),
    value: 0,
    data: '',
  });
});

test('sendTransaction by account', async () => {
  const account = cfx.wallet.add(KEY);

  cfx.getTransactionCount = async (address) => {
    expect(Hex(address)).toBe(ADDRESS);
    return 0;
  };

  cfx.provider.call = async (method, hex) => {
    expect(method).toBe('cfx_sendRawTransaction');
    expect(Hex.isHex(hex)).toBe(true);
  };
  await cfx.sendTransaction({ from: account });
});

test('sendRawTransaction', async () => {
  await expect(cfx.sendRawTransaction()).rejects.toThrow('do not match hex string');

  cfx.provider.call = async (method, txHash) => {
    expect(method).toBe('cfx_sendRawTransaction');
    expect(txHash).toBe('0x01ff');
  };
  await cfx.sendRawTransaction('01ff');
  await cfx.sendRawTransaction(Buffer.from([1, 255]));
});

test('getCode', async () => {
  await expect(cfx.getCode()).rejects.toThrow('do not match hex string');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toBe('cfx_getCode');
    expect(address).toBe(ADDRESS);
    expect(epochNumber).toBe(cfx.defaultEpoch);
  };
  await cfx.getCode(ADDRESS);
  await cfx.getCode(ADDRESS.replace('0x', ''));
  await cfx.getCode(ADDRESS, cfx.defaultEpoch);

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toBe('cfx_getCode');
    expect(address).toBe(ADDRESS);
    expect(epochNumber).toBe('0x00');
  };
  await cfx.getCode(ADDRESS, 0);
});

test('call', async () => {
  cfx.getTransactionCount = async (address) => {
    expect(Hex(address)).toBe(ADDRESS);
    return 100;
  };

  await expect(cfx.call()).rejects.toThrow('Cannot read property');
  await expect(cfx.call({ nonce: 0 })).rejects.toThrow('`to` is required and should match `Address`');

  cfx.provider.call = async (method, options, epochNumber) => {
    expect(method).toBe('cfx_call');

    expect(options.from).toBe(undefined);
    expect(options.nonce).toBe(undefined);
    expect(options.gasPrice).toBe(Hex(cfx.defaultGasPrice));
    expect(options.gas).toBe(Hex(cfx.defaultGas));
    expect(options.to).toBe(ADDRESS);
    expect(options.value).toBe(undefined);
    expect(options.data).toBe(undefined);

    expect(epochNumber).toBe(cfx.defaultEpoch);
  };
  await cfx.call({ to: ADDRESS });

  cfx.provider.call = async (method, options, epochNumber) => {
    expect(method).toBe('cfx_call');

    expect(options.from).toBe(ADDRESS);
    expect(options.nonce).toBe('0x64');
    expect(options.gasPrice).toBe(Hex(cfx.defaultGasPrice));
    expect(options.gas).toBe('0x01');
    expect(options.to).toBe(ADDRESS);
    expect(options.value).toBe('0x64');
    expect(options.data).toBe('0x');

    expect(epochNumber).toBe(EpochNumber.EARLIEST);
  };
  await cfx.call(
    {
      from: Hex.toBuffer(ADDRESS),
      to: Hex.toBuffer(ADDRESS),
      gas: BigNumber(1),
      value: '100',
      data: '',
    },
    EpochNumber.EARLIEST,
  );
});

test('estimateGas', async () => {
  cfx.getTransactionCount = async (address) => {
    expect(Hex(address)).toBe(ADDRESS);
    return 100;
  };

  await expect(cfx.estimateGas()).rejects.toThrow('Cannot read property');
  await expect(cfx.estimateGas({ nonce: 0 })).rejects.toThrow('`to` is required and should match `Address`');

  cfx.provider.call = async (method, options) => {
    expect(method).toBe('cfx_estimateGas');

    expect(options.from).toBe(undefined);
    expect(options.nonce).toBe(undefined);
    expect(options.gasPrice).toBe(Hex(cfx.defaultGasPrice));
    expect(options.gas).toBe(Hex(cfx.defaultGas));
    expect(options.to).toBe(ADDRESS);
    expect(options.value).toBe(undefined);
    expect(options.data).toBe(undefined);
  };
  await cfx.estimateGas({ to: ADDRESS });

  cfx.provider.call = async (method, options) => {
    expect(method).toBe('cfx_estimateGas');

    expect(options.from).toBe(ADDRESS);
    expect(options.nonce).toBe('0x64');
    expect(options.gasPrice).toBe(Hex(cfx.defaultGasPrice));
    expect(options.gas).toBe('0x01');
    expect(options.to).toBe(ADDRESS);
    expect(options.value).toBe('0x64');
    expect(options.data).toBe('0x');
  };
  await cfx.estimateGas(
    {
      from: Hex.toBuffer(ADDRESS),
      to: Hex.toBuffer(ADDRESS),
      gas: BigNumber(1),
      value: '100',
      data: '',
    },
  );
});
