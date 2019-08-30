# conflux-web-providers-ws

This is a sub package of [conflux-web][repo]

This is a websocket provider for [conflux-web][repo].   
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-providers-ws
```

### In the Browser

Build running the following in the [conflux-web][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-providers-ws.js` in your html file.
This will expose the `ConfluxWebWsProvider` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebWsProvider = require('conflux-web-providers-ws');

var options = { timeout: 30000, headers: {authorization: 'Basic username:password'} } // set a custom timeout at 30 seconds, and credentials (you can also add the credentials to the URL: ws://username:password@localhost:8546)
var ws = new Web3WsProvider('ws://localhost:8546', options);
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1
