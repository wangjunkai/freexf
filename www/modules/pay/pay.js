'use strict';


angular.module('freexf')
  .controller('pay_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $injector, $ionicLoading, $timeout, AUTH, ENV, AddOrderFun) {
      var AddOrder = AddOrderFun(ENV._api.__AddOrder);
      $scope.userData = AUTH.FREEXFUSER.data;
      var payform = {
          ProductId: $rootScope.paycourseId,
          studentId:$scope.userData.rowId ,
          Sign:  $scope.userData.Sign ,
      };
      AddOrder.create(payform).then(function (res) {
          $scope.payohref = res.response.data[0];
          $scope.payoname = res.response.data[1];
          $scope.payomoney = res.response.data[2];
      });

    $scope.toPay = function(){
      $state.go('paysuccess');
    };

});
