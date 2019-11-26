// FIXME: not to depend on 'web3-eth-abi' and 'ethers'
const lodash = require('lodash');
const web3Abi = require('web3-eth-abi');
const { defaultAbiCoder: ethAbi } = require('ethers/utils/abi-coder');

/**
 * @memberOf Contract
 */
class Called {
  constructor(method, { to, data }) {
    this.method = method;
    this.to = to;
    this.data = data;
  }

  /**
   * Will send a transaction to the smart contract and execute its method.
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * > Note: This can alter the smart contract state.
   *
   * @param options {object} - See `Transaction.callOptions`
   * @return {Promise<PendingTransaction>} The PendingTransaction object.
   */
  sendTransaction(options) {
    return this.method.cfx.sendTransaction({
      to: this.to,
      data: this.data,
      ...options,
    });
  }

  /**
   * Executes a message call or transaction and returns the amount of the gas used.
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * @param options {object} - See `Transaction.callOptions`
   * @return {Promise<number>} The used gas for the simulated call/transaction.
   */
  estimateGas(options) {
    return this.method.cfx.estimateGas({
      to: this.to,
      data: this.data,
      ...options,
    });
  }

  /**
   * Executes a message call transaction,
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * > Note: Can not alter the smart contract state.
   *
   * @param options {object} - See `Transaction.callOptions`.
   * @param epochNumber {string|number} - See `Conflux.call`.
   * @return {Promise<*>} Decoded contact call return.
   */
  async call(options, epochNumber) {
    const result = await this.method.cfx.call(
      {
        to: this.to,
        data: this.data,
        ...options,
      },
      epochNumber,
    );
    return this.method.decode(result);
  }

  async then(resolve, reject) {
    try {
      const result = await this.call();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }
}

class ContractFunction extends Function {
  constructor(cfx, { contract, abi }) {
    super();
    this.cfx = cfx;
    this.contract = contract;
    this.abi = abi;
    this.code = web3Abi.encodeFunctionSignature(this.abi);
    return new Proxy(this, this.constructor);
  }

  static apply(self, _, params) {
    return new Called(self, {
      to: self.contract.address,
      data: self.encode(params),
    });
  }

  params(data) {
    if (!data.startsWith(this.code)) {
      return undefined;
    }
    const hex = `0x${data.slice(this.code.length)}`;
    const decode = ethAbi.decode(this.abi.inputs, hex);
    return [...decode];
  }

  encode(params) {
    return this.code + web3Abi.encodeParameters(this.abi.inputs, params).replace('0x', '');
  }

  decode(hex) {
    const decode = ethAbi.decode(this.abi.outputs, hex);
    const outputs = [...decode];
    return outputs.length <= 1 ? outputs[0] : outputs;
  }
}

class ContractConstructor extends ContractFunction {
  constructor(cfx, { code, ...rest }) {
    super(cfx, rest);
    this.code = code;
  }

  static apply(self, _, params) {
    return new Called(self, {
      data: self.encode(params),
    });
  }

  encode(params) {
    if (!this.code) {
      throw new Error('contract.constructor.code is empty');
    }
    return this.code + web3Abi.encodeParameters(this.abi.inputs, params).replace('0x', '');
  }

  decode(hex) {
    return hex;
  }
}

// ----------------------------------------------------------------------------
class EventLog {
  constructor(eventLog, { address, topics }) {
    this.eventLog = eventLog;
    this.address = address;
    this.topics = topics;
  }

  async list(options) {
    const logs = await this.eventLog.cfx.getLogs({
      address: this.address,
      topics: this.topics,
      ...options,
    });

    logs.forEach((log) => {
      log.params = this.eventLog.params(log);
    });

    return logs;
  }
}

class ContractEvent extends Function {
  constructor(cfx, { contract, abi }) {
    super();
    this.cfx = cfx;
    this.contract = contract;
    this.abi = abi;
    this.code = web3Abi.encodeEventSignature(abi);
    return new Proxy(this, this.constructor);
  }

  static apply(self, _, params) {
    lodash.forEach(params, (param, index) => {
      if (!lodash.isNil(param)) {
        params[index] = web3Abi.encodeParameter(self.abi.inputs[index], param);
      }
    });

    return new EventLog(self, {
      address: self.contract.address,
      topics: [self.code, ...params],
    });
  }

  params(log) {
    if (this.code !== log.topics[0]) {
      return undefined;
    }

    if (Array.isArray(log.data)) {
      // FIXME: getTransactionReceipt returned log.data is array of number
      log.data = `0x${Buffer.from(log.data).toString('hex')}`;
    }

    const result = web3Abi.decodeLog(
      this.abi.inputs,
      log.data,
      this.abi.anonymous ? log.topics : log.topics.slice(1),
    );

    return lodash.range(result.__length__).map(i => result[i]);
  }
}

// ----------------------------------------------------------------------------

/**
 * Contract with all its methods and events defined in its abi.
 */
class Contract {
  /**
   *
   * @param cfx {Conflux} - Conflux instance.
   * @param options {object}
   * @param options.abi {array} - The json interface for the contract to instantiate
   * @param [options.address] {string} - The address of the smart contract to call, can be added later using `contract.address = '0x1234...'`
   * @param [options.code] {string} - The byte code of the contract, can be added later using `contract.constructor.code = '0x1234...'`
   * @return {object}
   *
   * @example
   * > const contract = cfx.Contract({ abi, code });
   * > contract instanceof Contract;
   true

   * > contract.abi; // input abi
   [{type:'constructor', inputs:[...]}, ...]

   * > contract.constructor.code; // input code
   "0x6080604052600080..."

   * // deploy a contract by send constructor then wait and get contract address by `PendingTransaction.deployed` trick.
   * > await contract.constructor(100).sendTransaction({ from: account }).deployed();
   "0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8"

   * @example
   * > const contract = cfx.Contract({ abi, address });
   * > contract.address
   "0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8"

   * > await contract.count(); // call a method without parameter, get decoded return value.
   BigNumber { _hex: '0x64' }
   * > await contract.inc(1); // call a method with parameters, get decoded return value.
   BigNumber { _hex: '0x65' }
   * > await contract.count().call({ from: account }); // call a method from a account.
   BigNumber { _hex: '0x64' }
   * > await contract.count().estimateGas();
   21655
   * > await contract.count().estimateGas({ from: ADDRESS, nonce: 68 }); // if from is a address string, nonce is required
   21655

   * // send transaction from account instance, then wait till confirmed, and get receipt.
   * > await contract.inc(1)
   .sendTransaction({ from: account1 })
   .confirmed({ threshold: 0.01, timeout: 30 * 1000 });
   {
     "blockHash": "0xba948c8925f6d7f14faf540c3b9e6d24d33c78168b2dd81a6021a50949d9f0d7",
     "index": 0,
     "transactionHash": "0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42",
     "outcomeStatus": 0,
     ...
   }

   * > await contract.count(); // data in block chain changed by transaction.
   BigNumber { _hex: '0x65' }

   * > await contract.SelfEvent(account1.address).list()
   [
     {
      address: '0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8',
      blockHash: '0xc8cb678891d4914aa66670e3ebd7a977bb3e38d2cdb1e2df4c0556cb2c4715a4',
      data: '0x000000000000000000000000000000000000000000000000000000000000000a',
      epochNumber: 545896,
      logIndex: 0,
      removed: false,
      topics: [
        '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
        '0x000000000000000000000000bbd9e9be525ab967e633bcdaeac8bd5723ed4d6b'
      ],
      transactionHash: '0x9100f4f84f711aa358e140197e9d2e5aab1f99751bc26a660d324a8282fc54d0',
      transactionIndex: 0,
      transactionLogIndex: 0,
      type: 'mined',
      params: [ '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b', '10' ]
     }
   ]
   */
  constructor(cfx, { abi: contractABI, address, code }) {
    this.abi = contractABI; // XXX: Create a method named `abi` in solidity is a `Warning`.
    this.address = address; // XXX: Create a method named `address` in solidity is a `ParserError`

    contractABI.forEach((methodABI) => {
      switch (methodABI.type) {
        case 'constructor': // cover this.constructor
          this.constructor = new ContractConstructor(cfx, { contract: this, abi: methodABI, code });
          break;

        case 'function':
          this[methodABI.name] = new ContractFunction(cfx, { contract: this, abi: methodABI });
          break;

        case 'event':
          this[methodABI.name] = new ContractEvent(cfx, { contract: this, abi: methodABI });
          break;

        default:
          break;
      }
    });
  }
}

module.exports = Contract;
module.exports.ContractConstructor = ContractConstructor;
module.exports.ContractFunction = ContractFunction;
module.exports.Called = Called;
module.exports.EventLog = EventLog;
