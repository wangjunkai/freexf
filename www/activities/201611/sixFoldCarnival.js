'use strict';

angular.module('freexf')
  .controller('sixFoldCarnival_ctrl', function ($scope, $state,$ionicScrollDelegate) {
    $scope.tobottom = function(){
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
    };
    //传递：courseId 课程ID
    $scope.goDetail = function (courseId) {
      $state.go('coursedetail', { courseId: courseId });
    };
    $scope.tele = function () {
      $state.go('telephone', {telephone: '400-803-6611'})
    };
    $scope.goPlate = function(obj){
      $state.go('courseplate',obj);
    };
    $scope.goregister = function(){
      $state.go('register');
    }
  });
