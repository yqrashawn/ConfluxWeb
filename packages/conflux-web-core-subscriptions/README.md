# conflux-web-core-subscriptions

This is a sub package of [conflux-web][repo]

The subscriptions package used within some [conflux-web][repo] packages.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-core-subscriptions
```

### In the Browser

Build running the following in the [conflux-web][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-core-subscriptions.js` in your html file.
This will expose the `ConfluxWebSubscriptions` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebSubscriptions = require('conflux-web-core-subscriptions');

var sub = new ConfluxWebSubscriptions({
    name: 'subscribe',
    type: 'cfx,
    subscriptions: {
        'newBlockHeaders': {
            subscriptionName: 'newHeads',
            params: 0,
            outputFormatter: formatters.outputBlockFormatter
        },
        'pendingTransactions': {
            params: 0,
            outputFormatter: formatters.outputTransactionFormatter
        }
    }
});
sub.attachToObject(myCoolLib);

myCoolLib.subscribe('newBlockHeaders', function(){ ... });
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1


