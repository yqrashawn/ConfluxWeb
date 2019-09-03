var testMethod = require('./helpers/test.method.js');

var method = 'getBlockNumber';

var tests = [{
    result: '0xb',
    formattedResult: 11,
    call: 'cfx_blockNumber'
}];


testMethod.runTests('cfx', method, tests);
