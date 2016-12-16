'use strict';


angular.module('freexf', ['ionic'])
  .controller('paperList_ctrl', function ($scope, $rootScope, $injector,  $ionicLoading, $state, $stateParams, AUTH) {
      $scope.userData = AUTH.FREEXFUSER.data;
      $scope.studentId = $scope.userData.userLg ? $scope.userData.rowId : '';
      $scope.courseId = $stateParams.courseId;
      $scope.paperState = $stateParams.paperState;

      if ($scope.paperState == "IsPaper") {
          getPaper();
      } else if ($scope.paperState == "IsPartPaper") {
          getPartPaper();
      }

      //测试
      function getPaper(){
          var getPaperUrl = '/Entrace/Dispatch.aspx?FunctionName=Exam.GetStudentPaper&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + $scope.studentId + '","CourseId":"' + $scope.courseId + '"}';
          $.ajax({
              url: getPaperUrl,
              data: {},
              type: "GET",
              dataType: "json",
              success: function (data) {
                  if(data.length>0){
                      $scope.$apply(function () {
                          $scope.PaperList = data;
                          $rootScope.courseName = data[0].ProductName;
                      
                      });
                  }
              }
          });
      }
      //练习
      function getPartPaper() {
          var getPartPaperUrl = '/Entrace/Dispatch.aspx?FunctionName=Exam.GetStudentPartPaper&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + $scope.studentId + '","CourseId":"' + $scope.courseId + '"}';
          $.ajax({
              url: getPartPaperUrl,
              data: {},
              type: "GET",
              dataType: "json",
              success: function (data) {
                  if (data.length > 0) {
                      $scope.$apply(function () {
                          $scope.PartPaperList = data;
                          $rootScope.courseName = data[0][0].ProductName
                      });
                  }
              }
          });
      }
      $scope.goPaper = function (paperCode, courseId, redo, analysis) {
          $state.go('ExaminationPaper', { paperCode: paperCode, courseId: courseId, redo: redo, analysis: analysis });
      }
      
  })
.filter('filterparPerCode', function () {
    return function (item) {
        var getCookie = getCookieValue(item);
        if (getCookie) {
            return true;
        } else {
            return false;
        }
    }
})