'use strict';

angular.module('freexf')
  .controller('sixFoldCarnival_ctrl', function ($scope, $state,$frModal) {

    //传递：courseId 课程ID
    var modal_ary = {
      coursedetail: {
        scope: $scope,
        ctrlUrl: 'modules/course/coursedetail',
        tempUrl: 'modules/course/coursedetail.html'
      }
    };
    $scope.goDetail = function (name, data, back) {
      $frModal.openModal($scope, name, modal_ary, data, back);
    };
    $scope.goPlate = function(obj){
      $state.go('courseplate',obj);
    };
  });
