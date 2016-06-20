var gulp = require("gulp");
var rename = require("gulp-rename");
var sourceMaps = require("gulp-sourcemaps");
var stylus = require("gulp-stylus");
var uglify = require("gulp-uglify");

var distPath = {
  root: "./dist/"
};

var sourcePath = {
  css: "./src/stylus/**/*.styl",
  javascript: "./src/javascripts/**/*.js",
  stylus: "./src/stylus/main.styl"
};

function addMinifiedFileSuffix(renameTask) {
  return renameTask({
    suffix: ".min"
  });
}

gulp.task("css", function() {
  return gulp.src(sourcePath.stylus)
    .pipe(sourceMaps.init())
      .pipe(stylus({
        compress: true
      }))
    .pipe(sourceMaps.write("."))
    .pipe(addMinifiedFileSuffix(rename))
    .pipe(gulp.dest(distPath.root));
});

gulp.task("js", function() {
  return gulp.src(sourcePath.javascript)
    .pipe(uglify())
    .pipe(addMinifiedFileSuffix(rename))
    .pipe(gulp.dest(distPath.root));
});

gulp.task("watch", function() {
  gulp.watch(sourcePath.css, ["css"]);
  gulp.watch(sourcePath.javascript, ["js"]);
});
