var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var eslint = require('gulp-eslint');

gulp.task('codeQualityTravis', function () {
    gulp.src(['./app.js', './Services/*.js', './Routes/*.js', './Models/*.js', './test/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('error', function () {
            // Exits gulp with error
            process.exit(1);
        });
})

gulp.task('codeQuality', function () {
    gulp.src(['./app.js', './Services/*.js', './Routes/*.js', './Models/*.js', './test/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('travisTest', function () {
    gulp.src('test/*.js')
        .pipe(mocha())
        .on('error', function () {
            // Exits gulp with error
            process.exit(1);
        });
});
gulp.task('test', function () {
    gulp.src('test/*.js')
        .pipe(mocha());
});

gulp.task('watch', function () {
    gulp.watch(['./app.js', './Services/*.js', './Routes/*.js', './Models/*.js', './test/*.js'], ['test', 'codeQuality']);
});

gulp.task('start', function () {
    nodemon({
        script: 'app.js',
        ext: 'js html',
        ignore: ['html/**.*', 'v2/**.*'],
        env: { 'NODE_ENV': 'development' }
    })
});

gulp.task('travis', ['travisTest', 'codeQualityTravis']);

gulp.task('default', ['watch', 'test', 'codeQuality', 'start']);
