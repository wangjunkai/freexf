'use strict';


angular.module('freexf')
  .controller('login_ctrl', function ($scope, $rootScope, $state,$injector, $ionicLoading, $timeout) {

    $scope.toLogin = function () {
      $rootScope.user = true;
      $state.go('tab.member');
    };
    //$scope.home = Home.home.query({id:'1'});
    //$scope.username = (new Home.user()).getName();
//  require(['modules/index/index_ctrl'], function (shouye_ctrl) {
//    $injector.invoke(shouye_ctrl, this, {'$scope': $scope});
//  });
  });

