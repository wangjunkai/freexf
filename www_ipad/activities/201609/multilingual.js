'use strict';

angular.module('freexf')
  .controller('multilingual_ctrl', function ($scope, $rootScope, $injector, $location, $state, $ionicPopup, $frModal, $ionicLoading, $ionicScrollDelegate, AUTH, ENV) {
      $scope.multilingualList = {};
      $scope.num1 = 4;
      $scope.num2 = 4;
      $scope.num3 = 4;
      $scope.num4 = 4;
      $scope.num5 = 4;
      $scope.all = true;
      getMultilingualList("")
      getTeacher("多语种");

      $scope.category = function ($event, str) {
          $('.multilingual-btn-more button').text("点击查看更多相关课程");
          $scope.num1 = 4;
          $scope.num2 = 4;
          $scope.num3 = 4;
          $scope.num4 = 4;
          $scope.num5 = 4;
          var thisText = str;
          var childLi = document.querySelectorAll('.multilingual-nav li');
          for (var i = 0; i < childLi.length; i++) {
              childLi[i].className = "";
          }
          $($event.target).parents('li').addClass("active");
          thisText = (thisText == "全部") ? "" : thisText;
          getMultilingualList(thisText);
          if (thisText) {
              $scope.all = false;
              getTeacher("多语种/" + thisText);
          } else {
              $scope.all = true;
              getTeacher("多语种");
          }
      }
      $scope.setData = function (len, e, idx) {
          if (e.target.innerHTML == "点击收起") {
              $scope[idx] = 4;
              e.target.innerHTML = "点击查看更多相关课程";
              $ionicScrollDelegate.scrollBottom();
          } else {
              $scope[idx] = $scope[idx] + 8;
              e.target.innerHTML = ($scope[idx] >= len) ? "点击收起" : "点击查看更多相关课程";
          }
      };
      //传递：courseId 课程ID
      var modal_ary = {
          coursedetail: {
              scope: $scope,
              ctrlUrl: 'modules/course/coursedetail',
              tempUrl: 'modules/course/coursedetail.html'
          }
      };
      $scope.toCourseDate = function (name, data, back) {
          $frModal.openModal($scope, name, modal_ary, data, back);
      };
      function getMultilingualList(str) {
          var multilingualList = '/Entrace/Dispatch.aspx?FunctionName=Activity.GetMultilingualList&Version=1&EndClientType=H5&Key=""&JsonPara={"Type":"' + str + '"}';

          $.ajax({
              type: 'POST',
              cache: 'false',
              url: multilingualList,
              dataType: "json",
              success: function (data) {
                  $scope.$apply(function () {
                      $scope.multilingualList = data;
                  })
              }
          });

      }
      function getTeacher(str) {
          var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.%E6%95%99%E5%B8%88%E5%88%97%E8%A1%A8&Version=1&EndClientType=H5&Key=""&JsonPara={"Second":"' + str + '"}';
          $.ajax({
              type: 'POST',
              cache: 'false',
              url: teacherList,
              dataType: "json",
              success: function (data) {
                  $scope.$apply(function () {
                      $scope.teacherList = data;
                  })
              }
          });
      }
  })