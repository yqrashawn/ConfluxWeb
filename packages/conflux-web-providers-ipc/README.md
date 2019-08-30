# conflux-web-providers-ipc

This is a sub package of [conflux-web.js][repo]

This is a IPC provider for [conflux-web.js][repo].   
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-providers-ipc
```

### In the Browser

Build running the following in the [conflux-web.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-providers-ipc.js` in your html file.
This will expose the `ConfluxWebIpcProvider` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebIpcProvider = require('conflux-web-providers-ipc');
var net = require(net);

var ipc = new ConfluxWebIpcProvider('/Users/me/Library/Ethereum/geth.ipc', net);
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


