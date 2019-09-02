var chai = require('chai');
var assert = chai.assert;

var errors = require('../packages/conflux-web-core-helpers/src/errors.js');

describe('lib/conflux-web/method', function () {
    describe('getCall', function () {

        for(var key in errors) {
            it('should return and error', function () {

                assert.instanceOf(errors[key](), Error);
            });
        }

    });
});

