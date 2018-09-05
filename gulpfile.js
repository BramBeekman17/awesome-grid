var gulp = require('gulp');
var sass = require('gulp-sass');
let cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var php = require('gulp-connect-php');
var sourcemaps = require('gulp-sourcemaps');

// SASS and JS sources and destination
var sassFiles = '_src/scss/**/*.scss',
    sassDest = 'web/assets/css/',
    jsFiles = '_src/js/**/*.js',
    jsDest = 'web/assets/js/';


// Run this to add the fonts
gulp.task('fonts', function () {
    gulp.src(['_src/fonts/**/*']).pipe(gulp.dest('web/assets/fonts'));
});

// Gulp SASS Task
gulp.task('sass', function () {
    return gulp.src('_src/scss/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(sassDest))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Gulp Javavscript Task
gulp.task('js', function () {
    return gulp.src('_src/js/app.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Browsersync running with php
gulp.task('php', function () {
    php.server({ base: 'web', port: 8010, keepalive: true });
});

// Gulp BrowserSync
gulp.task('browserSync', ['php'], function () {
    browserSync.init({
        proxy: '127.0.0.1:8010',
        port: 8080,
        notify: false,
        open: false
    })
});

// Gulp Default task
gulp.task('default', ['browserSync', 'sass', 'js'], function () {
    gulp.watch(sassFiles, ['sass']);
    gulp.watch(jsFiles, ['js']);

    gulp.watch('templates/**/*', browserSync.reload);
});