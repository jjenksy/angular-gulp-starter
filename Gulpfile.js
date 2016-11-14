/**
 * Created by
 *  John Jenkins
 */

"use strict";
const gulp = require('gulp');
const args = require('yargs').argv;
//require are configuration object
const config = require('./gulp.config')();
///load all the gulp plugins that are in the package.json
const $ = require('gulp-load-plugins')({lazy: true});
//delete file
const del = require('del');
//the port is either the arg from the command line of the config port
const port = process.env.PORT || config.defaultPort;

const browserSync = require('browser-sync');

const ngannotate = require('gulp-ng-annotate');
//update revision numbers and replace them so browser is not caching old
//client files
const gulpRev = require('gulp-rev');
const gulpRevReplace = require('gulp-rev-replace');
//increment the versions
const gulpBump = require('gulp-bump');

// setup gulp task
gulp.task('help', function(){

    $.taskListing();

    log('You would not need help if you were using WebStorm,' +
        ' you could have just opened the Gulp window.');

});
//set the default task as help
gulp.task('default', ['help']);
/**
 * Telling gulp to read all js root and src js files
 * and pipe them into jscs and jshint
 */
gulp.task('vet', function () {
    log('Analyzing source with JSHINT and JSCS');
    gulp.src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        // if gulp vet is called with
        // --verbose it will output all the file we are checking
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish',{verbose: true}))
        .pipe($.jshint.reporter('fail'));

});

/**
 * styles this task is for compiling css
 * the clean-styles task will run before the styles task
 * because we passed it in as an array parameter
 */
gulp.task('styles',['clean-styles'], function () {
    log('Compiling Less ---> CSS');

    return gulp
        .src(config.less)
        .pipe($.plumber()) // plumber shows the error messages but keeps the pipe working
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.temp));
});

//font-awesome build step
gulp.task('images',['clean-images'], function () {
    log('Copying and compressing the images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'images'));
});

//images build step
gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying the fonts...');
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});
//clean all build files
gulp.task('clean', function (done) {
    const deleteconfig = [].concat(config.build, config.temp);

    log('Cleaning '+ $.util.colors.blue(deleteconfig));
    //delete the files
    del(deleteconfig, done);
});
//task to cleanup styles
gulp.task('clean-styles', function (done) {
    const files = config.temp + '**/*.css';
    //delete the files
    clean(files, done);
});

//task to cleanup fonts
gulp.task('clean-fonts', function (done) {
    const files = config.build + 'fonts/**/*.*';
    //delete the files
    clean(files, done);
});

//task to cleanup images
gulp.task('clean-images', function (done) {
    const files = config.build + 'images/**/*.*';
    //delete the files
    clean(files, done);
});

gulp.task('clean-code', function(done) {
    const files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    clean(files, done);
});
//watches the less css file for changes
gulp.task('less-watcher', function () {
    //watch the less file and update the css
   gulp.watch([config.less],['styles']);
});
//caches the html and minifies it
gulp.task('templatecache', ['clean-code'], function() {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
       .pipe($.minifyHtml({empty: true}))
        //run the gulp-angular-tempcache plugin
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});


/**
 * Wire in bower and Js file dependencies
 * this can be ran manually and also runs every time
 * a bower install or bower uninstall is perforemed
 * this method does not complile the less file
 */
gulp.task('wiredep', function() {
    const options = config.getWiredepDefaultOptions();
    const wiredep = require('wiredep').stream;
    log('Wire up the bower css js and our app js into the html');
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});


/**
 * This methid runs wiredep to inject all the bower and scripts and compiles the customm css
 * and injects the custom stylesheet
 */
gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function() {
    log('Wire up the app css into the html, and call wiredep ');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});

/**
 * This task optimizes all are js files into one and
 * optomizes html and css as well this uses the useref plugin
 * https://www.npmjs.com/package/gulp-useref
 * This gets the templates from the template cache and injects them into
 * the default.html
 */
gulp.task('optimize', ['inject', 'fonts', 'images'], function() {
    const templateCache = config.temp + config.templateCache.file;
    //use gulp filter to get all the css and javascript
    /**
     * Enables you to work on a subset of the original files by filtering them using globbing.
     * When you're done and want all the original files back you just use the restore stream.
     */
    const cssFilter = $.filter('**/*.css', {restore: true});
    /**
     * We split the filter into two diffrent varibles so we
     * could use ngannotate gulp plug in to apply any  angularjs dependency
     * injection annotations with ng-annotate so uglifly does not break
     */
    //filter for the 3rd party libraries
    const jsLibFilter = $.filter('**/'+config.optimized.lib, {restore: true});
    //filter for the custom js code
    const jsAppFilter = $.filter('**/'+config.optimized.app, {restore: true});

    log('Optimizing the Javascript, CSS and HTML');

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(
            gulp.src(templateCache, {read: false}), {
                starttag: '<!-- inject:templates:js -->'
            }))
        .pipe($.useref({searchPath: './'}))
        .pipe(cssFilter)
        .pipe($.csso())//css optimizer helps to optimize and minimize css
        .pipe(cssFilter.restore)
        .pipe(jsLibFilter)
        .pipe($.uglify())//minify and mangle the javascript
        .pipe(jsLibFilter.restore)
        .pipe(jsAppFilter)
        //add the annotations
        .pipe(ngannotate())
        .pipe($.uglify())//minify and mangle the javascript
        .pipe(jsAppFilter.restore)
        //do the revisions
        .pipe(gulpRev())//app.js name changed here
        .pipe(gulpRevReplace())//renames inside the html with new named revision
        .pipe(gulp.dest(config.build))
        .pipe(gulpRev.manifest())//write out the changes to a manifest in build file
        .pipe(gulp.dest(config.build));
});
/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function () {
    let msg = 'Bumping versions';
    let type = args.type;
    let version = args.version;
    let options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe(gulpBump(options))
        .pipe(gulp.dest(config.root));

});
/**
 * Starts the serve in build mode
 */
gulp.task('serve-build', ['optimize'], function() {
    serve(false /* isDev */);
});
/**
 * serve-dev this task restarts server on changes to dev files
 */
gulp.task('serve-dev', ['inject'], function() {
    serve(true /* isDev */);
});



///////////////////

/**
 * Function to start the server in dev or build mode depending upon the
 * selected task
 * @param isDev
 * @returns {*}
 */
function serve(isDev) {
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function() {
            log('*** nodemon started');
            startBrowserSync(isDev);
        })
        .on('crash', function() {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function() {
            log('*** nodemon exited cleanly');
        });
}
/**
 * Change event logs out what changes
 * @param event
 */
function changeEvent(event) {
    //strip down the file path with a regex
    const srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * This function uses the browser-sync node plugin
 * https://www.browsersync.io/
 * This insures the browser stays in sync not needing to refresh
 */
function startBrowserSync() {
    const options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [ //the files we are watching and re-serving up
            config.client + '**/*.*',
            '!' + config.less,
            config.temp + '**/*.css'
        ],
        //ghostmode tracks these settings
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,//it will inject changes instead of reloading
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0 //1000
    };

    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);
    //if the less changes convert it to css
    gulp.watch([config.less], ['styles'])
        .on('change', function(event) { changeEvent(event); });



    browserSync(options);
}
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));

    /**
     * Del returns a promise that we can resolve by thening it
     */
    del(path)
        .then(paths => {
            log('The path for deletion of file ' + paths);
            done();
        });

}
function log(msg) {
    if(typeof(msg) === 'object'){
        for (var item in msg){
            if (msg.hasOwnProperty(item)){
                //setup util message and color
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    }
    else{
        //setup util message and color
        $.util.log($.util.colors.blue(msg));
    }
}
