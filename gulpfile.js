// Include gulp
var gulp = require('gulp');

// Include plugins
var log = require('fancy-log');
var colors = require('ansi-colors');

var plumber = require('gulp-plumber');
var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');

// Include browsersync
var browserSync = require('browser-sync').create();

// Paths
var src = 'src/';
var dest = 'static/';

// Process & compress SCSS
gulp.task('sass', function() {
    return gulp.src(src + 'base.scss')
        .pipe(plumber(function(error) {
            log(colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(prefix())
        .pipe(gulp.dest('_site/' + dest));
});

// Process & sourcemap SCSS
gulp.task('sassDev', function() {
    return gulp.src(src + 'base.scss')
        .pipe(plumber(function(error) {
            log(colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename('style.css'))
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream());
});

// Copy SCSS
gulp.task('copy-scss', function() {
    return gulp.src(src + '*.scss')
        .pipe(gulp.dest(dest));
});

// Static Server + watching scss/html/js files
gulp.task('serve', function() {

    browserSync.init({
        files: ['_site/**'],
        port: 3000,
        proxy: '127.0.0.1:4000'
    });

    gulp.watch("src/*.scss", gulp.series('sassDev'));
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("*.md").on('change', browserSync.reload);
});

// Default task: serve with browserSync
gulp.task('default',
    gulp.series(
        'serve',
        gulp.parallel('sassDev', 'copy-scss')
    )
);

// Build task: everything minified only
gulp.task('build', gulp.parallel('sass'));
