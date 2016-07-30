'use strict';

var gulp        = require('gulp')
  , browserSync = require('browser-sync').create()
  , changed     = require('gulp-changed')
  , gitDeploy   = require('gulp-deploy-git')
  , imageMin    = require('gulp-imagemin')
  , koutoSwiss  = require('kouto-swiss')
  , plumber     = require('gulp-plumber')
  , rename      = require('gulp-rename')
  , sourceMaps  = require('gulp-sourcemaps')
  , stylus      = require('gulp-stylus')
  , uglify      = require('gulp-uglify')
;

var distPath = {
  images: './dist/images/',
  root  : './dist/'
};

var sourcePath = {
  css           : './src/stylus/**/*.styl',
  images        : './src/images/**',
  javascript    : './src/javascripts/**/*.js',
  stylusMainFile: './src/stylus/main.styl'
};

function addMinifiedFileSuffix(renamedTask) {
  return renamedTask({
    suffix: '.min'
  });
}

gulp.task('browser-sync', () => {
  browserSync.init({
    server: distPath.root
  });

  gulp.watch([sourcePath.css, sourcePath.stylusMainFile], ['css']);
  gulp.watch(sourcePath.images, ['images']);
  gulp.watch(sourcePath.javascript, ['js']);
});

gulp.task('git-deploy', () => {
  return gulp.src(distPath.root + '**/*', {read: false})
    .pipe(gitDeploy({
      branches: ['master'],
      debug: true,
      repository: 'https://github.com/filipeltsilva/filipeltsilva.github.io.git'
    }));
});

gulp.task('css', () => {
  return gulp.src(sourcePath.stylusMainFile)
    .pipe(plumber())
    .pipe(sourceMaps.init())
      .pipe(stylus({
        compress: true,
        use: koutoSwiss()
      }))
    .pipe(sourceMaps.write())
    .pipe(addMinifiedFileSuffix(rename))
    .pipe(plumber.stop())
    .pipe(gulp.dest(distPath.root))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src(sourcePath.images)
    .pipe(plumber())
    .pipe(changed(distPath.images))
    .pipe(imageMin())
    .pipe(plumber.stop())
    .pipe(gulp.dest(distPath.images))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src(sourcePath.javascript)
    .pipe(plumber())
    .pipe(sourceMaps.init())
      .pipe(uglify())
    .pipe(sourceMaps.write())
    .pipe(addMinifiedFileSuffix(rename))
    .pipe(plumber.stop())
    .pipe(gulp.dest(distPath.root))
    .pipe(browserSync.stream());
});

gulp.task('default', ['browser-sync']);
