var gulp = require("gulp");

var server = require("gulp-webserver");

var sass = require("gulp-sass");

var autoprefixer = require("gulp-autoprefixer");

var minCss = require("gulp-clean-css");

var rev = require("gulp-rev");

var revCollector = require("gulp-rev-collector");

var sequence = require("gulp-sequence");

var mock = require("./mock");


// gulp.task("css", function() {
//     return gulp.src("src/scss/*.scss")
//         .pipe(sass())
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions', 'Android >= 4.0']
//         }))
//         .pipe(minCss())
//         .pipe(rev())
//         .pipe(gulp.dest("src/css"))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest("rev/css"))
// })

gulp.task("css", function() {
    return gulp.src("src/scss/**/*.scss")
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        .pipe(minCss())
        .pipe(gulp.dest("src/css"))
})

gulp.task("server", ['css'], function() {
    gulp.src("src")
        .pipe(server({
            port: 9090,
            livereload: true,
            open: true,
            middleware: function(req, res, next) {
                if (/\/api/g.test(req.url)) {
                    res.setHeader("content-type", "text/json;charset=utf-8");
                    var data = mock(req.url);
                    res.end(JSON.stringify(data))
                }
                next()
            }
        }))
})

gulp.task("watch", function() {
    gulp.watch("src/scss/**/*.scss", ['css'])
})

gulp.task("copyHtml", function() {
    return gulp.src(['rev/**/*.json', 'src/*.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest("build"))
})

gulp.task("default", ['server', 'watch'])

// gulp.task("default", function(cb) {
//     sequence("css", "copyHtml", "server", "watch", cb)
// })