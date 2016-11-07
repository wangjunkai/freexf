'use strict';

angular.module('freexf')
  .controller('cetMultilingual_ctrl', function ($scope, $rootScope, $injector, $state, $ionicLoading, AUTH, ENV, DispatchRepository) {

    //传递：courseId 课程ID
    $scope.toCourseDate = function (courseId) {
      $ToDetailState.go('coursedetail', {courseId: courseId});
    };
    $scope.tele = function () {
      $ToDetailState.go('telephone', {telephone: '400-803-6611'})
    };
    getTeacher("多语种");
    getTeacher("英语");
    function getTeacher(str) {
      var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.%E6%95%99%E5%B8%88%E5%88%97%E8%A1%A8&Version=1&EndClientType=H5&Key=""&JsonPara={"Second":"' + str + '"}';
      $.ajax({
        type: 'POST',
        cache: 'false',
        url: teacherList,
        dataType: "json",
        success: function (data) {
          $scope.$apply(function () {
            if (str == "多语种") {
              $scope.teacherList = data;
            } else if (str == "英语") {
              $scope.EnglishTeacherList = data;
            }
          })
        }
      });
    }

  });
