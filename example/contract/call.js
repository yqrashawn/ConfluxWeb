/* eslint-disable */

const Conflux = require('conflux-web');

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  // create contract instance by address, which deploy in `deploy.js`.
  const contract = cfx.Contract({
    address: '0x32116df84f12e1fc936720a57bbdcba2a1e1ff05',
    abi: require('./abi.json'),
  });

  /**
   * call contract function.
   * `count` is a function name, see `solidity.sol`
   */
  console.log(await contract.count()); // BigNumber { _hex: '0x0a' }, 10 in hex set by 'contract.constructor(10)'

  /**
   * call contract function with params.
   * (Executes a message call transaction, which is directly executed in the VM of the node, but never mined into the block chain.)
   */
  console.log(await contract.inc(1)); // BigNumber { _hex: '0x0b' }, 11=10+1

  /**
   * as you see, above call operation not change the count!
   */
  console.log(await contract.count()); // BigNumber { _hex: '0x0a' }

  /**
   * `self` is a function which emit a `SelfEvent` event, but will not level log cause `cfx_call` operate.
   */
  console.log(await contract.self()); // undefined
}

main().catch(e => console.error(e));
