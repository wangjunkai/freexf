'use strict';

angular.module('freexf')
  .controller('payaddress_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $injector, $ionicLoading, $Loading, $stateParams, $timeout, AUTH, ENV,MSGICON, PayAddress, OrderList, DelOrder,AddOrderAddress) {
      var payAddress = PayAddress(ENV._api.__orderpay);
      $scope.OrderId = $stateParams.OrderId;
      $scope.userData = AUTH.FREEXFUSER.data;
      function addressModel() {
          this.address = {
              DeliveryAddress: '',
              DeliveryPhone: '',
              IsDelivery: '',
              IsPayed: ''
          }
          return this.address;
      };
      $scope.payAddress = new addressModel();
      //获取对应订单的列表
      payAddress.getModel({ "Sign": $scope.userData.Sign, "OrderId": $scope.OrderId, "studentId": $scope.userData.rowId }).then(function (res) {          
          $scope.payAddress = res.response.data[0] || new addressModel();
          
      });
      //填写地址
      $scope.submit = function ($event) {
          var AddpayAddress = AddOrderAddress(ENV._api.__addorderaddress);
          AddpayAddress.postModel({ "as_name": $scope.DeliveryUser, "as_mobile": $scope.DeliveryPhone, "as_address": $scope.DeliveryAddress }).then(function (res) {
              //获取提交结果
              var ret = res.response.data;
              $Loading.show({ class: ret ? MSGICON.success : MSGICON.fail, text: ret ? '提交成功，3秒后跳转!' : '提交失败!' }, 2500);
              if (ret) {
                  $timeout(function () {
                      location.href = "#/mycourse";
                  }, 3000)
              }
          });
      }
      
  });

