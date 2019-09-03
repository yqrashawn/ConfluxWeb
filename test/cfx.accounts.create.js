var Accounts = require("./../packages/conflux-web-cfx-accounts");
var ethers = require('ethers');
var chai = require('chai');
var assert = chai.assert;
var ConfluxWeb = require('../packages/conflux-web');
var web3 = new ConfluxWeb();

var tests = [];
for (var i = 0; i < 1000; i++) {
    tests.push(i);
}


describe("cfx", function () {
    describe("accounts", function () {

        tests.forEach(function (test, i) {
            it("create cfx.account, and compare to ethers wallet", function() {
                var ethAccounts = new Accounts();

                // create account
                var acc = ethAccounts.create();

                // create ethers wallet
                var ethWall = new ethers.Wallet(acc.privateKey);

                // compare addresses and private keys
                assert.equal(acc.address, ethWall.address);
                assert.equal(acc.privateKey, ethWall.privateKey);
            });

        });
    });
});
