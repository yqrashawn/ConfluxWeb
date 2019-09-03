var u = require('./helpers/test.utils.js');
var utils = require('../packages/conflux-web-utils');

describe('utils', function() {
    describe('methods', function () {
        u.methodExists(utils, 'sha3');
        u.methodExists(utils, 'hexToAscii');
        u.methodExists(utils, 'asciiToHex');
        u.methodExists(utils, 'hexToNumberString');
        u.methodExists(utils, 'numberToHex');
        u.methodExists(utils, 'fromWei');
        u.methodExists(utils, 'toWei');
        u.methodExists(utils, 'toBN');
        u.methodExists(utils, 'isAddress');
    });
});

