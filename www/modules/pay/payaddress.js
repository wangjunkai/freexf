'use strict';


angular.module('freexf')
  .controller('payaddress_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $injector, $ionicLoading,$stateParams, $timeout, AUTH, ENV, PayAddress,OrderList, DelOrder) {
      var payAddress = PayAddress(ENV._api.__orderpay);
      $scope.courseId = $stateParams.courseId;
      $scope.userData = AUTH.FREEXFUSER.data;
      payAddress.getModel({ "Sign": $scope.userData.Sign, "OrderId": $scope.OrderId, "studentId": $scope.userData.rowId }).then(function (res) {
          alert()
          $scope.payAddress = res.response.data;
      })
});