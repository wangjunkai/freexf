//require配制主要js，并启动路由。
//定义主要js路径

'use strict';

var paths = {
  //配置js路径
  paths: {
    ionic: 'lib/ionic/js/ionic.bundle',//webapp前端框架
    oclazyload: 'lib/oclazyload/dist/ocLazyLoad',//按需加载
    imglazyload: 'lib/ionic-image-lazy-load/ionic-image-lazy-load',//图片懒加载
    restAngular: 'lib/restangular/dist/restangular.min',//ajax
    angularSanitize: 'lib/ionic/js/angular/angular-sanitize.min',
    localStorage: 'lib/angular-local-storage/dist/angular-local-storage.min',//
    jq: 'lib/jquery/dist/jquery.min',
    lodash: 'lib/lodash/dist/lodash.min',//
    qrcode: 'lib/qrcode/jquery.qrcode.min',
    base64: 'js/base64'

  },
  shim: {
    //注入服务至ionic
    'oclazyload': ['ionic'],
    'imglazyload': ['ionic'],
    'restAngular': ['ionic'],
    'angularSanitize': ['ionic'],
    'localStorage': ['ionic'],
    'services': ['ionic', 'app'],
    'qrcode': ['ionic'],
    'base64':['ionic']
  }
};
require.config(paths);

require([
    'ionic',
    'jq',
    'lodash',
    'qrcode',
    'app',
    'services',
    'base64'
  ], function () {
    testViewport();
    doyoofun();
    //totop(window);
    ionic.Platform.ready(function () {
      //启动angular模块
      angular.bootstrap(document, ['freexf']);
    });
  }
);
function doyoofun() {
    $('body').on('click', '.button-clear.freexf-consult,.onlineConsultJs', function () {
    doyoo.util.openChat('g=10058658');
    return false;
  })
}
function getCookieValue(name) {
    var name = escape(name);
    //读cookie属性，这将返回文档的所有cookie  
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置  
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值  
    if (pos != -1) { //如果pos值为-1则说明搜索"version="失败  
        var start = pos + name.length; //cookie值开始的位置  
        var end = allcookies.indexOf(";", start); //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
        if (end == -1) end = allcookies.length; //如果end值为-1说明cookie列表里只有一个cookie  
        var value = allcookies.substring(start, end); //提取cookie的值  
        return unescape(value); //对它解码        
    } else return ""; //搜索失败，返回空字符串  
}
function testViewport() {
  var mvp = $('meta[name="viewport"]').get(0);
  var docW = document.documentElement.clientWidth;
  var devicewidth = 'device-width';
  var docWhtml = docW * 1 / 375;
  if (docWhtml <= 1 && docWhtml >= 0.85) {
    $('html').css('font-size', docWhtml + 'px')
  } else if (docWhtml <= 0.85) {
    $('html').css('font-size', '0.9px')
  }
  var docWviewport, tvp;
  if (docW <= 320) {
    docWviewport = (docW / 320);
    tvp = 'width=' + devicewidth + ',initial-scale=' + docWviewport;
    mvp.setAttribute('content', tvp);
  } else if (docW > 414) {
    docWviewport = (docW / 414);
    devicewidth = '414';
    tvp = 'width=' + devicewidth;
    mvp.setAttribute('content', tvp);
  }
  //
}
function hideTop(win) {
  var scrollTop = 70;
  var bodycheck = setInterval(function () {
    var content = $('ion-content div.scroll');
    if (content.length > 0) {
      var newtop = content.position().top;
      var y = newtop >= scrollTop ? 0 : 70;
      scrollTop = newtop;
      win.scrollTo(0, y);
    }
  }, 500);
}
function totop(win) {
  var doc = win.document;

  // If there's a hash, or addEventListener is undefined, stop here
  if (win.addEventListener) {
    //scroll to 1
    window.scrollTo(0, 1);
    var scrollTop = 1,
      getScrollTop = function () {
        return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
      },
    //reset to 0 on bodyready, if needed
      bodycheck = setInterval(function () {
        if (doc.body) {
          clearInterval(bodycheck);
          scrollTop = getScrollTop();
          win.scrollTo(0, scrollTop === 1 ? 0 : 1);
        }
      }, 15);
    win.addEventListener("load", function () {
      setTimeout(function () {
        //reset to hide addr bar at onload
        win.scrollTo(0, scrollTop === 1 ? 0 : 1);
      }, 0);
    });
  }
}
