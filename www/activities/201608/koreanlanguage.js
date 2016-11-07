'use strict';

angular.module('freexf')
  .controller('korean_ctrl', function ($scope, $rootScope, $injector, $state, $ToDetailState) {
    $scope.toCourseDate = function (courseId) {
      $ToDetailState.go('coursedetail',{courseId: courseId});
    };
    $scope.more = function () {
      $ToDetailState.go('courseplate',{Category1: '多语种', Category2: '韩语'});
    };
    $scope.tele = function(){
      $ToDetailState.go('telephone',{telephone:'400-803-6611'})
    }

  });
