/**
 * Created by wangjunkai on 2016/4/15.
 */

/*引入gulp*/
// 基础库
var gulp = require('gulp');
//脚本压缩
var uglify = require('gulp-uglify');
//css压缩
var minify = require('gulp-minify-css');
//css雪碧图
var imageResize = require('gulp-image-resize');
var sprite = require('gulp.spritesmith');
var gm = require('gulp-gm');
var parallel = require("concurrent-transform");
var os = require("os");

//图片压缩&&深度压缩
var imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant');
//js检查
var jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish');
// 网页自动刷新
var livereload = require('gulp-livereload');
//文件重命名
var rename = require('gulp-rename');
var rev = require('gulp-rev');
//来源地图
var sourcemaps = require('gulp-sourcemaps');
//只操作修改过的文件
var changed = require('gulp-changed');
//合并文件
var concat = require('gulp-concat');
//清理文件
var clean = require('gulp-clean');
//处理css3前缀
var autoprefixer = require('gulp-autoprefixer');

//文件的路径（./代表根目录）
var paths = {
  all: '*',
  img_sprite: 'img/sprite/*.png',
  img: 'img/*',
  js: 'js/*.js',
  css: 'www/css/*.css',
  dist: 'dist',
  dist_js: 'dist/js',
  dist_css: 'www/css/dist/*.min.css',
  dist_img: 'dist/img',
  dist_maps: ''
};
var js_path = {
  js_lib: 'www/lib/',
  js_map: 'map/',
  js_lib_dist: 'www/dist/js/lib/',
  js_lib_dist_concat: 'www/dist/js/lib/concat/'
};
function getDate() {
  var a = new Date();
  var m = a.getMonth() + 1;
  var month = (m < 10 ? '0' + m : m),
    date = a.getDate()  < 10 ? '0' + a.getDate() : a.getDate();
  return a.getFullYear() + month.toString() + date.toString();
}
var css_path = {
  css_map: 'map/',
  css_modules: 'www/css/',
  css_modules_dist: 'www/dist/css/modules/' + getDate() + '/',
  css_modules_dist_concat: 'www/dist/css/modules/' + getDate() + '/concat/',
  css_activities: 'www/activities/css/',
  css_activities_dist: 'www/dist/css/activities/' + getDate() + '/',
  css_activities_dist_concat: 'www/dist/css/activities/' + getDate() + '/concat/'
};
/*注册任务*/

//移动文件
gulp.task('move', function () {
  return gulp.src('./*.html')
    .pipe('dist/html');
});
//js检查
gulp.task('jshint', function () {
  return gulp.src('www/lib/ionic/ionic.bundle.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});
//脚本压缩
function each_ary(rootPath, pathAry) {
  var a = [];
  if (rootPath) {
    for (var i = 0; i < pathAry.length; i++) {
      var str = rootPath + pathAry[i];
      if (pathAry[i].substring(0, 1) === '!') {
        str = '!' + rootPath + pathAry[i].substring(1);
      }
      a.push(str);
    }
  } else {
    a = pathAry;
  }
  return a;
}
var requirejs = [
  'requirejs/require.js'
];
var js_lib_ary = [
  'ionic/js/ionic.bundle.js',
  'jquery/dist/jquery.js',
  'lodash/lodash.js',
  'angular-local-storage/dist/angular-local-storage.js',
  'ionic/js/angular/angular-sanitize.js',
  'restangular/dist/restangular.js',
  'oclazyload/dist/ocLazyLoad.js',
  'ionic-image-lazy-load/ionic-image-lazy-load.js',
  'qrcode/jquery.qrcode.min.js',
  'base64/base64.js'
];
var css_modules_ary = [
  'freexf.css', 'home.css', 'user.css', 'course.css', 'member.css', 'set.css', 'pay.css'
];
var css_activities_ary = [
  '!*.bundle.css',
  '!french.css',
  '!Germany.css',
  '!japanese.css',
  '!korean.css',
  '!russian.css',
  '!spanish.css',
  '*.css'
];
gulp.task('uglify', function () {
  return gulp.src(each_ary(js_path.js_lib, requirejs))
    .pipe(changed(js_path.js_lib_dist))
    .pipe(sourcemaps.init())//来源地图
    //.pipe(rename({suffix: '.min'}))//重命名
    .pipe(rev())
    .pipe(uglify())
    .pipe(sourcemaps.write(js_path.js_map))
    .pipe(gulp.dest(js_path.js_lib_dist));
});
//css压缩
gulp.task('minify-activities', function () {
  //each_ary(css_path.css_activities, css_activities_ary)
  //[css_path.css_activities + '*.css', '!' + css_path.css_activities + '*.bundle.css']
  return gulp.src(each_ary(css_path.css_activities, css_activities_ary))
    .pipe(changed(css_path.css_activities_dist))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['> 1%'],
      cascade: true
    }))
    //.pipe(rename({suffix: '.min'}))
    .pipe(rev())
    .pipe(minify())
    .pipe(sourcemaps.write(css_path.css_map))
    .pipe(gulp.dest(css_path.css_activities_dist))
});
//css压缩
gulp.task('minify-modules', function () {
  //each_ary(css_path.css_modules, css_modules_ary)
  return gulp.src([css_path.css_modules + '*.css', '!' + css_path.css_modules + '*.bundle.css'])
    .pipe(changed(css_path.css_modules_dist))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['> 1%'],
      cascade: true
    }))
    //.pipe(rename({suffix: '.min'}))
    .pipe(rev())
    .pipe(minify())
    .pipe(sourcemaps.write(css_path.css_map))
    .pipe(gulp.dest(css_path.css_modules_dist))
});
//图片压缩
gulp.task('imagemin', function () {
  return gulp.src('www_ipad/activities/img/invitefriends/*.png')
  //.pipe(changed(paths.dist_img))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('www_ipad/activities/img/invitefriends/dist'));
});
//网页自动刷新
gulp.task('livereload', function () {
  return gulp.src(paths.all)
    .pipe(livereload());
});
//合并文件
var js_lib_ary_dist = [
  'ionic-*.bundle.js',
  'jquery-aacc43d6f3.js',
  'lodash-*.js',
  'angular-local-storage-*.js',
  'angular-sanitize-*.js',
  'restangular-*.js',
  'ocLazyLoad-*.js',
  'ionic-image-lazy-load-*.js',
  'jquery-3ddbe55bb7.qrcode.min.js',
  'base64-*.js'
];
var css_activities_ary_dist = ['*.css'];
var css_modules_ary_dist = ['*.css'];
gulp.task('concat-activities', function () {
  return gulp.src(each_ary(css_path.css_activities_dist, css_activities_ary_dist))
    .pipe(concat('activities.bundle.css'))
    //.pipe(rename({suffix: '.min'}))
    .pipe(rev())
    .pipe(gulp.dest(css_path.css_activities_dist_concat))
});
gulp.task('concat-modules', function () {
  return gulp.src(each_ary(css_path.css_modules_dist, css_modules_ary_dist))
    .pipe(concat('freexf.bundle.css'))
    //.pipe(rename({suffix: '.min'}))
    .pipe(rev())
    .pipe(gulp.dest(css_path.css_modules_dist_concat))
});
gulp.task('concat', function () {
  return gulp.src(each_ary(js_path.js_lib_dist, js_lib_ary_dist))
    .pipe(concat('freexf.bundle.js'))
    //.pipe(rename({suffix: '.min'}))
    .pipe(rev())
    .pipe(gulp.dest(js_path.js_lib_dist_concat))
});
//清理文件
gulp.task('clean', function () {
  return gulp.src([paths.dist_css], {
    read: false
  })
    .pipe(clean())
});

//css3前缀
gulp.task('prefixer', function () {
  return gulp.src('./index_three.css')
    .pipe(autoprefixer({
      browsers: ['> 1%'],
      cascade: true
    }))
    .pipe(gulp.dest('./dist'));
});
//css雪碧图
/*gulp.task('sprite-resize', function () {
 return gulp.src('www/img/home/icon-yinyu.png')
 .pipe(parallel(
 imageResize({width: '50%', height: '50%'}),
 os.cpus().length
 ))
 .pipe(gulp.dest('www/img/home/dest'))
 });*/
gulp.task('sprite', function () {
  return gulp.src('www_ipad/img/home/tubiao/icon-*.png')
    .pipe(sprite({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      padding: 23,
      /*top-down	,left-right ,diagonal ,alt-diagonal ,binary-tree*/
      algorithm: 'left-right',
      algorithmOpts: {sort: false}
    }))
    .pipe(gulp.dest('www_ipad/img/home/dest'))
});
// 监听任务
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(paths.all, ['livereload']);
});

// 默认任务
gulp.task('default', ['watch', 'livereload', 'uglify', 'minify', 'imagemin']);

