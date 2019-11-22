/* eslint-disable global-require */

const Conflux = require('conflux-web');

const PRIVATE_KEY = '0xa816a06117e572ca7ae2f786a046d2bc478051d0717b....................';

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    logger: console,
  });

  console.log(cfx.defaultGasPrice); // 100

  // ================================ Contract ================================
  const account = cfx.wallet.add(PRIVATE_KEY); // create account instance
  console.log(account.address); // 0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  const abi = require('./abi.json');
  const code = require('./code.json');
  const contract = cfx.Contract({ abi, code }); // create contract instance

  // estimate deploy contract gas use
  const estimateDeployGas = await contract.constructor(10).estimateGas();
  console.log(estimateDeployGas); // 170494

  // deploy the contract
  const contractAddress = await contract.constructor(10)
    .sendTransaction({
      from: account,
      // gas: estimateDeployGas, // if not set gas, will use 'cfx.defaultGas'
    })
    .deployed();
  console.log(contractAddress); // 0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404

  contract.address = contractAddress;

  const getCode = await cfx.getCode(contract.address);
  console.log(getCode); // same as 'code'

  /*
   call contract method.
   'count' is a method name, see solidity.sol
   */
  console.log(await contract.count()); // BigNumber { _hex: '0x0a' }, 10 in hex set by 'contract.constructor(10)'

  /*
  Executes a message call transaction, which is directly executed in the VM of the node,
  but never mined into the block chain.
   */
  console.log(await contract.inc(1)); // BigNumber { _hex: '0x0b' }, 11=10+1
  console.log(await contract.count()); // BigNumber { _hex: '0x0a' }, not change !

  /*
   send transaction to contract
   */
  const estimateIncGas = await contract.inc(1).estimateGas();
  console.log(estimateIncGas); // 26950

  const receipt = await contract.inc(1).sendTransaction({ from: account, gas: estimateIncGas }).confirmed();
  console.log(receipt);
  // {
  //   blockHash: '0x278cc391a8fecfd9294e9cb20c837bd4f8d6692b3b5ff9ae48b17e88a600c4a0',
  //   contractCreated: null,
  //   epochNumber: 389862,
  //   from: '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
  //   gasUsed: BigNumber { s: 1, e: 4, c: [ 26950 ] },
  //   index: 0,
  //   logs: [],
  //   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  //   outcomeStatus: 0,
  //   stateRoot: '0x7a3af18a984f5c0fdb4d0895f3b1bfda2989ba2af3aa826ff56f9c3f8d63d0e9',
  //   to: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
  //   transactionHash: '0x254d0dac130c9ac5b23abdb1a65a2ac7f20c8fcc0c5e3a8e3e45aa6f58111f19'
  // }

  console.log(await contract.count()); // BigNumber { _hex: '0x0b' }, data in block chain changed !!!
}

main().catch(e => console.error(e));
