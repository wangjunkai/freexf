'use strict';


angular.module('freexf')
  .controller('pay_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $injector,$stateParams, $ionicLoading, $timeout, AUTH, ENV, AddOrderFun) {
      var AddOrder = AddOrderFun(ENV._api.__AddOrder);
      $scope.userData = AUTH.FREEXFUSER.data;
      $scope.OrderId = $stateParams.OrderId;
      AddOrder.create({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "ProductId": $rootScope.paycourseId}).then(function (res) {
          $scope.AddOrder = res.response.data;
          $scope.payohref = res.response.data.AliPayId;
          $scope.payoname = res.response.data.ProductName;
          $scope.payomoney = res.response.data.price;
          $scope.payood = res.response.data.orderRowid;
          $scope.orderId = res.response.data.OrderId;
          $scope.SetOrderTime = res.response.data.SetOrderTime;
          $scope.goOrderDetail = function () {
              $state.go('payaddress', { OrderId: $scope.payood });
          };
          if ($scope.payomoney == 0) {
              $scope.mianfeiShow = true;
              setTimeout(function () {
                  $scope.goOrderDetail();
              }, 3000)

          } else {
              $scope.mianfeiShow = false;
          }
      });

    //$scope.toPay = function(){
    //  $state.go('paysuccess');
    //};

});
