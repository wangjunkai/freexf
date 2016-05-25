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

		$scope.$on('$ionicView.loaded', function () {
		    /*        $timeout(function () {
             $ionicLoading.hide();
             }, 0);*/
		});
      
		CourseList.getModel({ "category": "多语种","lingual":"", "label": "", "orderBy": "xuefen", "order": "desc", "pageIndex": '0', "pageMax": '2' }).then(function (res) {
		    $scope.courseList = res.response.data;
            
		    //console.log(res);
		});
  })

