'use strict';


angular.module('freexf', ['ionic'])
  .controller('mycourse_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $state, $stateParams, $timeout, $http, $ionicScrollDelegate, AUTH, ENV, MyCourseRepository) {
    var count = 0;
    var pageMax = 6;
    $scope.uppageshow = false;
    $scope.userData = AUTH.FREEXFUSER.data;
    $scope.mycourselist = [];
    //var myCourse = MyCourseRepository(ENV._api.__mycourse);
    var params = {
      studentId: $scope.userData.userLg ? $scope.userData.rowId : '',
      Sign: $scope.userData.userLg ? $scope.userData.Sign : '',
      pageIndex: count,
      pageMax: pageMax
    }
    //myCourse.getModel(params).then(function (res) {
    //    console.log(res.response.data)
    //});
    getCourseList();
    function getCourseList() {
        var courseListUrl = '/Entrace/Dispatch.aspx?FunctionName=Student.MyCourses&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + params.studentId + '","Sign":"' + params.Sign + '","PageIndex":' + params.pageIndex + ',"PageMax":' + params.pageMax + '}';
        $.ajax({
            type: 'GET',
            cache: 'false',
            url: courseListUrl,
            dataType: "json",
            success: function (data) {
                $scope.$apply(function () {
                    if (data) {
                        $scope.mycourselist = data;
                        $scope.uppageshow = true;
                        $ionicScrollDelegate.scrollTop();
                    }
                })
            }
        });
    }
    
    //上拉刷新
    //分页
    $scope.doRefresh = function () {
        count += 1;
        var pageIdx=count+1
        var courseListUrl = '/Entrace/Dispatch.aspx?FunctionName=Student.MyCourses&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + params.studentId + '","Sign":"' + params.Sign + '","PageIndex":' + count + ',"PageMax":' + params.pageMax + '}';
        $.ajax({
            type: 'GET',
            cache: 'false',
            url: courseListUrl,
            dataType: "json",
            success: function (data) {
                $scope.$apply(function () {
                    if (data) {
                        $scope.mycourselist = $scope.mycourselist.concat(data);
                        if ($scope.mycourselist.length < pageIdx * pageMax && count > 0) {
                            $scope.uppageshow = false;
                            $scope.bottomtext = '没有更多!'
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                })
            }
        });
    };
    $scope.goStudy = function (courseId, state, issoldout) {
      if (!issoldout) {
        $state.go('coursedetail', {courseId: courseId, state: state});
      }
    };
    $scope.goPaperList = function (state, courseId, paperState, ProductName) {
        $state.go(state, { courseId: courseId, paperState: paperState });
        $rootScope.courseName = ProductName;
    }
    $scope.go = function (state, courseId) {
        $state.go(state, { courseId: courseId });
    }
  })
  .filter('dateshow', function () {
    return function (item) {
      return item.substring(0, 10);
    }
  })
  .filter('expired', function () {
    return function (item) {
      if (item == 0) {
        return 0;
      } else {
        return item;
      }
    }
  });

