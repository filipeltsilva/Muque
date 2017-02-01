'use strict';

const autoPrefixer = require('autoprefixer');
const config       = require('../config');
const cssMin       = require('gulp-cssmin');
const gulp         = require('gulp');
const koutoSwiss   = require('kouto-swiss');
const postCss      = require('gulp-postcss');
const plumber      = require('gulp-plumber');
const sourceMaps   = require('gulp-sourcemaps');
const stylus       = require('gulp-stylus');

function buildStyles() {
  return gulp.src(config.styles.mainFile)
    .pipe(plumber())
      .pipe(sourceMaps.init())
        .pipe(stylus({
          use: koutoSwiss()
        }))
        .pipe(postCss([
          autoPrefixer({
            browsers: [
              'last 3 versions',
              'Android >= 4',
              'IE >= 9'
            ]
          })
        ]))
      .pipe(sourceMaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.distRoot));
}

gulp.task('styles:dev', () => {
  return buildStyles();
});

gulp.task('styles:dist', () => {
  return buildStyles()
    .pipe(cssMin())
    .pipe(gulp.dest(config.distRoot));
});
