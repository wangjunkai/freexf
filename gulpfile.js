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
var sprite = require('gulp.spritesmith');
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
  css: 'css/*.css',
  dist: 'dist',
  dist_js: 'dist/js',
  dist_css: 'dist/css',
  dist_img: 'dist/img',
  dist_maps: ''
};
/*注册任务*/

//移动文件
gulp.task('move', function () {
  return gulp.src('./*.html')
    .pipe('dist/html');
});
//js检查
gulp.task('jshint', function () {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});
//脚本压缩
gulp.task('uglify', function () {
  return gulp.src(paths.js)
    .pipe(changed(paths.dist_js))
    .pipe(sourcemaps.init())//来源地图
    .pipe(rename({suffix: '.min'}))//重命名
    .pipe(rev())
    .pipe(uglify())
    .pipe(sourcemaps.write(paths.dist_maps))
    .pipe(gulp.dest(paths.dist_js));
});
//css压缩
gulp.task('minify', function () {
  return gulp.src(paths.css)
    .pipe(changed(paths.dist_css))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['> 1%'],
      cascade: true
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(rev())
    .pipe(minify())
    .pipe(sourcemaps.write(paths.dist_maps))
    .pipe(gulp.dest(paths.dist_css))
});
//图片压缩
gulp.task('imagemin', function () {
  return gulp.src(paths.img)
    .pipe(changed(paths.dist_img))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.dist_img));
});
//网页自动刷新
gulp.task('livereload', function () {
  return gulp.src(paths.all)
    .pipe(livereload());
});
//合并文件
gulp.task('concat', function () {
  return gulp.src(paths.dist_js)
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(paths.dist))
});
//清理文件
gulp.task('clean', function () {
  return gulp.src([paths.dist_maps, paths.dist], {
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
gulp.task('sprite', function () {
  return gulp.src(paths.img_sprite)
    .pipe(sprite({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      padding: 10,
      /*top-down	,left-right ,diagonal ,alt-diagonal ,binary-tree*/
      algorithm: 'top-down',
      algorithmOpts: {sort: false}
    }))
    .pipe(gulp.dest(paths.dist))
});
// 监听任务
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(paths.all, ['livereload']);
});

// 默认任务
gulp.task('default', ['watch', 'livereload', 'uglify', 'minify', 'imagemin']);

