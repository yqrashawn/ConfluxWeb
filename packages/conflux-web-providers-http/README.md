# conflux-web-providers-http

*This is a sub package of [conflux-web][repo]*

This is a HTTP provider for [conflux-web][repo].   
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-providers-http
```

### In the Browser

Build running the following in the [conflux-web][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-providers-http.js` in your html file.
This will expose the `ConfluxWebHttpProvider` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebHttpProvider = require('conflux-web-providers-http');

var options = {
    timeout: 20000, // milliseconds,
    headers: [{name: 'Access-Control-Allow-Origin', value: '*'},{...}]
};
var http = new ConfluxWebHttpProvider('http://localhost:8545', options);
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


