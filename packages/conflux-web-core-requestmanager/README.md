# conflux-web-core-requestmanager

This is a sub package of [conflux-web][repo]

The requestmanager package is used by most [conflux-web][repo] packages.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-core-requestmanager
```

### In the Browser

Build running the following in the [conflux-web][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-core-requestmanager.js` in your html file.
This will expose the `ConfluxWebRequestManager` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebWsProvider = require('conflux-web-providers-ws');
var ConfluxWebRequestManager = require('conflux-web-core-requestmanager');

var requestManager = new ConfluxWebRequestManager(new Web3WsProvider('ws://localhost:8546'));
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


