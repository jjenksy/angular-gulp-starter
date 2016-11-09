/**
 * Created by jjenkins on 11/9/2016.
 */
const gulp = require('gulp');
const args = require('yargs').argv;
//require are configuration object
const config = require('./gulp.config')();
///load all the gulp plugins that are in the package.json
const $ = require('gulp-load-plugins')({lazy: true});
//delete file
const del = require('del');


// setup gulp task
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
gulp.task('styles', function () {
    log('Compiling Less ---> CSS');

    return gulp
        .src(config.less)
        .pipe($.plumber()) // plumber shows the error messages but keeps the pipe working
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.temp));
});

//task to cleanup styles
gulp.task('clean-styles', function (done) {
    const files = config.temp + '**/*.css';
    //delete the files
    cleanPath(files, done);
});

gulp.task('less-watcher', function () {
    //watch the less file and update the css
   gulp.watch([config.less],['styles']);
});

///////////////////

function cleanPath(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
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
