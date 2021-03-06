'use strict';

angular.module('freexf')
  .controller('set_ctrl', function ($scope, $rootScope, $state, $injector, $ionicLoading, $timeout, localStorageService, AUTH) {
    $scope.showcontactour = false;
    $scope.log = AUTH.FREEXFUSER.data.userLg;

    $scope.showcontact = function () {
      $scope.showcontactour = true;
    };
    $scope.hidecontact = function () {
      $scope.showcontactour = false;
    };
    $scope.toQuit = function () {
      AUTH.FREEXFUSER.data.userLg = false;
      AUTH.FREEXFUSER.data.Sign = null;
      AUTH.FREEXFUSER.data.rowId = null;
      $scope.freexfUser = AUTH.FREEXFUSER.data;
      $state.go('tab.myaccount');
    };

    $scope.$watch('freexfUser', function (value) {
      localStorageService.set(AUTH.FREEXFUSER.name, value);
    });
  });

