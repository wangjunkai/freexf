'use strict';

angular.module('freexf')
  .controller('summer_ctrl', function ($scope, $timeout, $ionicLoading, $exceptionHandler, $state, $ionicSlideBoxDelegate, AUTH, ENV, GetspecialAllListRepository) {
      var summer = GetspecialAllListRepository(ENV._api.__GetspecialAllList);
        $scope.$on('$ionicView.loaded', function () {
        });
        summer.getModel().then(function (res) {
            $scope.summer = res.response.data;
            $ionicSlideBoxDelegate.update();
        });
  });
//暑期班
//.controller('home_ctrl', function ($scope, $timeout, $ionicLoading, $exceptionHandler, $state, $ionicSlideBoxDelegate, AUTH, ENV, GetspecialAllListRepository) {
//    var summer = GetspecialAllListRepository(ENV._api.__GetspecialAllList);
//    $scope.$on('$ionicView.loaded', function () {
      //    });
  