let gulp = require('gulp');
let nodemon = require('gulp-nodemon');
let browserSync = require('browser-sync').create();

gulp.task('nodemon', ['inject'], function(cb) {
  var started = false;

  return nodemon({
    script: 'app.js'
  }).on('start', function() {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('serve', ['nodemon'], function(){
    browserSync.init({
    proxy: 'http://localhost:3001',
    browser: 'chrome',
    port: 7000
  });
    console.log(2222);  

    gulp.watch('views/**/*.+(css|js|png|jpg|jpeg)', ['inject'])
    .on('change', browserSync.reload);
});