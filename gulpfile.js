'use strict';

var gulp       = require('gulp');
var connect    = require('gulp-connect');
var imageMin   = require('gulp-imagemin');
var koutoSwiss = require('kouto-swiss');
var rename     = require('gulp-rename');
var sourceMaps = require('gulp-sourcemaps');
var stylus     = require('gulp-stylus');
var uglify     = require('gulp-uglify');

var distPath = {
  images: './dist/images/',
  maps  : './maps/',
  root  : './dist/'
};

var sourcePath = {
  css       : './src/stylus/**/*.styl',
  images    : './src/images/**',
  javascript: './src/javascripts/**/*.js',
  stylus    : './src/stylus/main.styl'
};

function addMinifiedFileSuffix(renamedTask) {
  return renamedTask({
    suffix: '.min'
  });
}

gulp.task('css', () => {
  return gulp.src(sourcePath.stylus)
    .pipe(sourceMaps.init())
      .pipe(stylus({
        compress: true,
        use: koutoSwiss()
      }))
    .pipe(sourceMaps.write(distPath.maps))
    .pipe(addMinifiedFileSuffix(rename))
    .pipe(gulp.dest(distPath.root));
});

gulp.task('images', () => {
  return gulp.src(sourcePath.images)
    .pipe(imageMin())
    .pipe(gulp.dest(distPath.images));
});

gulp.task('js', () => {
  return gulp.src(sourcePath.javascript)
    .pipe(sourceMaps.init())
      .pipe(uglify())
    .pipe(sourceMaps.write(distPath.maps))
    .pipe(addMinifiedFileSuffix(rename))
    .pipe(gulp.dest(distPath.root));
});

gulp.task('reload', () => {
  return gulp.src('./dist/**/*')
    .pipe(connect.reload());
});

gulp.task('server', () => {
  connect.server({
    livereload: true,
    port: 9999,
    root: distPath.root
  })
});

gulp.task('watch', () => {
  gulp.watch('./dist/**/*', ['reload']);
  gulp.watch(sourcePath.css, ['css']);
  gulp.watch(sourcePath.images, ['images']);
  gulp.watch(sourcePath.javascript, ['js']);
});

gulp.task('default', ['server', 'watch']);
