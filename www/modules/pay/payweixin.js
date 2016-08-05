'use strict';

angular.module('freexf')
  .controller('payweixin_ctrl', function ($scope, $stateParams, localStorageService) {
      $scope.PayId = window.location.href.split('/payid')[1].split('stid')[0];
      var payUrl = '/pay/Alipay/default.aspx?OrderId=' + $scope.PayId;
      $scope.ThisWX = false;
      var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
          //微信
          $scope.ThisWX = true;
          var element = document.getElementById('iframe');
          element.setAttribute('src', payUrl)
      } else {
          //跳转
          window.location.href = payUrl
      }

      $scope.StudentId = window.location.href.split('stid')[1].split('sign')[0];
      $scope.Sign = window.location.href.split('sign')[1].split('way')[0];
      $scope.Way = window.location.href.split('way')[1].split('endpayid')[0];

      if (localStorageService.get('StudentId') == null) {
          localStorageService.set('StudentId', $scope.StudentId);
      }
      if (localStorageService.get('Sign') == null) {
          localStorageService.set('Sign', $scope.Sign);
      }
      if (localStorageService.get('Way') == null) {
          localStorageService.set('Way', $scope.Way);
      }
      if (localStorageService.get('PayId') == null) {
          localStorageService.set('PayId', $scope.PayId);
      }
});
