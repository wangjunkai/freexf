'use strict';
define(function () {
  angular.module('freexf')
    .controller('payaddress_ctrl', function ($scope, $rootScope, $state, $Loading, $timeout, $freexfUser, $frModal, ENV, MSGICON, PayAddress, AddOrderAddress, UpdateAPES, localStorageService) {
      var payAddress = PayAddress(ENV._api.__orderpay);
      $scope.OrderId = $scope.$parent.$data.OrderId/*'51e9f0d75ceb4281a2984d7b1e25b65f'*/;
      $scope.isFromOrder = $scope.$parent.$data.isFromOrder;
      $scope.userData = $freexfUser.auth();
      //切换是否有教材地址的成功提示内容
      $scope.ispayAddress = false;
      $scope.payOn = false;
      $scope.timeout = null;
      function addressModel() {
        this.payAddress = {
          DeliveryUser: '',
          DeliveryAddress: '',
          DeliveryPhone: '',
          IsDelivery: '',
          IsPayed: ''
        };
        return this.payAddress;
      }

      $scope.payAddress = new addressModel();
      //获取对应订单的列表
      payAddress.getModel({
        "Sign": $scope.userData.Sign,
        "OrderId": $scope.OrderId,
        "studentId": $scope.userData.rowId
      }).then(function (res) {
        $scope.payAddress = res.response.data[0] || new addressModel();
        if ($scope.payAddress.IsDelivery == false || $scope.payAddress.IsDelivery == 0) {
          //切换是否有教材地址的成功提示内容
          $scope.ispayAddress = false;
          $scope.payOn = true;
          $scope.isFromOrder || ($scope.timeout = $timeout($scope.goToMycourse, 3000))
        } else {
          $scope.ispayAddress = true;
          $scope.payOn = false;
        }
      });
      if (typeof (localStorageService.get('URLshortID')) != 'undefined' && localStorageService.get('APES4') != '1') {
        var GetUpdateAPES = UpdateAPES(ENV._api.__UpdateAPES);
        GetUpdateAPES.getModel({
          'apesType': '4',
          'URLTrafficID': localStorageService.get('URLshortID')
        }).then(function (res) {
        });
        localStorageService.set('APES4', '1');
      }
      //填写地址
      $scope.submit = function ($event, $form) {
        if ($form.$invalid) return false;
        var AddpayAddress = AddOrderAddress(ENV._api.__addorderaddress);
        AddpayAddress.postModel({
          "as_name": $scope.payAddress.DeliveryUser,
          "as_mobile": $scope.payAddress.DeliveryPhone,
          "as_address": $scope.payAddress.DeliveryAddress,
          "as_orderid": $scope.OrderId
        }).then(function (res) {
          //获取提交结果
          var ret = res.response.data;
          $Loading.show({class: ret ? MSGICON.success : MSGICON.fail, text: ret ? '提交成功，3秒后关闭!' : '提交失败!'}, 2500);
          if (ret) {
            $timeout(function () {
              $scope.$modal._remove();
            }, 3000)
          }
        });
      };
      $scope.goToMycourse = function () {
        getLotteryResult($scope.userData.rowId, $scope.OrderId);
      }
      //双11抽奖
      function getLotteryResult(StudentId, OrderId) {
        var lotteryDataUrl = '/Entrace/Dispatch.aspx?FunctionName=LuckyDraw.GetLuckyDrawDoubleEleven&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + StudentId + '","uuOrderId":"' + OrderId + '","flag":0}';
        $.ajax({
          type: 'GET',
          cache: 'false',
          url: lotteryDataUrl,
          dataType: "json",
          success: function (data) {
            if (data) {
              //返回抽奖信息
              if (data.numCode2 == 0) {
                $timeout(function () {
                  $state.go('mycourse');
                }, 1000);
              } else {
                $scope.openModal('lotteryDouble11', {lotteryNum: data.numCode2, OrderId: OrderId});
              }
            }
            $scope.timeout && $timeout.cancel($scope.timeout);
            $scope.$modal._remove();
          }
        });
      };
    });

});
