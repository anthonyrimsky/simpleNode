var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintXMLReporter = require('gulp-jshint-xml-file-reporter');

gulp.task('default', function () {
    // Start gulp task
    return gulp.src(['public/includes/scripts/*.js']).pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('gulp-jshint-file-reporter', {
            filename: __dirname + '/reports/jshint-output.report'
        }))
        .pipe(jshint.reporter(jshintXMLReporter))
        .on('end', jshintXMLReporter.writeFile({
            format: 'checkstyle',
            filepath : './reports/jshint.xml',
            alwaysReport: true
        }));
});