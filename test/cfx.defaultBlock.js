var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/conflux-web-cfx');

var eth = new Eth();

var setValue = 123;

describe('web3.eth', function () {
    describe('defaultBlock', function () {
        it('should check if defaultBlock is set to proper value', function () {
            assert.equal(eth.defaultBlock, 'latest_state');
            assert.equal(eth.personal.defaultBlock, 'latest_state');
            assert.equal(eth.Contract.defaultBlock, 'latest_state');
            assert.equal(eth.getCode.method.defaultBlock, 'latest_state');
        });
        it('should set defaultBlock for all sub packages is set to proper value, if Eth package is changed', function () {
            eth.defaultBlock = setValue;

            assert.equal(eth.defaultBlock, setValue);
            assert.equal(eth.personal.defaultBlock, setValue);
            assert.equal(eth.Contract.defaultBlock, setValue);
            assert.equal(eth.getCode.method.defaultBlock, setValue);
        });
    });
});

