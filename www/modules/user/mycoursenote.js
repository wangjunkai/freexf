'use strict';


angular.module('freexf')
  .directive('getMore', function () {
    return {
      link: function (scope, ele, attrs) {
        var $ele = $(ele[0]),
          eheight = $ele.height(),
          vcontent = $('<div style="height: initial;display: none" class="notecontent">' + attrs.getMore + '</div>');
        $ele.append(vcontent);
        var vheight = $(vcontent).height();
        if (vheight > eheight) {
          scope.ismore = true;
        } else {
          scope.ishide = true;
        }
        scope.unfold = function () {
          if (scope.ismore) {
            $ele.attr('style', 'height: initial');
          } else {
            $ele.removeAttr('style');
          }
          scope.ismore = !scope.ismore;
        };
      }
    }
  })
  .controller('mycoursenote_ctrl', function ($scope, $state, $stateParams, $timeout, AUTH) {
    var data = {
      Sign: AUTH.FREEXFUSER.data.Sign,
      studentId: AUTH.FREEXFUSER.data.rowId,
      courseId: $stateParams.courseId
    };
    var noteList = '/Entrace/Dispatch.aspx?FunctionName=Student.Note&Version=1&EndClientType=H5&Key=""&' +
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
    $scope.remove = function (index, NoteId) {
      var deleteurl = '/Entrace/Dispatch.aspx?FunctionName=Student.RemoveNote&Version=1&EndClientType=H5&Key=""&' +
        'JsonPara={"Sign":"' + data.Sign + '","StudentId":"' + data.studentId + '","NoteId":"' + NoteId + '"}';
      $.ajax({
        type: 'POST',
        cache: 'false',
        url: deleteurl,
        dataType: "json",
        success: function (data) {
          if (data) {
            $scope.$apply(function () {
              $scope.notes && $scope.notes.splice(index, 1);
            })
          }
        }
      });
    }
  });

