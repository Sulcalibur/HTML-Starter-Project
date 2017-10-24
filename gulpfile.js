// Gulp.js configuration
var gulp = require('gulp');
var uncss = require('gulp-uncss');

// development mode?
// devBuild = (process.env.NODE_ENV !== 'production'),

// folders
//   folder = {
//     src: 'src/',
//     build: 'build/'
//   }
// ;

gulp.task('default', function () {
  return gulp.src('build/css/styles.css')
    .pipe(uncss({
      html: ['build/*.html', 'build/**/*.html']
    }))
    .pipe(gulp.dest('build/css/out'));
});