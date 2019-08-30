# conflux-web-cfx

This is a sub package of [conflux-web][repo]

This is the Eth package to be used [conflux-web][repo].
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-cfx
```

### In the Browser

Build running the following in the [conflux-web][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-cfx.js` in your html file.
This will expose the `ConfluxWebCfx` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebCfx = require('conflux-web-cfx');

var eth = new ConfluxWebCfx('ws://localhost:8546');
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


