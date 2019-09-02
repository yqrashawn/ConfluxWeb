/* jshint ignore:start */
Package.describe({
    name: 'ethereum:web3',
    version: '1.2.1',
    summary: 'Conflux-Chain JavaScript API, middleware to talk to a ethreum node over RPC',
    git: 'https://github.com/Conflux-Chain/ConfluxWeb/tree/conflux-web-1.2.1',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

// Npm.depends({
//     "xmlhttprequest": "1.7.0"
// });


Package.onUse(function(api) {
    api.versionsFrom('1.0.3.2');

    api.addFiles('dist/conflux-web.js', ['client']); // 'server'
});

/* jshint ignore:end */
