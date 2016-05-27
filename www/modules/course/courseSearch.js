
'use strict';

angular.module('freexf', ['ionic'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
     .controller('coursesearch_ctrl', function ($scope, $rootScope, $http, $location, $injector, $ionicLoading, $timeout, ENV, SearchCourse, $ionicScrollDelegate) {
         var count = 0;
         var pageMax = 10;
         $scope.SearchNull = false;
         $scope.searchString = '';
         $scope.uppageshow = false;
         $scope.bottomtext='点击搜索框,搜索内容'
         //清空input值
         $scope.ClearAll = function () {
             $scope.searchString = '';
         }
         //点击搜索按钮事件
         $scope.SearchResult = function () {
             searchCourse.getModel({ "seekKey": $scope.searchString, "orderBy": "xuefen", "order": "desc", "pageIndex": count, "pageMax": pageMax }).then(function (res) {
                 if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
                     //小鹿的出现
                     $scope.SearchNull = true;
                     $scope.courseList = '';
                     
                 } else {
                     $ionicScrollDelegate.scrollTop();
                     count = 0;
                     $scope.courseList = '';
                     $scope.SearchNull = false;
                     //$scope.courseList = res.response.data;
                     $scope.uppageshow = true;
                 };
             });
         }
         //上拉刷新
         $scope.doRefresh = function () {
            //注意改为自己本站的地址，不然会有跨域问题
             $http.get('http://localhost:18048/MFreeXFapi/student/searchcourse?order=desc&orderBy=xuefen&pageIndex=' + count + '&pageMax=' + pageMax + '&seekKey=' + $scope.searchString)
                    .success(function (newitems) {
                        $scope.courseList = newitems;
                        //$scope.$broadcast('scroll.infiniteScrollComplete');
                        if (newitems.length < count * pageMax && count > 0) {
                            $scope.uppageshow = false;
                            $scope.bottomtext = '没有更多!'
                        }
                            
                    })
                    .finally(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        //$scope.$broadcast('scroll.refreshcomplete');
                    });
             count += 1;
             
        };
         var searchCourse = SearchCourse(ENV._api.__searchcourse);

         $scope.$on('$ionicView.loaded', function () {

         });
     })
 

