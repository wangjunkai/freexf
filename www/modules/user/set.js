'use strict';

angular.module('freexf')
  .controller('set_ctrl', function ($scope, $rootScope, $state, $injector, $ionicLoading, $timeout, localStorageService ,AUTH) {
    $scope.showcontactour = false;
    $scope.showcontact = function () {
      $scope.showcontactour = true;
    };
    $scope.hidecontact = function () {
      $scope.showcontactour = false;
    };
    $scope.toQuit = function () {
      AUTH.FREEXFUSER.data.userLg = false;
      $scope.freexfUser = AUTH.FREEXFUSER.data;
      $state.go('myaccount');
    };

    $scope.$watch('freexfUser', function (value) {
      localStorageService.set(AUTH.FREEXFUSER.name, value);
    });
  });

