'use strict';

angular.module('freexf')
  .controller('cetMultilingual_ctrl', function ($scope, $rootScope, $injector, $state, $ionicLoading, $ionicModal, $fxModal, AUTH, ENV, DispatchRepository) {
      $scope.islogin = false;
      $scope.userData = AUTH.FREEXFUSER.data;
      $rootScope.$on('auth:update', function (event,auth) {
          $scope.userData = auth;
          $scope.islogin = $scope.userData.userLg ? true : false;
      })

      //登陆注册modal
      $fxModal.init($scope).then(function (modal) {
          $scope.modal = modal;
      });
      //传递：courseId 课程ID
      $scope.toCourseDate = function (courseId) {
          if ($scope.userData.userLg) {
              $state.go('coursedetail', { courseId: courseId });
          } else {
              $scope.modal.openModal('login');
          }
      };
      $scope.goOneBuy = function () {
          if ($scope.userData.userLg) {
              $state.go('oneBuy');
          } else {
              $scope.modal.openModal('login');
          }
      }
    $scope.tele = function () {
      $state.go('telephone', {telephone: '400-803-6611'})
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
