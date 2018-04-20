var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),
  stylus = require('gulp-stylus'),
  csslint = require('gulp-csslint'),
  autoPrefixer = require('gulp-autoprefixer'),
  // //if node version is lower than v.0.1.2
  // require('es6-promise').polyfill(),
  cssComb = require('gulp-csscomb'),
  cmq = require('gulp-merge-media-queries'),
  frontnote = require('gulp-frontnote'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  prettify = require('gulp-prettify'),
  concat = require('gulp-concat'),
  imageMin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  iconfont = require('gulp-iconfont'),
  consolidate = require('gulp-consolidate'),
  notify = require('gulp-notify'),
  uncss = require('gulp-uncss'),
  pug = require('gulp-pug'),
  babel = require('gulp-babel'),
  postcss = require('gulp-postcss'),
  svgo = require('postcss-svgo'),
  clean = require('gulp-clean'),
  jeet = require('jeet'),
  lost = require('lost');



gulp.task('stylus', function () {
  gulp.src(['src/styles/style.styl'])
    .pipe(sourcemaps.init())
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(frontnote({
      out: 'docs/css'
    }))
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(autoPrefixer())
    .pipe(cssComb())
    .pipe(cmq({
      log: true
    }))
    .pipe(csslint())
    .pipe(csslint.formatter())
    .pipe(uncss({
      html: ['dist/*.html', 'dist/**/*.html']
    }))
    // .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({
      stream: true
    }))
    .pipe(notify('css task finished'))
});


gulp.task('js', function () {
  gulp.src(['src/scripts/**/*.js'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(babel())
    // .pipe(concat('main.js'))
    .pipe(browserify())
    // .pipe(gulp.dest('dist/js'))
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    // .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({
      stream: true
    }))
    .pipe(notify('js task finished'))
});
gulp.task('pug', function () {
  gulp.src(['src/templates/*.pug'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(pug())
    .pipe(prettify())
    .pipe(gulp.dest('dist/'))
    .pipe(reload({
      stream: true
    }))
    .pipe(notify('html task finished'))
});


gulp.task('image', function () {
  gulp.src(['src/images/**/*'])
    .pipe(plumber({
        handleError: function (err) {
          console.log(err);
          this.emit('end');
        }
      })
      .pipe(cache(imageMin({
        optimizationLevel: 5
      })))
      .pipe(gulp.dest('dist/img'))
      .pipe(reload({
        stream: true
      }))
      .pipe(notify('image task finished')))
});


gulp.task('iconfont', function () {
  gulp.src(['src/fonts/**/*.svg'])
    .pipe(iconfont({
      fontName: 'myicon'
    }))
    .on('codepoints', function (codepoints) {
      var options = {
        glyphs: codepoints,
        fontName: 'myicon',
        fontFamily: 'myicon',
        className: 'icon',
        timestamp: Date.now()
      };
      gulp.src('src/fonts/template/**/*.css')
        .pipe(consolidate('lodash', options))
        .pipe(rename({
          basename: 'myicon'
        }))
        .pipe(gulp.dest('dist/fonts/template'));
      gulp.src('src/fonts/template/**/*.html')
        .pipe(consolidate('lodash', options))
        .pipe(rename({
          basename: 'myicon'
        }))
        .pipe(gulp.dest('dist/fonts/template'));
    })
    .pipe(gulp.dest('dist/fonts'))
    .pipe(reload({
      stream: true
    }))
});

gulp.task('clean', function () {
  return gulp.src('dist/*', {
      read: false
    })
    .pipe(clean());
})


gulp.task('watch', function () {
  // gulp.watch('dist/*', ['clean']);
  browserSync.init({
    server: "dist"
  });
  gulp.watch('src/scripts/**/*.js', ['js']);
  gulp.watch('src/styles/**/*.styl', ['stylus']);
  gulp.watch('src/templates/**/*.pug', ['pug']);
  gulp.watch('src/images/**/*', ['image']);
  gulp.watch('src/fonts/**/*.svg', ['iconfont']);
});

gulp.task('default', ['js', 'stylus', 'pug', 'image', 'iconfont', 'watch']);