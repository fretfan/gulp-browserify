'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const buffer = require('vinyl-buffer');
const order = require('gulp-order');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const log = require('gulplog');
const babel = require('gulp-babel');
const debug = require('gulp-debug');
const cached = require('gulp-cached');
const remember = require('gulp-remember');
const newer = require('gulp-newer');
const rev = require('gulp-rev');

//var packageJSON = require('./package.json');
//var dependencies = Object.keys(packageJSON && packageJSON.dependencies || {});

function clean() {
  return del('dist');
}

function vendor() {
    // console.log(dependencies); //[ 'browserify', 'jquery', 'lodash', 'uniq' ]
    return browserify("./src/vendor.js")
    // .require(['jquery', 'lodash'])
    .bundle()
    .pipe(source('vendor.bundle.js'))
    .pipe(buffer())
    .pipe(cached('vendor'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', log.error)
    .pipe(remember('vendor'))
    .pipe(sourcemaps.write('./'))
    .pipe(rev())
    .pipe(gulp.dest(__dirname + '/dist'));
  }
function app() {
    return gulp.src(['./src/app*.js'])
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(cached('src'))
        .pipe(debug({title: 'src:'}))
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(debug({title: 'babel:'}))
        .pipe(remember('src'))
        .pipe(debug({title: 'remember:'}))
        .pipe(concat('app.bundle.js'))
        .pipe(uglify())
        .on('error', log.error)
        .pipe(rev())
    .pipe(sourcemaps.write('./'))
   
    .pipe(gulp.dest(__dirname + '/dist'));
}


function watchIt2() {
  return gulp.watch('./src/app*.js',{ignoreInitial: false}, app);
}
exports.qwe = gulp.series(watchIt2);

function injectIntoIndex() {
    var target = gulp.src('./src/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./dist/**/*.js'], {read: false})
    .pipe(order(['vendor*', 'app*']))
   
    return target.pipe(inject(sources, {ignorePath: '/dist', addRootSlash: false}))
      .pipe(gulp.dest('./dist'));
}

function tryCache() {
  //return gulp.src('./src/*.js', {since: gulp.lastRun(tryCache)})
  return gulp.src('./src/*.js')
         .pipe(cached('aCache'))
         .pipe(debug({title: 'cached:'}))
         .pipe(remember('aCache'))
         .pipe(debug({title: 'remember:'}))
}


function tryCache2() {
  //return gulp.src('./src/*.js', {since: gulp.lastRun(tryCache)})
  return gulp.src('./src/*.js')
        .pipe(debug({title: 'src:'}))
        .pipe(newer('dist/asd.js'))
        .pipe(debug({title: 'newer:'}))
        .pipe(concat('asd.js'))
        .pipe(gulp.dest('dist'))

        //  .pipe(cached('aCache'))
        //  .pipe(debug({title: 'cached:'}))
        //  .pipe(remember('aCache'))
        //  .pipe(debug({title: 'remember:'}))
}
exports.asd2 = tryCache2;
function watchIt() {
  return gulp.watch('./src/app*.js',{ignoreInitial: true}, tryCache2);
}


function watchApp() {
  return gulp.watch('./src/app*.js',{ignoreInitial: false}, gulp.series(clean, vendor, app, injectIntoIndex));
}

exports.default = gulp.series(clean, vendor, app, injectIntoIndex);
exports.watch = gulp.series(watchApp)
exports.asd = gulp.series(watchIt);

// gulp.task('vendor', function() {
//   return browserify()
//     .require(dependencies)
//     .bundle()
//     .pipe(source('vendor.bundle.js'))
//     .pipe(gulp.dest(__dirname + '/public/scripts'));
// });

// gulp.task('todo', function() {
//   return browserify('app/scripts/app.js')
//     .external(dependencies)
//     .bundle()
//     .pipe(source('todo.bundle.js'))
//     .pipe(map.write('./'))
//     .pipe(gulp.dest(__dirname + '/public/scripts'));
// });

// gulp.task('watch', function() {
//   gulp.watch('package.json', ['vendor']);
//   gulp.watch('app/scripts/**', ['todo']);
// });

// gulp.task('default', ['vendor', 'todo', 'watch']);
