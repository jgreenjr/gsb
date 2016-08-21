var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function(){
    gulp.src('test/*.js')
        .pipe(mocha());
})

gulp.task('watch', function(){
    gulp.watch(['./app.js','./Services/*.js', './Routes/*.js','./Models/*.js', './test/*.js'], ['test']);
});

gulp.task('default',['watch', 'test']);