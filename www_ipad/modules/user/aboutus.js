'use strict';

define(function () {
  angular.module('freexf')
    .controller('aboutus_ctrl',
      function ($scope, $sce, $timeout, $ionicLoading, $exceptionHandler, ENV, aboutUs) {
        var AboutUs = aboutUs(ENV._api.__aboutus);
        AboutUs.getModel({"as_文章ID": "4|%55E?EN;C?P(#|C!TI5E"}).then(function (res) {
          $scope.aboutus = res.response.data[0];
        });
        $scope.getAboutus = function (name) {
          return $sce.trustAsHtml($scope.aboutus&&$scope.aboutus[name]);
        }
      }
    )
});
