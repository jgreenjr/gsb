var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');

gulp.task('codeQualityTravis', function(){
    gulp.src(['./app.js','./Services/*.js', './Routes/*.js','./Models/*.js', './test/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', function(){
            // Exits gulp with error
            process.exit(1);
        });
})

gulp.task('codeQuality', function(){
    gulp.src(['./app.js','./Services/*.js', './Routes/*.js','./Models/*.js', './test/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('travisTest', function(){
    gulp.src('test/*.js')
        .pipe(mocha())
        .on('error', function(){
            // Exits gulp with error
            process.exit(1);
        });
});
gulp.task('test', function(){
    gulp.src('test/*.js')
        .pipe(mocha());
});

gulp.task('watch', function(){
    gulp.watch(['./app.js','./Services/*.js', './Routes/*.js','./Models/*.js', './test/*.js'], ['test','codeQuality', 'start']);
});

gulp.task('start', function () {
    nodemon({
        script: 'app.js'
        , ext: 'js html'
        , env: { 'NODE_ENV': 'development' }
    })
});

gulp.task('travis', ['travisTest','codeQualityTravis']);

gulp.task('default',['watch', 'test', 'codeQuality','start']);