var testMethod = require('./helpers/test.method.js');

var method = 'getProtocolVersion';
var call = 'cfx_protocolVersion';

var tests = [{
    result: '12345',
    formattedResult: '12345',
    call: call
}];


testMethod.runTests('cfx', method, tests);
