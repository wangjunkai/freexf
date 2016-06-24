'use strict';
angular.module('freexf', ['ionic'])
  .controller('coursesearch_ctrl', function ($scope, $rootScope, $http, $location, $injector, $ionicLoading, $state, $timeout, ENV, SearchCourse, $ionicScrollDelegate) {
    var searchCourse = SearchCourse(ENV._api.__searchcourse);
    var count = 0;
    var pageMax = 6;
    $scope.courseList = null;
    $scope.searchString = {
      value: ''
    };
    $scope.isSearch = false;
    $scope.uppageshow = false;
    //清空input值
    $scope.ClearAll = function () {
      $scope.searchString.value = '';
    };
    //监听value
    $scope.$watch('searchString.value', function (v) {
      !v && ($ionicScrollDelegate.scrollTop(), $scope.isSearch = false, $scope.courseList = null, $scope.uppageshow = false);
    });
    //点击搜索按钮事件
    $scope.getResult = function (str) {
      str && ($scope.searchString.value = str);
      count = 0;
      var callback = function (res) {
        if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
          //小鹿的出现
          $scope.courseList = [];
        } else {
          $scope.courseList = res.response.data;
          $scope.uppageshow = true;
        }
      };
      SearchResult(callback);
    };
    //下拉分页
    $scope.doRefresh = function () {
      //注意改为自己本站的地址，不然会有跨域问题
      count += 1;
      var callback = function (res) {
        $scope.courseList = $scope.courseList.concat(res.response.data.splice(count * pageMax, pageMax));
        if ($scope.courseList.length < count * pageMax && count > 0) {
          $scope.uppageshow = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      SearchResult(callback);
    };

    function SearchResult(callback) {
      $scope.isSearch = true;
      searchCourse.getModel({
        "seekKey": $scope.searchString.value,
        "orderBy": "xuefen",
        "order": "desc",
        "pageIndex": count,
        "pageMax": pageMax
      }).then(function (res) {
        callback.call(this, res);
      });
    }

    //传递：courseId 课程ID
    $scope.toCourseDate = function (courseId) {
      $state.go('coursedetail', {courseId: courseId});
    };
  });
