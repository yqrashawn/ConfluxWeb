# conflux-web-net

This is a sub package of [conflux-web][repo]

This is the net package to be used in other conflux-web packages.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-net
```

### In the Browser

Build running the following in the [conflux-web][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-net.js` in your html file.
This will expose the `ConfluxWebNet` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebNet = require('conflux-web-net');

var net = new ConfluxWebNet('ws://localhost:8546');
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


