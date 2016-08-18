'use strict';

angular.module('freexf')
  .controller('searchresult_ctrl', function ($scope, $rootScope, $http, $location, $injector, $ionicLoading, $frModal, $state, $timeout, ENV, SearchCourse, $ionicScrollDelegate) {
    var searchCourse = SearchCourse(ENV._api.__searchcourse);
    var count = 0;
    var pageMax = 6;
    $scope.courseList = null;
    $scope.searchString = {
      value: $state.params.q || '',
      valueformat: function () {
        if ($state.params.q) {
          return '"' + $state.params.q + '"';
        }
      }()
    };
    $scope.uppageshow = false;

    //监听value
    $scope.$watch('searchString.value', function (v, o) {
      !v && ($ionicScrollDelegate.scrollTop(), $scope.courseList = null, $scope.uppageshow = false);
      $scope.getResult(v);
    });
    //点击搜索按钮事件
    $scope.getResult = function (str) {
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
        $scope.courseList = $scope.courseList.concat(res.response.data);
        if ($scope.courseList.length < count * pageMax && count > 0) {
          $scope.uppageshow = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      SearchResult(callback);
    };

    function SearchResult(callback) {
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
    var modal_ary = {
      coursedetail: {
        scope: $scope,
        ctrlUrl: 'modules/course/coursedetail',
        tempUrl: 'modules/course/coursedetail.html'
      }
    };
    $scope.openModal = function (name, data, back) {
      $frModal.openModal($scope, name, modal_ary, data, back);
    };
  });
