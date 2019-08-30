# conflux-web-core-method

This is a sub package of [conflux-web][repo]

The Method package used within most [conflux-web][repo] packages.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-core-method
```

### In the Browser

Build running the following in the [conflux-web][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-core-method.js` in your html file.
This will expose the `ConfluxWebMethod` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebMethod = require('conflux-web-core-method');

var method = new ConfluxWebMethod({
    name: 'sendTransaction',
    call: 'eth_sendTransaction',
    params: 1,
    inputFormatter: [inputTransactionFormatter]
});
method.attachToObject(myCoolLib);

myCoolLib.sendTransaction({...}, function(){ ... });
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


