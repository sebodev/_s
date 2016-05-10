var gulp = require('gulp');
var browserSync = require('browser-sync');
var cmq = require('gulp-group-css-media-queries');
var plugins = require( 'gulp-load-plugins' )({ camelize: true });

var url = 'framework.dev'

var dir = {
    sass: './sass/',
    img: './img/',
    js: './js/',
    bower: './bower_components'
}

gulp.task('styles', function() {
    return plugins.rubySass(dir.sass + 'style.scss', {
        style: 'expanded',
        loadPath: dir.bower
    })
    .pipe(plugins.plumber())
    .pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
    .pipe(cmq())
    .pipe(plugins.csscomb())
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('images', function() {
    return gulp.src(dir.img + 'src/*(*.png|*.jpg|*.jpeg|*.gif)')
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(dir.img));
});

gulp.task('scripts', ['scripts-lint', 'scripts-main', 'scripts-admin']);

gulp.task('scripts-lint', function() {
    return gulp.src(dir.js + '**/*.js')
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('scripts-main', function() {
    return gulp.src([
        dir.js + 'src/navigation.js',
        dir.js + 'src/skip-link-focus-fix.js'
    ])
    .pipe(plugins.concat('main.js'))
    .pipe(gulp.dest(dir.js))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(dir.js));
});

gulp.task('browser-sync', ['watch'], function() {
    browserSync.init({
        proxy: url
    });
});

gulp.task('watch', function(){
    gulp.watch(dir.sass+'**/*.scss', ['styles']);
    gulp.watch(dir.img+'src/**/*(*.png|*.jpg|*.jpeg|*.gif)', ['images']);
    gulp.watch(dir.js+'**/*.js', ['scripts']);
});

gulp.task('default', ['browser-sync']);
