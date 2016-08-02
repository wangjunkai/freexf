'use strict';

define(function () {
  angular.module('freexf')
    .controller('pay_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $injector, $stateParams, $frModal, $ionicLoading, $timeout, $freexfUser, ENV, AddOrderFun) {
      var AddOrder = AddOrderFun(ENV._api.__AddOrder);
      $scope.userData = $freexfUser.auth();
      $scope.OrderId = $scope.$parent.$data.paycourseId;
      var modal_ary = {
        login: {
          scope: $scope,
          ctrlUrl: 'modules/pay/payaddress',
          tempUrl: 'modules/pay/payaddress.html'
        }
      };
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
        } else {
          $scope.mianfeiShow = false;
        }
      });
      $scope.openModal = function (name, data, back) {
        $frModal.openModal($scope, name, modal_ary, data, back);
      };
      $scope.goOrderDetail = function () {
        $state.go('payaddress', {OrderId: $scope.payood});
      };
      $scope.ThisWX = false;
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        $scope.ThisWX = true;
      }
    });

});

