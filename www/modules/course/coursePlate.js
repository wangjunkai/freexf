'use strict';


angular.module('freexf')
  .controller('coursePlate_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout) {
    //$scope.home = Home.home.query({id:'1'});
    //$scope.username = (new Home.user()).getName();
//  require(['modules/index/index_ctrl'], function (shouye_ctrl) {
//    $injector.invoke(shouye_ctrl, this, {'$scope': $scope});
//  });
		
		$scope.languageclass = false;
		$scope.languageClassShow=function(){
			$scope.languageclass=!$scope.languageclass;
		}
  })

