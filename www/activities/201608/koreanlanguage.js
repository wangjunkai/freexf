'use strict';

angular.module('freexf')
  .controller('korean_ctrl', function ($scope, $rootScope, $injector, $state, $ionicLoading, AUTH, ENV, DispatchRepository) {
      $scope.toCourseDate = function (courseId) {
          $state.go('coursedetail', { courseId: courseId });
      }
      $scope.more = function () {
          $state.go('courseplate', { Category1: '多语种', Category2: '韩语' });
      }

  });