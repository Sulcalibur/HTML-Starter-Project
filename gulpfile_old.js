// Gulp.js configuration
var gulp        = require('gulp'),
    uncss       = require('gulp-uncss'),
    pug         = require('gulp-pug'),
    data        = require('gulp-data'),
    babel       = require('gulp-babel'),
    sourcemaps  = require('gulp-sourcemaps'),
    imagemin    = require('gulp-imagemin'),
    stylus      = require('gulp-stylus'),
    postcss     = require('gulp-postcss'),
    svgo        = require('postcss-svgo'),
    clean       = require('gulp-clean'),
    prettify    = require('gulp-prettify'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    browserSync = require('browser-sync')
;

var paths = {
  scripts: 'src/scripts/**/*',
  images: 'src/images/**/*',
  fonts: 'src/fonts/**/*',
  styles: 'src/styles/**/*',
  templates: 'src/templates/**/*'
};

gulp.task('styles', function () {
  return gulp.src('src/styles/style.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(uncss({
      html: ['dist/*.html', 'dist/**/*.html']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    // Pass in options to the task 
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('templates', function distHTML() {
  return gulp.src('src/templates/*.pug')
    .pipe(pug())
    .pipe(prettify())
    .pipe(gulp.dest('dist/'))
});

gulp.task('scripts', function () {
  gulp.src('src/scripts/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
});

gulp.task('browser-sync', function () {
  var files = [
    'dist/**/*.html',
    'dist/**/*.html',
    'dist/css/**/*.css',
    'dist/img/**/*.svg',
    'dist/img/**/*.jpg',
    'dist/img/**/*.gif',
    'dist/img/**/*.png',
    'dist/js/**/*.js'
  ];

  browserSync.init(files, {
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.fonts, ['fonts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.templates, ['templates']);
});

gulp.task('default', ['watch', 'scripts', 'images', 'templates', 'styles', 'browser-sync']);


