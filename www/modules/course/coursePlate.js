'use strict';


angular.module('freexf')
  .controller('courseplate_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, ENV, CourseList) {
    //$scope.home = Home.home.query({id:'1'});
    //$scope.username = (new Home.user()).getName();
//  require(['modules/index/index_ctrl'], function (shouye_ctrl) {
//    $injector.invoke(shouye_ctrl, this, {'$scope': $scope});
//  });
		
		$scope.languageclass = false;
		$scope.languageClassShow=function(){
			$scope.languageclass=!$scope.languageclass;
		}

		var CourseList = CourseList(ENV._api.__courselistpage);
		$scope.obj = [
          {}, {}, {}, {}
		];

		$scope.$on('$ionicView.loaded', function () {
		    /*        $timeout(function () {
             $ionicLoading.hide();
             }, 0);*/
		});
		CourseList.getModel({ "category": "multilingual", "label": "all", "orderBy": "none", "pageIndex": '5' }).then(function (res) {
            debugger
		    //$scope.home = res.response.data[0];
		    console.log(res);
		});
  })

