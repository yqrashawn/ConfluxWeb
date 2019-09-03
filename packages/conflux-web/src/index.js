/*
    This file is part of conflux-web.js.

    conflux-web.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    conflux-web.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with conflux-web.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.js
 * @authors:
 *   Fabian Vogelsteller <fabian@ethereum.org>
 *   Gav Wood <gav@parity.io>
 *   Jeffrey Wilcke <jeffrey.wilcke@ethereum.org>
 *   Marek Kotewicz <marek@parity.io>
 *   Marian Oancea <marian@ethereum.org>
 * @date 2017
 */

"use strict";


var version = require('../package.json').version;
var core = require('conflux-web-core');
var Cfx = require('conflux-web-cfx');
var Net = require('conflux-web-net');
//var Personal = require('conflux-web-eth-personal');
//var Shh = require('conflux-web-shh');
//var Bzz = require('conflux-web-bzz');
var utils = require('conflux-web-utils');

var ConfluxWeb = function ConfluxWeb() {
    var _this = this;

    // sets _requestmanager etc
    core.packageInit(this, arguments);

    this.version = version;
    this.utils = utils;

    this.cfx = new Cfx(this);
    //this.shh = new Shh(this);
    //this.bzz = new Bzz(this);

    // overwrite package setProvider
    var setProvider = this.setProvider;
    this.setProvider = function (provider, net) {
        setProvider.apply(_this, arguments);

        this.cfx.setProvider(provider, net);
        //this.shh.setProvider(provider, net);
        //this.bzz.setProvider(provider);

        return true;
    };
};

ConfluxWeb.version = version;
ConfluxWeb.utils = utils;
ConfluxWeb.modules = {
    Cfx: Cfx,
    Net: Net,
    //Personal: Personal,
    //Shh: Shh,
    //Bzz: Bzz
};

core.addProviders(ConfluxWeb);

module.exports = ConfluxWeb;

