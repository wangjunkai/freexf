'use strict';

angular.module('freexf')
  .controller('payweixin_ctrl', function ($scope, $stateParams, $state, localStorageService) {
      //var $element = $('#iframe');
      ////var ele = $element[0];

      //var $element = $('#iframe');
      ////var iframeWidth = document.documentElement.clientWidth;
      ////var iframeHeight = document.documentElement.clientHeight;
      ////$element.attr('width', iframeWidth);
      ////$element.attr('height', iframeHeight);



      //$scope.PayId = window.location.href.split('/payid')[1].split('stid')[0];
      //var payUrl = '/pay/Alipay/default.aspx?OrderId=' + $scope.PayId;
      //$scope.ThisWX = false;

      //$scope.StudentId = window.location.href.split('stid')[1].split('sign')[0];
      //$scope.Sign = window.location.href.split('sign')[1].split('way')[0];
      //$scope.Way = window.location.href.split('way')[1].split('endpayid')[0];

      //var storage = window.localStorage;

      //if (!storage.getItem('StudentId')) {
      //    storage.setItem('StudentId', $scope.StudentId);
      //}
      //if (!storage.getItem('Sign')) {
      //    storage.setItem('Sign', $scope.Sign);
      //}
      //if (!storage.getItem('Way')) {
      //    storage.setItem('Way', $scope.Way);
      //}
      //if (!storage.getItem('PayId')) {
      //    storage.setItem('PayId', $scope.PayId);
      //}

      //$state.go('payaddress');

      //var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
      //if (ua.match(/MicroMessenger/i) != "micromessenger") {
      //    //微信
      //    $scope.ThisWX = true;
      //    //$element.attr('src', payUrl);
      //} else {
      //    //跳转
      //    //window.location.href = payUrl
      //}

      //console.log('test');
      //console.log(storage.getItem('StudentId'));
      //console.log(storage.getItem('Sign'));
      //console.log(storage.getItem('Way'));
      //console.log(storage.getItem('PayId'));
  });