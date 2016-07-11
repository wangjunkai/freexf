'use strict';


angular.module('freexf')
  .controller('payweixin_ctrl', function ($scope, $stateParams) {
      $scope.PayId= $stateParams.PayId;
      var payUrl = '/pay/Alipay/default.aspx?OrderId=' + $stateParams.PayId;
      $scope.ThisWX = false;
      var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
          //微信
          $scope.ThisWX = true;
      } else {
          //跳转
          window.location.href = payUrl
      }
});
