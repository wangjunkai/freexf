﻿<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no,width=device-width">
  <meta name="MobileOptimized" content="320">
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
  <meta name="screen-orientation" content="portrait">
  <meta name="x5-orientation" content="portrait">
  <meta content="telephone=no" name="format-detection">
  <script>
    var _hmt = _hmt || [];
    (function () {
      var hm = document.createElement("script");
      hm.src = "//hm.baidu.com/hm.js?a80a61243445fb2bc4cd94612c8e857e";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
  </script>
  <title></title>
  <style type="text/css">
    ng-cloak {
      display: none;
    }

    #doyoo_panel {
      display: none
    }
  </style>
  <link href="lib/ionic/css/ionic.min.css" rel="stylesheet">
  <script type="text/javascript">
    window.hostType = 0;
    (function () {
      var headEl = document.getElementsByTagName('head')[0], sync = true;
      var css = {
        0: ['css/freexf.css', 'css/course.css', 'css/home.css', 'css/pay.css',
          'css/student.css', 'css/user.css', 'css/video.css', 'css/set.css', 'css/member.css', 'activities/css/activities-public.css'],
        1: ['css/freexf-concat-8c62337402.min.css']
      };
      var js = {
        0: ['http://lead.soperson.com/20001079/10055583.js'],
        1: ['http://lead.soperson.com/20001079/10055583.js']
      };
      for (var i = 0, j = css[window.hostType]; i < j.length; i++) {
        addTag('link', {rel: 'stylesheet', href: j[i] + '?v=' + (new Date()).getTime(), type: 'text/css'});
      }
      for (var q = 0, w = js[window.hostType]; q < w.length; q++) {
        addTag('script', {src: w[q]}, sync);
      }

      function addTag(name, attributes, sync) {
        var el = document.createElement(name),
          attrName;

        for (attrName in attributes) {
          el.setAttribute(attrName, attributes[attrName]);
        }
        sync ? document.write(outerHTML(el)) : headEl.appendChild(el);
      }

      function outerHTML(node) {
        // if IE, Chrome take the internal method otherwise build one
        return node.outerHTML || (function (n) {
            var div = document.createElement('div'), h;
            div.appendChild(n);
            h = div.innerHTML;
            div = null;
            return h;
          })(node);
      }
    })();
  </script>
</head>
<body>

<ion-nav-view>
</ion-nav-view>
<!--require按需加载js控件-->
<script data-main="config.js" src="lib/requirejs/require.js"></script>

</body>

</html>