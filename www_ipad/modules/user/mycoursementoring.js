'use strict';

define(function () {
  angular.module('freexf')
    .controller('mycoursementoring_ctrl', function ($scope, $state, $stateParams, $timeout, $freexfUser) {
      var data = {
        Sign: $freexfUser.auth().Sign,
        studentId: $freexfUser.auth().rowId,
        courseId: $scope.$parent.$data.ProductId
      };
      var noteList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetQuestionAnswer&Version=1&EndClientType=H5&Key=""&' +
        'JsonPara={"Sign":"' + data.Sign + '","StudentId":"' + data.studentId + '","CourseId":"' + data.courseId + '"}';
      $scope.notes = [];
      $.ajax({
        type: 'GET',
        cache: 'false',
        url: noteList,
        dataType: "json",
        success: function (data) {
          if (data && data.length > 0) {
            $scope.$apply(function () {
              $scope.notes = data;
            })
          }
        }
      });
    });
})
