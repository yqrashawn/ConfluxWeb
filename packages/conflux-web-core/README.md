# conflux-web-core

This is a sub package of [conflux-web][repo]

The core package contains core functions for [conflux-web][repo] packages.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-core
```


## Usage

```js
// in node.js
var core = require('conflux-web-core');

var CoolLib = function CoolLib() {

    // sets _requestmanager and adds basic functions
    core.packageInit(this, arguments);
    
};


CoolLib.providers;
CoolLib.givenProvider;
CoolLib.setProvider();
CoolLib.BatchRequest();
CoolLib.extend();
...
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


