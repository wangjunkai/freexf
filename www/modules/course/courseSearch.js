
'use strict';

angular.module('freexf', ['ionic'])


     .controller('coursesearch_ctrl', function ($scope, $rootScope, $http, $location, $injector, $ionicLoading, $state, $timeout, ENV, SearchCourse, $ionicScrollDelegate) {
         var count = 0;
         var pageMax = 5;
         $scope.SearchNull = false;
         $scope.searchString = '';
         $scope.uppageshow = false;
         $scope.bottomtext=''
         //清空input值
         $scope.ClearAll = function () {
             $scope.searchString = '';
         }
         //点击搜索按钮事件
         //判断是否为空
         $scope.SearchResult = function () {
             searchCourse.getModel({ "seekKey": $scope.searchString, "orderBy": "xuefen", "order": "desc", "pageIndex": count, "pageMax": pageMax }).then(function (res) {
                 if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
                     //小鹿的出现
                     $scope.SearchNull = true;
                     $scope.courseList = '';

                 } else {
                     $ionicScrollDelegate.scrollTop();
                     //分页初始化
                     count = 0;
                     $scope.courseList = '';
                     $scope.SearchNull = false;

                     $scope.courseList = res.response.data;
                     $scope.uppageshow = true;
                 };
             });
         }
         //下拉分页
         $scope.doRefresh = function () {
             //注意改为自己本站的地址，不然会有跨域问题
             count += 1;
             $http.get('http://localhost:18048/MFreeXFapi/student/searchcourse?order=desc&orderBy=xuefen&pageIndex=' + count + '&pageMax=' + pageMax + '&seekKey=' + $scope.searchString)
                    .success(function (newitems) {
                        //列表
                        $scope.courseList = newitems;
                        //$scope.$broadcast('scroll.infiniteScrollComplete');
                        if (newitems.length < count * pageMax && count > 0) {
                            $scope.uppageshow = false;
                            $scope.bottomtext = '没有更多!'
                        }

                    })
                    .finally(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });

        };
         var searchCourse = SearchCourse(ENV._api.__searchcourse);

         $scope.$on('$ionicView.loaded', function () {

         });
         //传递：courseId 课程ID
         $scope.toCourseDate = function (courseId) {
             $state.go('coursedetail', { courseId: courseId });
         }
     })
