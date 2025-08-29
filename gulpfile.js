// Include gulp
import gulp from 'gulp';

// Include plugins
import log from 'fancy-log';
import colors from 'ansi-colors';

import plumber from 'gulp-plumber';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
const usingSass = gulpSass(sass);
import sourcemaps from 'gulp-sourcemaps';
import prefix from 'gulp-autoprefixer';
import rename from 'gulp-rename';

// Include browsersync
import browserSyncImport from 'browser-sync'
var browserSync = browserSyncImport.create();

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
        .pipe(usingSass({outputStyle: 'compressed'}).on('error', usingSass.logError))
        .pipe(prefix())
        .pipe(rename('style.css'))
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
        .pipe(usingSass().on('error', usingSass.logError))
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
