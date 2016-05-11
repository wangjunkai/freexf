'use strict';
define([], function () {
  return ['$scope', function ($scope) {
    $scope.welcomeMessage = 'hey this is ctrl2.js!';
    $scope.$apply();
  }];
});
