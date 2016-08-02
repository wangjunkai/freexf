'use strict';


angular.module('freexf')
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
  })
  .controller('mycourse_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $state, $stateParams, $timeout, $http, $ionicScrollDelegate,$frModal, $freexfUser, ENV, MyCourseRepository) {
    var count = 0;
    var pageMax = 5;
    $scope.uppageshow = false;
    $scope.userData = $freexfUser.auth();
    $scope.mycourselist = [];
    var myCourse = MyCourseRepository(ENV._api.__mycourse);
    var params = {
      studentId: $scope.userData.userLg ? $scope.userData.rowId : '',
      Sign: $scope.userData.userLg ? $scope.userData.Sign : '',
      pageIndex: count,
      pageMax: pageMax
    };
    myCourse.getModel(params).then(function (res) {
      $scope.mycourselist = res.response.data;
      if ($scope.mycourselist.length = 0) {
        $scope.uppageshow = false;
        $scope.bottomtext = '你还没有购买课程!';
        $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {
        $ionicScrollDelegate.scrollTop();
        //分页初始化
        count = 0;
        $scope.uppageshow = true;
      }
    });
    //上拉刷新
    //分页
    $scope.doRefresh = function () {
      //注意改为自己本站的地址，不然会有跨域问题
      count += 1;
      myCourse.getModel({
        'studentId': params.studentId,
        'Sign': params.Sign,
        'pageIndex': count,
        'pageMax': params.pageMax
      }).then(function (res) {
        $scope.mycourselist = $scope.mycourselist?$scope.mycourselist:[];
        $scope.mycourselist = $scope.mycourselist.concat(res.response.data);
        if ($scope.mycourselist.length < count * pageMax && count > 0) {
          $scope.uppageshow = false;
          $scope.bottomtext = '没有更多!'
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };
    $scope.goStudy = function (courseId, state) {
      $state.go('coursedetail', {courseId: courseId, state: state});
    };
    //传递：courseId 课程ID
    var modal_ary = {
      coursedetail: {
        scope: $scope,
        ctrlUrl: 'modules/course/coursedetail',
        tempUrl: 'modules/course/coursedetail.html'
      }
    };
    $scope.openModal = function (name, data, issoldout, back) {
        if (!issoldout) {
            $frModal.openModal($scope, name, modal_ary, data, back);
        }
      
    };
  });
