'use strict';

var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    mainBowerFiles = require('main-bower-files'),
    gulpFilter   = require('gulp-filter'),
    del = require('del'),
    order = require("gulp-order"),
    inject = require('gulp-inject'),
	sass = require('gulp-sass');

gulp.task('clean', function (callback) {
    del(['tmp/**/*.*'], callback);
});

gulp.task('sass', ['clean'], function () {
	gulp.src(['./src/css/*.css','./src/css/*.scss'], {base: './src/css'})
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('./tmp/css'));
});

gulp.task('bower', ['clean'], function() {
    var bowerOptions = {
        debugging: false,
        overrides: {
            'jquery': {
                ignore: true
            }
        }
    };

    var jsFilter = gulpFilter('*.js', {restore: true}),
        cssFilter = gulpFilter('*.css', {restore: true}),
        fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf'], {restore: true}),
        imageFilter = gulpFilter(['*.gif', '*.png', '*.svg', '*.jpg', '*.jpeg'], {restore: true});


    return gulp.src(mainBowerFiles(bowerOptions))
        // JS
        .pipe(jsFilter)
        .pipe(gulp.dest('./tmp/lib/js'))
        .pipe(jsFilter.restore())

        // CSS
        .pipe(cssFilter)
        .pipe(gulp.dest('./tmp/lib/css'))
        .pipe(cssFilter.restore())

        // FONTS
        .pipe(fontFilter)
        .pipe(gulp.dest('./tmp/lib/fonts'))
        .pipe(fontFilter.restore())

        // IMAGES
        .pipe(imageFilter)
        .pipe(gulp.dest('./tmp/lib/images'))
        .pipe(imageFilter.restore())
});

gulp.task('angular', ['clean'], function() {

    var sources = gulp.src('./src/components/**/*.*',{base: './src/components'});

    var htmlFilter = gulpFilter(['**/*.html']);

    return sources
        .pipe(htmlFilter)
        .pipe(gulp.dest('./tmp/partials'))
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest('./tmp/components'));
});



gulp.task('inject', ['bower', 'sass'], function() {

    var target = gulp.src('./src/index.html');
    var sources = gulp.src([
        './tmp/lib/css/*.css',
        './tmp/lib/js/*.js',
		'./tmp/css/*.css'
    ], {read: false})
        .pipe(order([
            "moment.js",
            "jquery.js",
            "angular.js"
        ]));

    var injectOptions = {
        name: 'lib',
        ignorePath: 'tmp',
        addRootSlash: false
    };

    return target
        .pipe(inject(sources,injectOptions))
        .pipe(gulp.dest('./tmp'));
});

gulp.task('build', ['inject', 'angular'], function() {
	gulp.src(['./src/images/*'], {base: './src/images'})
	.pipe(gulp.dest('./tmp/images'));
    gulp.src(['./src/js/*'], {base: './src/js'})
        .pipe(gulp.dest('./tmp/js'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch('./bower_components/**/*.*', ['inject']);
    // gulp.watch('./src/components/**/*.*', ['build']);
	// includes index.html
    gulp.watch('./src/**/*.*', ['build']);
});


gulp.task('webserver', ['watch'], function() {
    var webserverOptions = {
        livereload: true,
        host: '0.0.0.0'
    }

    return gulp.src('./tmp')
        .pipe(webserver(webserverOptions));
});

gulp.task('default', ['webserver']);