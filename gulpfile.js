#!/usr/bin/env node

'use strict';

var lernaJSON = require('./lerna.json');
var path = require('path');

var del = require('del');
var gulp = require('gulp');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
var bower = require('bower');
var streamify = require('gulp-streamify');
var replace = require('gulp-replace');
var exec = require('child_process').exec;

var DEST = path.join(__dirname, 'dist/');

var packages = [{
    fileName: 'conflux-web',
    expose: 'ConfluxWeb',
    src: './packages/conflux-web/src/index.js',
    ignore: ['xmlhttprequest']
}, {
    fileName: 'conflux-web-utils',
    expose: 'ConfluxWebUtils',
    src: './packages/conflux-web-utils/src/index.js'
}, {
    fileName: 'conflux-web-cfx',
    expose: 'ConfluxWebCfx',
    src: './packages/conflux-web-cfx/src/index.js'
}, {
    fileName: 'conflux-web-cfx-accounts',
    expose: 'ConfluxWebCfxAccounts',
    src: './packages/conflux-web-cfx-accounts/src/index.js'
}, {
    fileName: 'conflux-web-cfx-contract',
    expose: 'ConfluxWebCfxContract',
    src: './packages/conflux-web-cfx-contract/src/index.js'
},{
    fileName: 'conflux-web-cfx-iban',
    expose: 'ConfluxWebCfxIban',
    src: './packages/conflux-web-cfx-iban/src/index.js'
}, {
    fileName: 'conflux-web-cfx-abi',
    expose: 'ConfluxWebCfxAbi',
    src: './packages/conflux-web-cfx-abi/src/index.js'
},{
    fileName: 'conflux-web-net',
    expose: 'ConfluxWebNet',
    src: './packages/conflux-web-net/src/index.js'
},{
    fileName: 'conflux-web-providers-ipc',
    expose: 'ConfluxWebIpcProvider',
    src: './packages/conflux-web-providers-ipc/src/index.js'
}, {
    fileName: 'conflux-web-providers-http',
    expose: 'ConfluxWebHttpProvider',
    src: './packages/conflux-web-providers-http/src/index.js',
    ignore: ['xmlhttprequest']
}, {
    fileName: 'conflux-web-providers-ws',
    expose: 'ConfluxWebWsProvider',
    src: './packages/conflux-web-providers-ws/src/index.js',
}, {
    fileName: 'conflux-web-core-subscriptions',
    expose: 'ConfluxWebSubscriptions',
    src: './packages/conflux-web-core-subscriptions/src/index.js'
}, {
    fileName: 'conflux-web-core-requestmanager',
    expose: 'ConfluxWebRequestManager',
    src: './packages/conflux-web-core-requestmanager/src/index.js'
}, {
    fileName: 'conflux-web-core-promievent',
    expose: 'ConfluxWebPromiEvent',
    src: './packages/conflux-web-core-promievent/src/index.js'
}, {
    fileName: 'conflux-web-core-method',
    expose: 'ConfluxWebMethod',
    src: './packages/conflux-web-core-method/src/index.js'
}];

var browserifyOptions = {
    debug: true,
    // standalone: 'ConfluxWeb',
    derequire: true,
    insertGlobalVars: false, // jshint ignore:line
    detectGlobals: true,
    bundleExternal: true
};

var ugliyOptions = {
    compress: {
        dead_code: true,  // jshint ignore:line
        drop_debugger: true,  // jshint ignore:line
        global_defs: {      // jshint ignore:line
            "DEBUG": false      // matters for some libraries
        }
    }
};

gulp.task('version', function () {
    if (!lernaJSON.version) {
        throw new Error("version property is missing from lerna.json");
    }

    var version = lernaJSON.version;
    var jsonPattern = /"version": "[.0-9\-a-z]*"/;
    var jsPattern = /version: '[.0-9\-a-z]*'/;
    var glob = [
        './package.json',
        './bower.json',
        './package.js'
    ];

    return gulp.src(glob, {base: './'})
        .pipe(replace(jsonPattern, '"version": "' + version + '"'))
        .pipe(replace(jsPattern, "version: '" + version + "'"))
        .pipe(gulp.dest('./'));
});

gulp.task('bower', gulp.series('version', function (cb) {
    bower.commands.install().on('end', function (installed) {
        console.log(installed);
        cb();
    });
}));

gulp.task('lint', function () {
    return gulp.src(['./*.js', './lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', gulp.series('lint', function (cb) {
    del([DEST]).then(cb.bind(null, null));
}));

packages.forEach(function (pckg, i) {
    var prevPckg = (!i) ? 'clean' : packages[i - 1].fileName;

    gulp.task(pckg.fileName, gulp.series(prevPckg, function () {
        browserifyOptions.standalone = pckg.expose;

        var pipe = browserify(browserifyOptions)
            .require(pckg.src, { expose: pckg.expose })
            .require('bn.js', { expose: 'BN' }) // expose it to dapp developers
            .add(pckg.src);

        if (pckg.ignore) {
            pckg.ignore.forEach(function (ignore) {
                pipe.ignore(ignore);
            });
        }

        return pipe.bundle()
            .pipe(exorcist(path.join(DEST, pckg.fileName + '.js.map')))
            .pipe(source(pckg.fileName + '.js'))
            .pipe(streamify(babel({
                compact: false,
                presets: ['env']
            })))
            .pipe(gulp.dest(DEST))
            .pipe(streamify(babel({
                compact: true,
                presets: ['env']
            })))
            .pipe(streamify(uglify(ugliyOptions)))
            .on('error', function (err) { console.error(err); })
            .pipe(rename(pckg.fileName + '.min.js'))
            .pipe(gulp.dest(DEST));
    }));
});

gulp.task('publishTag', function () {
    exec("git commit -am \"add tag v"+ lernaJSON.version +"\"; git tag v"+ lernaJSON.version +"; git push origin v"+ lernaJSON.version +";");
});

gulp.task('watch', function () {
    gulp.watch(['./packages/conflux-web/src/*.js'], gulp.series('lint', 'default'));
});

gulp.task('all', gulp.series('version', 'lint', 'clean', packages[packages.length - 1].fileName));

gulp.task('default', gulp.series('version', 'lint', 'clean', packages[0].fileName));
