'use strict';


angular.module('freexf')
  .controller('courseplate_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, $stateParams, ENV, CourseListRepository, GetCategoryRepository) {
        $scope.Category1 = $stateParams.Category1;  //一级分类
        $scope.Category2 = $stateParams.Category2;  //二级分类
        ($scope.Category2 == "") ? $scope.lingual = "全部" : $scope.lingual = $scope.Category2;  
        $scope.languageclass = false;   //分类收缩状态
        $scope.languageClassShow = function () {
            $scope.languageclass = !$scope.languageclass;
        };
        //获取课程列表
		var CourseList = CourseListRepository(ENV._api.__courselistpage);
		CourseList.getModel({ "category": $scope.Category1, "lingual": $scope.Category2, "label": "", "orderBy": "zonghe", "order": "desc", "pageIndex": '0', "pageMax": '30' }).then(function (res) {
		    $scope.courseList = res.response.data;
		});
        //获取一二级分类菜单
		var GetCategory = GetCategoryRepository(ENV._api.__GetCategory);
		GetCategory.getModel().then(function (res) {
		    $scope.Category1List = res.response.data[0]['ls_Category'];
		    getIdx($scope.Category1List);
		    $scope.categorys = res.response.data[0]['ls_lingualList'][$scope.Category1Idx];   //二级分类菜单
		});
        //已知一级分类获取一级分类的下标
		function getIdx(arry) {
		    $scope.Category1Idx = null;
		    for (var i = 0; i < arry.length; i++) {
		        if (arry[i] == $scope.Category1) {
		            $scope.Category1Idx = i;
		            return;
		        }
		    }
		};
        //选择排序方式
		$scope.courseSort = function ($event) {
		    var child = document.querySelectorAll('.freexf-coursesort>div div');
		    var sortText = $event.target.innerHTML;
		    for (var i = 0; i < child.length; i++) {
		        child[i].className = "";
		    }
		    $event.target.className = "active";
		    switch (sortText) {
		        case "综合":
		            sortText = 'zonghe';
		            break;
		        case "最近":
		            sortText = 'zuijin';
		            break;
		        case "学分":
		            sortText = 'xuefen';
		            break;
		    }
		    CourseList.getModel({ "category": $scope.Category1, "lingual": $scope.Category2, "label": "", "orderBy": sortText, "order": "desc", "pageIndex": '0', "pageMax": '30' }).then(function (res) {
		        if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
		            //没有结果
		        } else {
		            $scope.courseList = res.response.data;
		        };

		    });
		};
        //选择课程分类
		$scope.category = function ($event) {
		    $scope.languageclass = false;
		    var childLi = document.querySelectorAll('.freexf-languageclass li');
		    var thisText = $event.target.innerHTML;
		    for (var i = 0; i < childLi.length; i++) {
		        childLi[i].className = "";
		    }
		    $event.target.className = "active";
		    $scope.lingual = thisText;
		    (thisText == "全部") ? thisText = "" : thisText;
		    $scope.Category2 = thisText;
		    CourseList.getModel({ "category": $scope.Category1, "lingual": $scope.Category2, "label": "", "orderBy": "zonghe", "order": "desc", "pageIndex": '0', "pageMax": '10' }).then(function (res) {
		        if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
		            //没有结果
		        } else {
		            $scope.courseList = res.response.data;
		        };
		    });
		};
        //传递：courseId 课程ID
		$scope.toCourseDate = function (courseId) {
		    $state.go('coursedetail', { courseId: courseId });
		};
  })
