# conflux-web-cfx-abi

This is a sub package of [conflux-web][repo]

This is the abi package to be used in the `conflux-web-cfx` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-cfx-abi
```

### In the Browser

Build running the following in the [conflux-web][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-cfx-abi.js` in your html file.
This will expose the `ConfluxWebCfxAbi` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebCfxAbi = require('conflux-web-cfx-abi');

ConfluxWebCfxAbi.encodeFunctionSignature('myMethod(uint256,string)');
> '0x24ee0097'
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb


