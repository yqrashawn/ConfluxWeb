var testMethod = require('./helpers/test.method.js');

var method = 'isMining';
var call = 'cfx_mining';

var tests = [{
    result: true,
    formattedResult: true,
    call: call
}];


testMethod.runTests('cfx', method, tests);
