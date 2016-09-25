/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
//require sass plugin
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

//test task
gulp.task('hello', function () {
  console.log('Vo Tuan Trung - Front-end Developer');
});

//SCSS compiler task
gulp.task('sass', function () {
  return gulp.src('app/scss/styles.scss')
    .pipe(sass()) // converts SCSS to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//browser sync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

//concatenate file
gulp.task('useref', function () {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('dist:clear', function () {
  return del.sync('dist');
})

gulp.task('cache:clear', function (callback) {
  return cache.clearAll();
})

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

//dev task
gulp.task('default', function (callback) {
  runSequence(['hello', 'sass', 'browserSync', 'watch'], callback)
})

//distribution task
gulp.task('build', function (callback) {
  runSequence('dist:clean', ['sass', 'useref', 'images', 'fonts'], callback)
})
