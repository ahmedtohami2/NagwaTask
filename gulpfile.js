// #region Dependencies
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    prefix = require("gulp-autoprefixer"),
    uglify = require("gulp-uglify"),
    del = require('del'),
    plumber = require('gulp-plumber'),
    notify = require("gulp-notify"),
    nano = require("gulp-cssnano"),
    livereload = require('gulp-livereload'),
    server = require('tiny-lr')();


// #endregion
// #region Variables


var resConfig = {
    html: {
        compile: ["src/html/**/*.html"],
        watch: ["src/html/**/*.html"],
        outFile: "index.html"
    },
    img: {
        compile: ["src/images/**/*.png"],
        watch: ["src/images/**/*.png"],
        outFile: "img.png"
    },
    fonts: {
        compile: ["src/fonts/**/*.ttf", "src/fonts/**/*.otf"],
        watch: ["src/fonts/**/*.ttf", "src/fonts/**/*.otf"],
        outFile: "font.ttf"
    },
    styles: {
        compile: ["src/styles/**/*.scss"],
        watch: ["src/styles/**/*.scss"],
        outFile: "style.css"
    },
    scripts: {
        compile: ["src/scripts/**/*.js"],
        watch: ["src/scripts/**/*.js"],
        outFile: "script.js"
    },
    dist: {
        scripts: 'dist/scripts',
        styles: 'dist/styles',
        html: 'dist/html',
        img: 'dist/images',
        fonts: 'dist/fonts'
    }
};
// #endregion

notify.logLevel(0);
var showError = notify.onError({
    title: "Error with [<%= error.plugin %>]",
    message: "<%= error.line %> <%= error.file %> <%= error.toString() %>"
});


gulp.task('html', done => {
    del(resConfig.dist + "/" + resConfig.html.outFile);


    gulp.src(resConfig.html.compile)
        .pipe(gulp.dest(resConfig.dist.html))
        .pipe(livereload(server))
        .pipe(notify({ message: 'HTML task complete' }));

    done();
});



gulp.task('fonts', done => {
    del(resConfig.dist + "/" + resConfig.fonts.outFile);


    gulp.src(resConfig.fonts.compile)
        .pipe(gulp.dest(resConfig.dist.fonts))
        .pipe(livereload(server))
        .pipe(notify({ message: 'fonts task complete' }));

    done();
});


gulp.task('images', done => {
    del(resConfig.dist + "/" + resConfig.img.outFile);


    gulp.src(resConfig.img.compile)
        .pipe(gulp.dest(resConfig.dist.img))
        .pipe(livereload(server))
        .pipe(notify({ message: 'images task complete' }));

    done();
});

// Convert SASS to CSS
// #region Helpers

gulp.task("styles", done => {

    del(resConfig.dist + "/" + resConfig.styles.outFile);
    gulp.src(resConfig.styles.compile, {
            allowEmpty: true
        })
        .pipe(plumber({ errorHandler: showError }))
        .pipe(sass())
        .pipe(prefix())
        .pipe(nano())
        .pipe(livereload(server))
        .pipe(gulp.dest(resConfig.dist.styles))
        .pipe(notify({ message: 'Styles task complete' }));
    done();
});
// #endregion

// Convert CoffeeScript to JavaScript
// #region Tasks
gulp.task("scripts", done => {
    del(resConfig.dist + "/" + resConfig.scripts.outFile);
    gulp.src(resConfig.scripts.compile, {
            allowEmpty: true
        })
        .pipe(plumber({ errorHandler: showError }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(resConfig.dist.scripts))
        .pipe(notify({ message: 'Scripts task complete' }));
    done();
});




// #endregion

gulp.task('clean', done => {
    console.log("clean started...")
    done();
});


gulp.task('default', done => {

    server.listen(35729, function(err) {
        if (err) {
            console.log(err)
            return console.log(err)
        };
    });

    gulp.watch(resConfig.styles.watch, gulp.series('styles')),
        gulp.watch(resConfig.scripts.watch, gulp.series('scripts')),
        gulp.watch(resConfig.html.watch, gulp.series('html')),
        gulp.watch(resConfig.img.watch, gulp.series('images'));
    gulp.watch(resConfig.fonts.watch, gulp.series('fonts'));


    done();
});