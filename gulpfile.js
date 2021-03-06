/**
* File: gulpfile.js
* Author: Alex Arriaga (@alex_arriaga_m) - http://www.alex-arriaga.com
* Date: 26/Aug/2014
*/

var gulp 	= require('gulp');
var concat 	= require('gulp-concat');
var rename 	= require('gulp-rename');
var watch 	= require('gulp-watch');
var uglify 	= require('gulp-uglify');
var less 	= require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

var baseDirDev = './dev/';
var baseDirJs = './dev/js/';
var baseDirCSS = './dev/css/';

var paths = {
	dev 	: './dev/',
	prod 	: './prod/',
	scripts : [baseDirJs + 'jquery-1.11.1.js', baseDirJs + 'js/bootstrap.js'],
	images 	: [baseDirDev +'img/*.jpg', baseDirDev +'img/*.png'],
	fonts	: 'fonts/*',
	less 	: 'less/*.less',
	css 	: [baseDirCSS + 'bootstrap.css', baseDirCSS + 'econtinua.css', baseDirCSS + 'econtinua-responsive.css', baseDirCSS + 'font-awesome.css']
	// stylus 	: 'stylus/*.styl'
};

// This object contains parameters for minifying operation.
// Please, read more about it in this link: https://www.npmjs.org/package/gulp-minify-css
var minifyCSSOptions = {
	keepSpecialComments: 0,
	keepBreaks: false,
	debug: true
};

// 1. Transform LESS file to CSS  (place CSS files into dev/css folder)
	gulp.task('less', function() {
        console.log("Running LESS task...");
		return gulp.src(paths.dev + paths.less)
            .pipe(less())
            .pipe(minifyCSS(minifyCSSOptions))
            .pipe(gulp.dest(paths.dev + 'css'));
	});

// 2. Compress CSS (it will run after 'less' task finishes
	gulp.task('compress-css',['less'], function() {
        console.log("Running compressing CSS task...");
		return gulp.src(paths.css)
			.pipe(concat('all-styles.css'))
			.pipe(gulp.dest(paths.prod + 'css'))
			.pipe(rename('all-styles.min.css'))
			.pipe(minifyCSS(minifyCSSOptions))
			.pipe(gulp.dest(paths.prod + 'css'));
	});

// 3. Compress JavaScript files and place them into production folder
	gulp.task('compress-js', function() {
        console.log("Running compressing JavaScript task...");
		return gulp.src(paths.scripts)
			.pipe(concat('all-scripts.js'))
			.pipe(gulp.dest(paths.prod + 'js'))
			.pipe(rename('all-scripts.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest(paths.prod + 'js'));
	});

// 4. Copy images
	gulp.task('copy-static-resources', function() {
		// console.log("Copy images from:" + (paths.dev+paths.images));
        console.log("Copying static resources task...");
		gulp.src(paths.images)
			.pipe(imagemin({
				progressive: true,
				optimizationLevel: 6,
				svgoPlugins: [{ removeViewBox: false }],
            	use: [pngcrush({ reduce: true })]
			}))
			.pipe(gulp.dest(paths.prod + 'img'));

		gulp.src(paths.dev+paths.fonts)
			.pipe(gulp.dest(paths.prod + 'fonts'));
	});



// Watch files for fhanges
    gulp.task('watch', function() {
        console.log("Registering path to watch:" + paths.dev + paths.less);
        gulp.watch(paths.dev + paths.less, ['less','compress-css']);
    });


// Default gulp task to run
gulp.task('default',['less', 'compress-css', 'compress-js', 'copy-static-resources', 'watch']);



