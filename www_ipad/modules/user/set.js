'use strict';

angular.module('freexf')
  .controller('set_ctrl', function ($scope, $rootScope, $state, $injector, $ionicLoading, $timeout, $frModal, $ionicSideMenuDelegate, localStorageService, $freexfUser,$userTabs) {
    $scope.showcontactour = false;
    $scope.log = $freexfUser.auth().userLg;

    $scope.showcontact = function () {
      $scope.showcontactour = true;
    };
    $scope.hidecontact = function () {
      $scope.showcontactour = false;
    };
    $scope.toQuit = $freexfUser.toQuit;
    //监听是否是登陆状态
    $rootScope.$on('auth:update', function (event, auth) {
      $scope.log = auth.userLg;
    });
  });

