'use strict';

angular.module('freexf')
  .controller('aboutus_ctrl', function ($scope, $timeout, $ionicLoading, $exceptionHandler, ENV, aboutUs) {
    var AboutUs = aboutUs(ENV._api.__aboutus);
    $scope.$on('$ionicView.loaded', function () {});
    AboutUs.getModel({"as_文章ID":"d75589041cb24c048251de37fc1f44f2"}).then(function (res) {
      $scope.aboutus=res.response.data[0];
    })
  });
