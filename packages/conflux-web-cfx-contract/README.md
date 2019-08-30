# conflux-web-cfx-contract

This is a sub package of [conflux-web][repo]

This is the contract package to be used in the `conflux-web-cfx` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux_web-cfx-contract
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-cfx-contract.js` in your html file.
This will expose the `ConfluxWebCfxContract` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebCfxContract = require('conflux-web-cfx-contract');

// set provider for all later instances to use
ConfluxWebCfxContract.setProvider('ws://localhost:8546');

var contract = new Web3EthContract(jsonInterface, address);
contract.methods.somFunc().send({from: ....})
.on('receipt', function(){
    ...
});
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


