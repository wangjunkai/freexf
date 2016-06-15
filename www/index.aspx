<!DOCTYPE html>
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

  <title></title>
  <link href="lib/ionic/css/ionic.css" rel="stylesheet">
  <link href="css/freexf.css" rel="stylesheet">
  <link href="css/course.css" rel="stylesheet">
  <link href="css/home.css" rel="stylesheet">
  <link href="css/member.css" rel="stylesheet">
  <link href="css/pay.css" rel="stylesheet">
  <link href="css/student.css" rel="stylesheet">
  <link href="css/user.css" rel="stylesheet">
  <link href="css/video.css" rel="stylesheet">
  <link href="css/set.css" rel="stylesheet">
</head>
<body>
<!--	头部模块加载-->
<!--
<ion-nav-bar class="tabs-icon-top tabs-color-active-positive" ></ion-nav-bar>
-->
  <ion-nav-bar class="freexf-bar-lightgray">
    <ion-nav-back-button default-nav-back-button ng-click="goBack()" class="button-clear">
    </ion-nav-back-button>
  </ion-nav-bar>
  <!--加载ionic tab-->
  <ion-nav-view></ion-nav-view>

<!--require按需加载js控件-->
<script data-main="config.js" src="lib/requirejs/require.js"></script>
<script type="text/javascript" charset="utf-8" src="http://lead.soperson.com/20001079/10055583.js"></script>

</body>

</html>
