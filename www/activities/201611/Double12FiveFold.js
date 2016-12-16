'use strict';

angular.module('freexf')
  .controller('Double12FiveFold_ctrl', function ($scope, $rootScope, $injector, $state, $ionicLoading, $ionicModal, $fxModal, AUTH, ENV, DispatchRepository) {
      //传递：courseId 课程ID
      $scope.goDetail = function (courseId) {
          $state.go('coursedetail', { courseId: courseId });
      };
      $scope.goPlate = function (obj) {
          $state.go('courseplate', obj);
      };
      $scope.goregister = function () {
          $state.go('register');
      }

  });
