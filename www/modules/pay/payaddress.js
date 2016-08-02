'use strict';

angular.module('freexf')
  .controller('payaddress_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $Loading, $stateParams, $timeout, AUTH, ENV,MSGICON, PayAddress,AddOrderAddress, UpdateAPES, localStorageService) {
      var payAddress = PayAddress(ENV._api.__orderpay);
      $scope.OrderId = $stateParams.OrderId;
      $scope.userData = AUTH.FREEXFUSER.data;
      //切换是否有教材地址的成功提示内容
      $scope.ispayAddress = false;
      $scope.payOn = false;
      function addressModel() {
          this.payAddress = {
              DeliveryUser:'',
              DeliveryAddress: '',
              DeliveryPhone: '',
              IsDelivery: '',
              IsPayed: ''
          }
          return this.payAddress;
      };
      $scope.payAddress = new addressModel();
      //获取对应订单的列表
      payAddress.getModel({ "Sign": $scope.userData.Sign, "OrderId": $scope.OrderId, "studentId": $scope.userData.rowId }).then(function (res) {          
          $scope.payAddress = res.response.data[0] || new addressModel();
          if ($scope.payAddress.IsDelivery == false || $scope.payAddress.IsDelivery == 0) {
              //切换是否有教材地址的成功提示内容
              $scope.ispayAddress = false;
              $scope.payOn = true;
              $timeout(function () {
                  location.href = "#/mycourse";
              }, 3000)
          } else {
              $scope.ispayAddress = true;
              $scope.payOn = false;

          }
      });
      if (typeof (localStorageService.get('URLshortID')) != 'undefined' && localStorageService.get('APES4') != '1') {
          var GetUpdateAPES = UpdateAPES(ENV._api.__UpdateAPES);
          GetUpdateAPES.getModel({ 'apesType': '4', 'URLTrafficID': localStorageService.get('URLshortID') }).then(function (res) { });
          localStorageService.set('APES4', '1');
      };
      //填写地址
      $scope.submit = function ($event, $form) {
          if ($form.$invalid) return false;
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
      $scope.goToMycourse = function () {
          location.href = "#/mycourse";
      }
  });

