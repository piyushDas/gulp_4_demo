/*
    The format remains the same as it was. 
    That is declare the dependencies at the top
    Define individual tasks
    club them and export them

     One thing to pay attention to is that, 
     with Gulp 4, we need to explicitly signal task completion for each function. 
     You can do that in six ways: 
        - return a stream, 
        - return a promise,
        - return a child process, 
        - callback, 
        - return an event emitter, 
        - return an observable. 
    If you do not do it properly, you will get the infamous 
    "Did you forget to signal async completion?" 
    message in your console and the task will not complete.

*/

var gulp = require("gulp"),
    del = require("del"),
    browserify = require("browserify"),
    cssnano = require("cssnano"),
	postcss = require("gulp-postcss"),
    buffer = require("vinyl-buffer"),
    source = require("vinyl-source-stream")
    uglify = require("gulp-uglify")
    concatCss = require('gulp-concat-css');

/* 
    Always preferable to use paths object declared above
    to keep a track of your paths at one place
    Not a science - "Simply keeps things sorted" 
*/
var paths = {
    styles: {
        // By using styles/**/*.sass or .css we're telling gulp to check all folders for any style file
        src: "styles/**/*.css",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "dist/css"
    },

    scripts: {
        // By using scripts/**/*.js we're telling gulp to check all folders for any script file
        src: "scripts/**/*.js",
        // Compiled files will end up in whichever folder it's found
        dest: "dist/js"
    },
 
    // Easily add additional paths
    html: {
     src: './*.html',
     dest: 'dist/'
    }
}

/* 
    Use it When need to do style manipulations
*/
function style() {
    return gulp
        .src(paths.styles.src)
        .pipe(postcss([cssnano()]))
        .pipe(concatCss("chu_sid_ka_style.css"))
        .pipe(gulp.dest(paths.styles.dest))
}

/* 
    Use it before every build just to delete assets
    Though not mandatory as new build will always replace the old one
    Just recommmended
*/
function clean() {
    return del(["./dist"])
}

function copyHtml() {
    return gulp
        .src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
}

/* 
    Transpile, concatenate and minify scripts
*/
function scripts() {
    return (
        // gulp
        // .src(paths.scripts.src)
        // // .pipe(webpackstream(webpackconfig, webpack))
        // // folder only, filename is specified in webpack config
        // .pipe(gulp.dest(paths.scripts.dest))
        browserify({
            entries: [
                "./scripts/app.js",
                "./scripts/time-picker.js",
            ]
        })
        // Bundle it all up!
        .bundle()
		.pipe(source("chu_sid_ka_script.js"))
        .pipe(buffer())
        .pipe(uglify())
        // Then write the resulting files to a folder
        .pipe(gulp.dest(paths.scripts.dest))
    )
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(style, scripts, copyHtml))
 
/*
 * You can still use `gulp.task` to expose tasks
 */
//gulp.task('build', build);

exports.clean = clean
exports.style = style
exports.scripts = scripts
exports.build = build
exports.default = build