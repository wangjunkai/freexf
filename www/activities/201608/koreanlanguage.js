'use strict';

angular.module('freexf')
  .controller('korean_ctrl', function ($scope, $rootScope, $injector, $state) {
    $scope.toCourseDate = function (courseId) {
      $state.go('coursedetail',{courseId: courseId});
    };
    $scope.more = function () {
      $state.go('courseplate',{Category1: '多语种', Category2: '韩语'});
    };
    $scope.tele = function(){
      $state.go('telephone',{telephone:'400-803-6611'})
    }

  });
