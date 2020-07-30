const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    pug = require('gulp-pug'),
    concat = require('gulp-concat'),
    img = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename');
//prefix = require('gulp-autoprefixer');

let pathBuild = './dist/';

gulp.task('less', function () {
    return gulp.src('src/css/**/*.less')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 15 versions'], cascade: false }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(pathBuild + 'css'));
});

gulp.task('allcss', () => {
    return gulp.src('src/css/*.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('src/css'));
});

gulp.task('cleanCSSBuild', () => {
    return gulp.src(pathBuild + 'css/main.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(pathBuild + 'css/'))
});

gulp.task('pug', function () {
    return gulp.src('src/html/extends/*.pug')
        .pipe(pug({ pretty: '\t' }))
        .pipe(gulp.dest('src/'));
});

gulp.task('js', function () {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(pathBuild + 'js'));
});

gulp.task('img', () => {
    return gulp.src('src/img/*.+(jpg|png)')
        .pipe(img())
        .pipe(gulp.dest(pathBuild + 'img'));
});

gulp.task('copy', () => {
    return gulp.src('src/img/*.+(webp|gif)')
        .pipe(gulp.dest(pathBuild + 'img'));
});

gulp.task('server', (done) => {
    browserSync.init({
        server: "src/",
        notify: false
    });

    gulp.watch("src/html/**/*.pug", gulp.series('pug'));
    gulp.watch("src/*.html").on('change', () => {
        browserSync.reload();
        done();
    });
    gulp.watch("src/js/**/*.js").on('change', () => {
        browserSync.reload();
        done();
    });

    gulp.watch("src/css/*.css").on('change', () => {
        browserSync.reload();
        done();
    });

    done();
});

gulp.task('default', gulp.series('pug', 'server'));
/* 

gulp.task('build', gulp.series(gulp.parallel('prefix', 'img_opt', 'scripts'), 'allcss', 'move'), function (done) {
    done();
}); */