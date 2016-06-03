//require配制主要js，并启动路由。
//定义主要js路径

'use strict';

var paths = {
  //配置js路径
  paths: {
    ionic: 'lib/ionic/js/ionic.bundle',
    oclazyload: 'lib/oclazyload/dist/ocLazyLoad',
    imglazyload: 'lib/ionic-image-lazy-load/ionic-image-lazy-load',
    restAngular: 'lib/restangular/src/restangular',
    localStorage: 'lib/angular-local-storage/dist/angular-local-storage',
    jq: 'lib/jquery/dist/jquery',
    lodash: 'lib/lodash/dist/lodash',
    qrcode: 'lib/qrcode/jquery.qrcode.min'
    /* angularSanitize: './lib/angular-sanitize/angular-sanitize'*/
  },
  shim: {
    //注入服务至ionic
    'oclazyload': ['ionic'],
    'imglazyload': ['ionic'],
    'restAngular': ['ionic'],
    'localStorage': ['ionic'],
    'services': ['ionic', 'app'],
    'qrcode': ['ionic']
  }
};
require.config(paths);

require([
    'ionic',
    'jq',
    'lodash',
    'qrcode',
    'app',
    'services'
    /*    'qrcode'*/
  ], function () {
    testViewport();
    //totop(window);
    ionic.Platform.ready(function () {
      //启动angular模块
      angular.bootstrap(document, ['freexf']);
    });
  }
);
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
};
