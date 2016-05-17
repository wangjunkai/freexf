'use strict';

angular.module('freexf')
  .controller('set_ctrl',function ($scope, $rootScope, $injector, $ionicLoading, $timeout) {
    $scope.setindex=true;
    $scope.ideafeedback=false;
    $scope.showideafeedback=function(){
      $scope.ideafeedback=true;
      $scope.setindex=false;
    }
    $scope.hideideafeedback=function(){
      $scope.setindex=true;
      $scope.ideafeedback=false;
    }
    $scope.showcontact=function() {
      $(".freexf-contact").css("display")=="block"?$(".freexf-contact").css("display","none"):$(".freexf-contact").css("display","block");

    }

  })

