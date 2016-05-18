'use strict';

angular.module('freexf')
  .controller('set_ctrl', function ($scope, $rootScope, $state, $injector, $ionicLoading, $timeout) {
    $scope.showcontactour=false;
    $scope.showcontact = function () {
      $scope.showcontactour=true;
    };
    $scope.hidecontact = function () {
      $scope.showcontactour=false;
    };
    $scope.toQuit = function () {
      $rootScope.user = false;
      $state.go('myaccount');
    }
  });

