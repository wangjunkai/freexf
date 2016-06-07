﻿angular.module('freexf', ['ionic'])
  .controller('mycollection_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, $stateParams,$ionicScrollDelegate, AUTH, ENV, GetMyFavoriteRepository, DelMyFavoriteRepository) {
      var getMyFavorite = GetMyFavoriteRepository(ENV._api.__myfavorite);
      var DelFavorite = DelMyFavoriteRepository(ENV._api.__delfavorite);
      var count = 0;
      var pageMax = 5;
      $scope.uppageshow = false;
      $scope.userData = AUTH.FREEXFUSER.data;
      var params = {
          studentId: $scope.userData.userLg ? $scope.userData.rowId : '',
          Sign: $scope.userData.userLg ? $scope.userData.Sign : '',
          pageIndex: count,
          pageMax:pageMax
      }
      getMyfavorite();      
     
      $scope.delfavorite = function (courseId) {
          //取消收藏          
          DelFavorite.postModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "ProductId": courseId }).then(function (res) {
              if (res.response.data == true) {
                  getMyfavorite();
              }
          })
      }
      //上拉刷新
      //分页
      $scope.doRefresh = function () {          
          count += 1;
          getMyFavorite.getModel({'studentId':params.studentId,'Sign':params.Sign,'pageIndex':count,'pageMax':params.pageMax}).then(function (res) {
              $scope.myfavorite = res.response.data;
              if ($scope.myfavorite.length < count * pageMax && count > 0) {
                  $scope.uppageshow = false;
                  $scope.bottomtext = '没有更多!'
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');
          });
      };
      $scope.goStudy = function (courseId) {
          $state.go('coursedetail', { courseId: courseId });
      }
      //我的收藏 
      function getMyfavorite() {
          getMyFavorite.getModel(params).then(function (res) {    
              $scope.uppageshow = true;
              $scope.myfavorite = res.response.data;
              console.log($scope.myfavorite.length);
          });
      }

  })
.filter('IsBought', function () {
    return function (item) {
        if (item=="False") {
            return "立即购买";
        } else if(item=="True") {
            return "立即学习";
        }
    }
})
