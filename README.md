

# conflux-web - Conflux-Chain JavaScript API


This is the Conflux-Chain [JavaScript API][docs]
which connects to the [Generic JSON RPC](https://phabricator.conflux-chain.org/w/javascript_api/) spec.


You need to run a local or remote Conflux node to use this library.

Please read the [documentation][docs] for more.

## Installation

### Node

```bash
npm install conflux@1.2.1
```

### Yarn

```bash
yarn add web3@1.2.1
```

~ ### Meteor ~

~ *Note*: works only in the Browser for now. (PR welcome).~

```bash
~meteor add ethereum:web3~
```

### In the Browser

Use the prebuild ``dist/conflux-web.min.js``, or
build using the [conflux-web][repo] repository:

```bash
npm run-script build
```

Then include `dist/conflux-web.js` in your html file.
This will expose `ConfluxWeb` on the window object.

## Usage

```js
// in node.js
var ConfluxWeb = require('conflux-web');

var conflux_web = new ConfluxWeb('ws://localhost:8546');
console.log(conflux_web);
> {
    eth: ... ,
    utils: ...,
    ...
}
```

Additionally you can set a provider using `conflux_web.setProvider()` (e.g. WebsocketProvider)

```js
conflux_web.setProvider('ws://localhost:8546');
// or
conflux_web.setProvider(new ConfluxWeb.providers.WebsocketProvider('ws://localhost:8546'));
```

There you go, now you can use it:

```js
conflux_web.cfx.getAccounts()
.then(console.log);
```

### Usage with TypeScript

Type definitions are maintained at [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) by others. You can install them with

```bash
npm install --dev @types/conflux-web
```

You might need to install type definitions for `bignumber.js` and `lodash` too.

And then use `conflux-web` as follows:

```typescript
import ConfluxWeb = require("conflux-web"); // Note the special syntax! Copy this line when in doubt!
const conflxu_web = new ConfluxWeb("ws://localhost:8546");
```

**Please note:** We do not support TypeScript ourselves. If you have any issue with TypeScript and `web3.js` do not create an issue here. Go over to DefinitelyTyped and do it there.

## Documentation

Documentation can be found at [read the docs][docs]


## Building

### Requirements

* [Node.js](https://nodejs.org)
* npm

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

### Building (gulp)

Build only the web3.js package

```bash
npm run-script build
```

Or build all sub packages as well

```bash
npm run-script build-all
```

This will put all the browser build files into the `dist` folder.


### Testing (mocha)

```bash
npm test
```

### Contributing

- All contributions have to go into develop, or the 1.0 branch
- Please follow the code style of the other files, we use 4 spaces as tabs.

### Community
 - [Gitter](https://gitter.im/ethereum/web3.js?source=orgpage)
 - [Forum](https://forum.ethereum.org/categories/ethereum-js)


### Similar libraries in other languages
 - Python [Web3.py](https://github.com/pipermerriam/web3.py)
 - Haskell [hs-web3](https://github.com/airalab/hs-web3)		   
 - Java [web3j](https://github.com/web3j/web3j)		   
 - Scala [web3j-scala](https://github.com/mslinn/web3j-scala)
 - Purescript [purescript-web3](https://github.com/f-o-a-m/purescript-web3)
 - PHP [web3.php](https://github.com/sc0Vu/web3.php)


[repo]: https://github.com/ethereum/web3.js
[docs]: http://web3js.readthedocs.io/
[npm-image]: https://badge.fury.io/js/web3.png
[npm-url]: https://npmjs.org/package/web3
[travis-image]: https://travis-ci.org/ethereum/web3.js.svg
[travis-url]: https://travis-ci.org/ethereum/web3.js
[dep-image]: https://david-dm.org/ethereum/web3.js.svg
[dep-url]: https://david-dm.org/ethereum/web3.js
[dep-dev-image]: https://david-dm.org/ethereum/web3.js/dev-status.svg
[dep-dev-url]: https://david-dm.org/ethereum/web3.js#info=devDependencies
[coveralls-image]: https://coveralls.io/repos/ethereum/web3.js/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/ethereum/web3.js?branch=1.x
[waffle-image]: https://badge.waffle.io/ethereum/web3.js.svg?label=ready&title=Ready
[waffle-url]: https://waffle.io/ethereum/web3.js
