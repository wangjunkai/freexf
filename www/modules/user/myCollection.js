angular.module('freexf')
  .controller('mycollection_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, $stateParams, AUTH, ENV, GetMyFavoriteRepository, DelMyFavoriteRepository) {
      $scope.userData = AUTH.FREEXFUSER.data;
      console.log($scope.userData);
      //我的收藏
      var getMyFavorite = GetMyFavoriteRepository(ENV._api.__myfavorite);
      getMyFavorite.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "pageIndex": "0", "pageMax": "5" }).then(function (res) {
          $scope.myfavorite = res.response.data;
      });
      $scope.delfavorite = function (courseId) {
          //取消收藏
          var DelFavorite = DelMyFavoriteRepository(ENV._api.__delfavorite);
          DelFavorite.create({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "ProductId": courseId }).then(function (res) {
              if (res.response.data == true) {
                  console.log("DelFavorite");
              }
          })
      }
      $scope.goStudy = function (courseId) {
          $state.go('coursedetail', { courseId: courseId });
      }

  });
