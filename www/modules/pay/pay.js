'use strict';


angular.module('freexf')
  .controller('pay_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $injector, $stateParams, $ionicLoading, $timeout, AUTH, ENV, AddOrderFun, UpdateAPES, localStorageService) {
      var AddOrder = AddOrderFun(ENV._api.__AddOrder);
      $scope.userData = AUTH.FREEXFUSER.data;
      $scope.OrderId = $stateParams.OrderId;
      
      AddOrder.create({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "ProductId": $rootScope.paycourseId}).then(function (res) {
          
          $scope.AddOrder = res.response.data;
          $scope.payohref = res.response.data.AliPayId;
          $scope.payoname = res.response.data.ProductName;
          $scope.payomoney = res.response.data.price;
          $scope.payood = res.response.data.orderFormatId;
          $scope.orderId = res.response.data.OrderId;
          $scope.SetOrderTime = res.response.data.SetOrderTime;
          $scope.orderError = false;

          if (typeof (localStorageService.get('URLshortID')) != 'undefined' && localStorageService.get('APES3') != '1') {
              var GetUpdateAPES = UpdateAPES(ENV._api.__UpdateAPES);
              GetUpdateAPES.getModel({ 'apesType': '3', 'URLTrafficID': localStorageService.get('URLshortID') }).then(function (res) { });
              localStorageService.set('APES3', '1');
          };
          if ($scope.payomoney == null || $scope.payoname == null || $scope.orderId == null || $scope.SetOrderTime == null) {
              $scope.orderError = true;
              $scope.payhide=true
          } else {
              $scope.payhide = false
          }
          $scope.goOrderDetail = function () {
              $state.go('payaddress', { OrderId: $scope.payood });
          };
          
          if ($scope.payomoney == 0) {
              $scope.mianfeiShow = true;
              setTimeout(function () {
                  $scope.goOrderDetail();
              }, 3000)
          } else{
              $scope.mianfeiShow = false;
          }

          $scope.RealTimeUpdate = function (obj) {
              var thisRurl = '/MFreeXFapi/student/RealTimeUpdate';
              var rturl = $(obj).attr('rthref');
              $.ajax({
                  type: 'post',
                  cache: 'false',
                  url: thisRurl,
                  data: 'ProductId=' + $rootScope.paycourseId + '&studentid=' + $scope.userData.rowId + '&orderid=' + $scope.payood,
                  success: function (data) {
                      if (data != true) {
                          $scope.$apply(function () {
                              $scope.orderError = true;
                          });
                      } else {
                          window.location.href = rturl
                      }
                  },
                  error: function (data) {
                  }
              });
          };
      });
      $scope.ThisWX =  false;
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
          $scope.ThisWX = true;
      }
      $scope.goback = function () {
          history.go(-1);
      }
});
