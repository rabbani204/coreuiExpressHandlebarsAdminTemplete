var gulp = require('gulp'),
    minifyCSS = require('gulp-cssmin'),
    concat = require('gulp-concat')
    uglify = require('gulp-uglify')
    prefix = require('gulp-autoprefixer')
    sass = require('gulp-sass');

// Minifies JS
gulp.task('js', function(){
    return gulp.src([
        'public/assets/js/jquery.min.js',
        'public/assets/js/bootstrap.min.js',
        'public/assets/js/jquery.nice-select.js',
        'public/assets/js/jquery.file-drop.js',
        'public/assets/js/waypoints.min.js',
        'public/assets/js/owl.carousel.min.js',
        'public/assets/js/clipboard.min.js',
        'public/assets/js/jquery.mousewheel.min.js',
        'public/assets/js/wow.min.js',
        'public/assets/js/converter.js',
        'public/assets/js/custom.js',
    ])
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/js'))
});

// CSS Version
gulp.task('styles', function(){
    return gulp.src([
        'public/assets/css/font-awesome.min.css',
        'public/assets/css/animate.css',
        'public/assets/css/nice-select.css',
        'public/assets/css/owl.carousel.min.css',
        'public/assets/css/owl.theme.default.min.css',
        'public/assets/css/bootstrap.min.css',
        'public/assets/css/appsland-navber.css',
        'public/assets/css/style.css',
        'public/assets/css/responsive.css'
    ])
    .pipe(concat('main.css'))
    .pipe(minifyCSS())
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('public/css'))
});

// Admin assets
gulp.task('admin/js', function(){
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/pace-progress/pace.min.js',
        'public/admin-assets/js/**/*.js'
    ])
    .pipe(uglify())
    .pipe(concat('admin.js'))
    .pipe(gulp.dest('public/js'))
});

gulp.task('admin/styles', function(){
    return gulp.src([
        "node_modules/font-awesome/css/font-awesome.min.css",
        "node_modules/simple-line-icons/css/simple-line-icons.css",
        "public/admin-assets/css/style.css"
    ])
    .pipe(sass())
    .pipe(prefix('last 2 versions'))
    .pipe(concat('admin.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/css'))
});

gulp.task('default', function() {
    // gulp.src(['node_modules/font-awesome/fonts/**']).pipe(gulp.dest('public/fonts'));
    // gulp.src(['node_modules/simple-line-icons/fonts/**']).pipe(gulp.dest('public/fonts'));
    // gulp.src(['public/assets/fonts/**']).pipe(gulp.dest('public/fonts'));
    // gulp.src(['public/admin-assets/img/**']).pipe(gulp.dest('public/img'));
    // gulp.run('styles')
    // gulp.run('admin/styles')
    // gulp.run('js')
    gulp.run('admin/js')
    // gulp.watch('src/sass/**/*.sass', function(){
    //     gulp.run('styles')
    // })
});
