angular.module('freexf')
  .controller('myrecommend_ctrl', function ($scope, $rootScope, $timeout, $state,$frModal, $freexfUser, ENV) {
    //传递：courseId 课程ID
    var modal_ary = {
      coursedetail: {
        scope: $scope,
        ctrlUrl: 'modules/course/coursedetail',
        tempUrl: 'modules/course/coursedetail.html'
      }
    };
    $scope.openModal = function (name,data,back) {
      $frModal.openModal($scope, name, modal_ary, data, back);
    };
  });
