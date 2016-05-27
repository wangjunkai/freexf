'use strict';


angular.module('freexf')
  .controller('courseplate_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, $stateParams, ENV, CourseListRepository, GetCategoryRepository) {
		
        $scope.Category1 = $stateParams.Category1;  //一级分类
        $scope.Category2 = $stateParams.Category2;  //二级分类
        $scope.languageclass = false;   //分类收缩状态
		$scope.languageClassShow=function(){
			$scope.languageclass=!$scope.languageclass;
		}
        //获取课程列表
		var CourseList = CourseListRepository(ENV._api.__courselistpage);
		CourseList.getModel({ "category": $scope.Category1, "lingual": "", "label": "", "orderBy": "xuefen", "order": "desc", "pageIndex": '0', "pageMax": '2' }).then(function (res) {
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
		}
        //选择排序方式        
		$scope.courseSort = function ($event) {
		    var child = document.querySelectorAll('.freexf-coursesort>div div');
		    for (var i = 0; i < child.length; i++) {
		        child[i].className = "";
		    }
		    $event.target.className = "active";
		}
        //二级分类筛选
		$scope.category = function ($event) {
		    var childLi = document.querySelectorAll('.freexf-languageclass li');
		    for (var i = 0; i < childLi.length; i++) {
		        childLi[i].className = "";
		    }
		    $event.target.className = "active";
		    document.querySelector('.freexf-courseNav').innerHTML = $event.target.innerHTML
		}
        //传递：courseId 课程ID
		$scope.toCourseDate = function (courseId) {
		    $state.go('coursedetail', {courseId:courseId});
		}

       /** 
       * <pre> 
       * @param arr 
       * @returns {Array} 如果arr中的元素存在空字符串''，则去掉该空字符串 
       * </pre> 
       */
		function skipEmptyElementForArray(arr) {
		    var a = [];
		    $.each(arr, function (i, v) {
		        var data = $.trim(v);//$.trim()函数来自jQuery  
		        if ('' != data) {
		            a.push(data);
		        }
		    });
		    return a;
		}
  })

