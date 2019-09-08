var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');

var paths = {
    styles: {
        // By using styles/**/*.sass we're telling gulp to check --scss/*.scss--  all folders for any sass file
        src: ['scss/*.scss'],
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "src/css"
    },
	js: {
		src: ['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'],
		dest: "src/js"
	}
 
    // Easily add additional paths
    // ,html: {
    //  src: '...',
    //  dest: '...'
    // }
};
function js(){
	return gulp
		.src(paths.js.src)
		.pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream());
}
function style() {
    return gulp
        .src(paths.styles.src)
        .pipe(sass())
        .on("error", sass.logError)
		.pipe(gulp.dest(paths.styles.dest))
		// Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}


// A simple task to reload the page
function reload() {
    browserSync.reload();
}

// Add browsersync initialization at the start of the watch task
function watch() {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "./src"
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
	gulp.watch(paths.js.src, js);
    gulp.watch(paths.styles.src, style);
    // We should tell gulp which files to watch to trigger the reload
    // This can be html or whatever you're using to develop your website
    // Note -- you can obviously add the path to the Paths object
    //gulp.watch("src/*.html", reload);
    gulp.watch("src/*.html").on('change', browserSync.reload);
}

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;

exports.watch = watch;
exports.js = js;

var build = gulp.parallel(style, js, watch);

gulp.task('default', build);