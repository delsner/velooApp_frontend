'use strict';

var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    mainBowerFiles = require('main-bower-files'),
    gulpFilter = require('gulp-filter'),
    del = require('del'),
    order = require("gulp-order"),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    cleanCSS = require('gulp-clean-css'),
    templateCache = require('gulp-angular-templatecache');


gulp.task('clean', function(callback) {
    del(['tmp/**/*.*'], callback);
});

gulp.task('sass', ['clean'], function() {
    gulp.src(['./src/css/*.css', './src/css/*.scss'], {
            base: './src/css'
        })
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./tmp/css'));
});

gulp.task('bower', ['clean'], function() {
    var bowerOptions = {
        debugging: false,
        overrides: {
            'jquery': {
                ignore: true
            },
            'angular': {
                ignore: true
            },
            'angular-animate': {
                ignore: true
            },
            'angular-aria': {
                ignore: true
            },
            'angular-route': {
                ignore: true
            },
            'angular-resource': {
                ignore: true
            },
            'angular-sanitize': {
                ignore: true
            },
            'angular-messages': {
                ignore: true
            }
        }
    };

    var jsFilter = gulpFilter('*.js', {
            restore: true
        }),
        cssFilter = gulpFilter('*.css', {
            restore: true
        }),
        fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf'], {
            restore: true
        }),
        imageFilter = gulpFilter(['*.gif', '*.png', '*.svg', '*.jpg', '*.jpeg'], {
            restore: true
        });


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

    var sources = gulp.src('./src/components/**/*.*');

    var htmlFilter = gulpFilter(['**/*.html']);

    return sources
        .pipe(htmlFilter)
        .pipe(templateCache('templates.js', {
            root: 'components/',
            module: 'velooAngular'
        }))
        .pipe(gulp.dest('./tmp/components'))
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest('./tmp/components'));
});

gulp.task('inject', ['bower', 'sass'], function() {

    var target = gulp.src('./src/index.html');
    var sources = gulp.src([
            './tmp/lib/css/*.css',
            './tmp/lib/js/*.js',
            './tmp/css/*.css'
        ], {
            read: false
        })
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
        .pipe(inject(sources, injectOptions))
        .pipe(gulp.dest('./tmp'));
});

gulp.task('build', ['inject', 'angular'], function() {
    gulp.src(['./src/images/*'], {
            base: './src/images'
        })
        .pipe(gulp.dest('./tmp/images'));
    gulp.run('minify-js');
    gulp.run('minify-css');
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch('./bower_components/**/*.*', ['inject']);
    gulp.watch('./src/**/*.*', ['build']);
});

gulp.task('minify-js', function() {
    gulp.src(['./tmp/lib/js/*.js', './tmp/components/**/*.js'])
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./tmp/'));
});

gulp.task('minify-css', function() {
    gulp.src('./tmp/**/*.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./tmp/'));
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
