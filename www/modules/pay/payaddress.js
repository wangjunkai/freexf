'use strict';


angular.module('freexf')
  .controller('payaddress_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $injector, $ionicLoading, $Loading, $stateParams, $timeout, AUTH, ENV, PayAddress, OrderList, DelOrder,AddOrderAddress) {
      var payAddress = PayAddress(ENV._api.__orderpay);
      $scope.OrderId = $stateParams.OrderId;
      $scope.userData = AUTH.FREEXFUSER.data;
      //�л��Ƿ��н̲ĵ�ַ�ĳɹ���ʾ����
      $scope.payAddress = false;
      $scope.payOn = false;
      //��ȡ��Ӧ�������б�
      payAddress.getModel({ "Sign": $scope.userData.Sign, "OrderId": $scope.OrderId, "studentId": $scope.userData.rowId }).then(function (res) {
          $scope.payAddress = res.response.data;

          if ($scope.payAddress.IsDelivery == true) {
              $scope.payAddress = true;
              $scope.payOn = false;
              
          } else {
              $scope.payOn = true;
              $scope.payAddress = false;
          }
      });

      //��д��ַ
      $scope.submit = function ($event) {
          var AddpayAddress = AddOrderAddress(ENV._api.__addorderaddress);
          AddpayAddress.postModel({ "as_name": $scope.DeliveryUser, "as_mobile": $scope.DeliveryPhone, "as_address": $scope.DeliveryAddress }).then(function (res) {
          		//��ȡ�ύ���
              var ret = res.response.data;
              
          });
      }
      $timeout(function () {
          location.href = "#/mycourse";
      }, 3000)
  });

