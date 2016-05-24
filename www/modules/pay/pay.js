'use strict';


angular.module('freexf')
  .controller('pay_ctrl', function ($scope, $rootScope,$state, $ionicPopup, $injector, $ionicLoading, $timeout) {
    $scope.toPay = function(){
      $state.go('paysuccess');
    };

});
