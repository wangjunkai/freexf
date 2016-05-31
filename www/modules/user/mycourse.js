'use strict';


angular.module('freexf')
  .controller('mycourse_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, AUTH, ENV, MyCourseRepository) {
      $scope.userData = AUTH.FREEXFUSER.data;
      var myCourse = MyCourseRepository(ENV._api.__mycourse);
      $scope.$on('$ionicView.loaded', function () {
          
      });
      myCourse.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "pageIndex": "0", "pageMax": "10" }).then(function (res) {
          $scope.mycourselist = res.response.data;
      });
     

  })
