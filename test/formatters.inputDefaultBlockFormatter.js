var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/conflux-web-core-helpers/src/formatters.js');

var tests = [
    //{ value: 'genesis', expected: '0x0' },
    { value: 'latest_state', expected: 'latest_state' },
    { value: 'latest_mined', expected: 'latest_mined' },
    { value: 'earliest', expected: '0x0' },
    { value: 1, expected: '0x1' },
    { value: '0x1', expected: '0x1' }
];

describe('lib/conflux-web/formatters', function () {
    describe('inputDefaultBlockNumberFormatter', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                assert.strictEqual(formatters.inputDefaultBlockNumberFormatter(test.value), test.expected);
            });
        });
    });
});



