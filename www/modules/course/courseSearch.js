
'use strict';
angular.module('freexf', ['ionic'])
     .controller('coursesearch_ctrl', function ($scope, $rootScope, $http, $location, $injector, $ionicLoading, $state, $timeout, ENV, SearchCourse, $ionicScrollDelegate) {
         var count = 0;
         var pageMax = 5;
         $scope.SearchNull = false;
         $scope.searchString = {};
         $scope.uppageshow = false;
         $scope.bottomtext='';
         //清空input值
         $scope.ClearAll = function () {
             $scope.searchString.value = '';
         };
         //点击搜索按钮事件
         //判断是否为空
         $scope.SearchResult = SearchResult;
         $scope.getResult = function (str) {
             $scope.searchString.value = str;
             SearchResult();
         };
         function SearchResult() {
             searchCourse.getModel({ "seekKey": $scope.searchString.value, "orderBy": "xuefen", "order": "desc", "pageIndex": count, "pageMax": pageMax }).then(function (res) {
                 if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
                     //小鹿的出现
                     $scope.SearchNull = true;
                     $scope.courseList = '';
                     $scope.bottomtext = '';
                 } else {
                     $ionicScrollDelegate.scrollTop();
                     //分页初始化
                     count = 0;
                     $scope.courseList = '';
                     $scope.SearchNull = false;

                     $scope.courseList = res.response.data;
                     $scope.uppageshow = true;
                 }
             });
         };
         //下拉分页
         $scope.doRefresh = function () {
             //注意改为自己本站的地址，不然会有跨域问题
             count += 1;
             searchCourse.getModel({ "seekKey": $scope.searchString.value, "orderBy": "xuefen", "order": "desc", "pageIndex": count, "pageMax": pageMax }).then(function (res) {
                 $scope.courseList = res.response.data;
                 if ($scope.courseList.length < count * pageMax && count > 0 && !$scope.SearchNull) {
                     $scope.uppageshow = false;
                     $scope.bottomtext = '没有更多!'
                 }
                 $scope.$broadcast('scroll.infiniteScrollComplete');
             });
        };
         var searchCourse = SearchCourse(ENV._api.__searchcourse);
         $scope.$on('$ionicView.loaded', function () {

         });
         //传递：courseId 课程ID
         $scope.toCourseDate = function (courseId) {
             $state.go('coursedetail', { courseId: courseId });
         };
     });
