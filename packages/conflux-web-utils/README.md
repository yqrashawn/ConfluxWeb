# conflux-web-utils

This is a sub package of [conflux-web][repo]

This contains useful utility functions for Dapp developers.   
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-utils
```

### In the Browser

Build running the following in the [conflux-web][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-utils.js` in your html file.
This will expose the `ConfluxWebUtils` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebUtils = require('conflux-web-utils');
console.log(ConfluxWebUtils);
{
    sha3: function(){},
    soliditySha3: function(){},
    isAddress: function(){},
    ...
}
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


