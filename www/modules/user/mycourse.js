'use strict';


angular.module('freexf')
  .controller('mycourse_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, ENV, myCourse) {

      var myCourse = myCourse(ENV._api.__mycourse);

      $scope.$on('$ionicView.loaded', function () {
          
      });

      myCourse.getModel({ "studentId": "58000058", "Sign": "123", "pageIndex": "1", "pageMax": "10" }).then(function (res) {
          $scope.mycourselist = res.response.data;

      });
     

  })
