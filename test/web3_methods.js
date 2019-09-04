var u = require('./helpers/test.utils.js');
var Web3 = require('../packages/conflux-web');
var web3 = new Web3();

describe('conflux-web', function() {
    describe('methods', function () {
        u.methodExists(web3, 'setProvider');

        u.propertyExists(web3, 'givenProvider');

        u.propertyExists(web3, 'cfx');

        u.propertyExists(web3, 'utils');
    });
});

