'use strict';

define(function () {
  angular.module('freexf')
    .controller('pay_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $injector, $stateParams, $frModal, $ionicLoading, $timeout, $freexfUser, ENV, AddOrderFun) {
      var AddOrder = AddOrderFun(ENV._api.__AddOrder);
      $scope.userData = $freexfUser.auth();
      $scope.OrderId = $scope.$parent.$data.paycourseId;

      AddOrder.create({
        "studentId": $scope.userData.rowId,
        "Sign": $scope.userData.Sign,
        "ProductId": $scope.OrderId
      }).then(function (res) {
        $scope.AddOrder = res.response.data;
        $scope.payohref = res.response.data.AliPayId;
        $scope.payoname = res.response.data.ProductName;
        $scope.payomoney = res.response.data.price;
        $scope.payood = res.response.data.orderFormatId;
        $scope.orderId = res.response.data.OrderId;
        $scope.SetOrderTime = res.response.data.SetOrderTime;
        if ($scope.payomoney == null) {
          $scope.payhide = true
        } else {
          $scope.payhide = false
        }
        if ($scope.payomoney == 0) {
          $scope.mianfeiShow = true;
          $timeout(function () {
            $scope.openModal('payaddress', {OrderId: $scope.payood})
          }, 3000)
        } else {
          $scope.mianfeiShow = false;
        }
      });

      $scope.RealTimeUpdate = function (type) {
        var payary = {
          'zcpay': '/pay/Alipay/default.aspx?OrderId=' + $scope.payohref,
          'wxpay': '/mobile/www/modules/pay/payweixin.html?payid' + $scope.payohref + 'endpayid'
        };
        location.href = payary[type] ? payary[type] : payary['zcpay'];
      };
      var modal_ary = {
        payaddress: {
          scope: $scope,
          ctrlUrl: 'modules/pay/payaddress',
          tempUrl: 'modules/pay/payaddress.html'
        }
      };
      $scope.openModal = function (name, data, back) {
        $frModal.openModal($scope, name, modal_ary, data, back);
      };
      $scope.ThisWX = false;
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        $scope.ThisWX = true;
      }
    });

});

