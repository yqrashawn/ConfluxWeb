# conflux-web-core-promievent

This is a sub package of [conflux-web][repo]

This is the PromiEvent package is used to return a EventEmitter mixed with a Promise to allow multiple final states as well as chaining.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-core-promievent
```

### In the Browser

Build running the following in the [conflux-web][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-core-promievent.js` in your html file.
This will expose the `ConfluxWebPromiEvent` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebPromiEvent = require('conflux-web-core-promievent');

var myFunc = function(){
    var promiEvent = ConfluxWebPromiEvent();
    
    setTimeout(function() {
        promiEvent.eventEmitter.emit('done', 'Hello!');
        promiEvent.resolve('Hello!');
    }, 10);
    
    return promiEvent.eventEmitter;
};


// and run it
myFunc()
.then(console.log);
.on('done', console.log);
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


