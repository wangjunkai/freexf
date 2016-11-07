'use strict';

angular.module('freexf')
  .controller('payaddress_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $Loading, $stateParams, $timeout, AUTH, ENV,MSGICON, PayAddress,AddOrderAddress, UpdateAPES,apes, localStorageService) {
      var payAddress = PayAddress(ENV._api.__orderpay);
      //$scope.weixin = false;

      //var WeixinJump = localStorage.getItem('WeixinJump');
      //localStorage.setItem('WeixinJump',false);
      //微信跳转
      //console.log(WeixinJump)
      //alert(WeixinJump)
      //if (WeixinJump == 'true') {
      //    $scope.Sign = localStorage.getItem('Sign');
      //    $scope.StudentId = localStorage.getItem('StudentId');
      //    $scope.OrderId = localStorage.getItem('OrderId');
      //} else {
          $scope.userData = AUTH.FREEXFUSER.data;
          $scope.Sign = $scope.userData.Sign;
          $scope.StudentId = $scope.userData.rowId;
          $scope.OrderId = $stateParams.OrderId;
          apes.apesFun('APES4');
      //}

      //切换是否有教材地址的成功提示内容
      $scope.ispayAddress = false;
      $scope.payfail = false;
      $scope.payOn = false;
      //$scope.weixin = false;
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
      payAddress.getModel({ "Sign": $scope.Sign, "OrderId": $scope.OrderId, "studentId": $scope.StudentId }).then(function (res) {         
          $scope.payAddress = res.response.data[0] || new addressModel();
          //判断Ispayed返回值
          if ($scope.payAddress.IsPayed == false) {
              $scope.payfail = true;
              $scope.ispayAddress = false;
              $scope.payOn = false;
          } else {
              //微信跳转
              //if (WeixinJump == 'true') {
              //    //返回微信
              //    $scope.weixin = true;
              //} else {
                  if ($scope.payAddress.IsDelivery == false || $scope.payAddress.IsDelivery == 0) {
                      //切换是否有教材地址的成功提示内容
                      $scope.ispayAddress = false;
                      $scope.payOn = true;
                      $timeout(function () {
                          $state.go('mycourse');
                      }, 3000)
                  } else {
                      $scope.ispayAddress = true;
                      $scope.payOn = false;

                  }
              //}

          }
          
      });
      
      //填写地址
      $scope.submit = function ($event, $form) {
          if ($form.$invalid) return false;
          var AddpayAddress = AddOrderAddress(ENV._api.__addorderaddress);
          AddpayAddress.postModel({ "as_name": $scope.DeliveryUser, "as_mobile": $scope.DeliveryPhone, "as_address": $scope.DeliveryAddress, "as_orderid": $scope.OrderId }).then(function (res) {
              //获取提交结果
              var ret = res.response.data;
              $Loading.show({ class: ret ? MSGICON.success : MSGICON.fail, text: ret ? '提交成功，3秒后跳转!' : '提交失败!' }, 2500);
              if (ret) {
                  $timeout(function () {
                    $state.go('mycourse');
                  }, 3000)
              }
          });
      }
      $scope.goToMycourse = function () {
        $state.go('mycourse');
      }
  });

