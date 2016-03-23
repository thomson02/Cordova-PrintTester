/// <binding BeforeBuild='BEFORE_BUILD' />
var gulp = require("gulp");


gulp.task('moveJQueryToLib', function() {
    return gulp.src('./bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./www/lib/'));
});


gulp.task('BEFORE_BUILD', ['moveJQueryToLib']);