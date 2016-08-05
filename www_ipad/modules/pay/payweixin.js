'use strict';


angular.module('freexf')
  .controller('payweixin_ctrl', function ($scope, $stateParams) {
      $scope.PayId= $stateParams.PayId;
      var payUrl = '/pay/Alipay/default.aspx?OrderId=' + $stateParams.PayId;
      $scope.ThisWX = false;
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
          $scope.ThisWX = true;
      } else {
          window.location.href = payUrl
      }
});
