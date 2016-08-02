'use strict';

define(function () {
  angular.module('freexf')
    .controller('payagreement_ctrl', function ($scope, $rootScope, $frModal, $timeout, $freexfUser, ENV) {
      $scope.argument = function(b){
        $scope.$modal.remove();
        var paycourseId = $scope.$parent.$data.paycourseId;
        b&&$scope.$parent.openModal('pay',{paycourseId: paycourseId});
      }
    });
});

