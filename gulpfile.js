var gulp = require("gulp");

var server = require("gulp-webserver");

var sass = require("gulp-sass");

var autoprefixer = require("gulp-autoprefixer");

var minCss = require("gulp-clean-css");

var rev = require("gulp-rev");

var revCollector = require("gulp-rev-collector");

var sequence = require("gulp-sequence");

var mock = require("./mock");

var querystring = require('querystring');

var userList = [{
    username: 'wang',
    pwd: '123',
    isLogin: false
}]


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
                if (req.url == '/login') {
                    var chunkArr = [];
                    req.on('data', function(chunk) {
                        chunkArr.push(chunk)
                    })
                    req.on('end', function() {
                        var params = querystring.parse(Buffer.concat(chunkArr).toString());
                        var mask = false;
                        userList.forEach(function(item, index) {
                            if (item.username === params.username && item.pwd === params.pwd) {
                                item.isLogin = true;
                                mask = true;
                                res.end(JSON.stringify({ code: 1, msg: '登录成功' }))
                            }
                        })
                        if (!mask) {
                            res.end(JSON.stringify({ code: 2, msg: '登录失败' }))
                        }
                        next()
                    })
                    return false;
                } else if (req.url == '/isLogin') {
                    var chunkArr = [];
                    req.on('data', function(chunk) {
                        chunkArr.push(chunk)
                    })
                    req.on('end', function() {
                        var params = querystring.parse(Buffer.concat(chunkArr).toString());
                        var mask = false;
                        userList.forEach(function(item, index) {
                            if (item.username === params.username) {
                                mask = true;
                                res.end(JSON.stringify({ code: 1, result: item.isLogin }))
                            }
                        })
                        if (!mask) {
                            res.end(JSON.stringify({ code: 2, msg: '请登录' }))
                        };
                        next()
                    })
                    return false;
                }

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