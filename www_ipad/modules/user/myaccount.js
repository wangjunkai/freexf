'use strict';


var app = angular.module('freexf');
app.controller('myaccount_ctrl', function ($scope, $rootScope, $controller, $ionicSideMenuDelegate, $injector, $ionicLoading, $timeout, $ocLazyLoad, $ionicModal, $frModal) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $frModal({
    ctrlUrl: 'modules/user/login',
    tempUrl: 'modules/user/login.html'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function () {
    $scope.modal.show();
  };
});
