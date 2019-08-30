# conflux-web-accounts 

This is a sub package of [conflux-web][repo]

This is the accounts package to be used in the `conflux-web-cfx` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install conflux-web-cfx-accounts
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/conflux-web-cfx-accounts.js` in your html file.
This will expose the `ConfluxWebCfxAccounts` object on the window object.


## Usage

```js
// in node.js
var ConfluxWebCfxAccounts = require('conflux-web-cfx-accounts');

var account = new ConflusWebCfxAccounts('ws://localhost:8546');
account.create();
> {
  address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
  privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
  signTransaction: function(tx){...},
  sign: function(data){...},
  encrypt: function(password){...}
}
```


[docs]: https://phabricator.conflux-chain.org/w/javascript_api/
[repo]: https://github.com/Conflux-Chain/ConfluxWeb


