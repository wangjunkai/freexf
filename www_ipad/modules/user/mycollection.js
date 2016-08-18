angular.module('freexf')

    .filter('IsBought', function () {
        return function (item, status) {
            if (item == "False" && status == false) {
                return "立即购买";
            } else if (item == "False" && status == true) {
                return "尚未开课";
            } else if (item == "True") {
                return "立即学习";
            }
        }
    })
  .controller('mycollection_ctrl', function ($scope, $rootScope, $timeout, $state, $stateParams, $ionicScrollDelegate, $freexfUser,$frModal, ENV, GetMyFavoriteRepository, DelMyFavoriteRepository) {
    var getMyFavorite = GetMyFavoriteRepository(ENV._api.__myfavorite);
    var DelFavorite = DelMyFavoriteRepository(ENV._api.__delfavorite);
    var count = 0;
    var pageMax = 6;
    $scope.myfavorite = [];
    $scope.uppageshow = false;
    $scope.userData = $freexfUser.auth();
    var params = {
      studentId: $scope.userData.userLg ? $scope.userData.rowId : '',
      Sign: $scope.userData.userLg ? $scope.userData.Sign : '',
      pageIndex: count,
      pageMax: pageMax
    };
    getMyfavorite();

    $scope.delfavorite = function (courseId) {
      //取消收藏
      DelFavorite.postModel({
        "studentId": $scope.userData.rowId,
        "Sign": $scope.userData.Sign,
        "ProductId": courseId
      }).then(function (res) {
          if (res.response.data.struts == true) {
          count = 0;
          getMyfavorite();
        }
      })
    };
    //上拉刷新
    //分页
    $scope.doRefresh = function () {
      count += 1;
      getMyFavorite.getModel({
        'studentId': params.studentId,
        'Sign': params.Sign,
        'pageIndex': count,
        'pageMax': params.pageMax
      }).then(function (res) {
        $scope.myfavorite = $scope.myfavorite.concat(res.response.data);
        if ($scope.myfavorite.length < count * pageMax && count > 0) {
          $scope.uppageshow = false;
          $scope.bottomtext = '没有更多!'
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };
    $scope.goStudy = function (courseId, state) {
      $state.go('coursedetail', {courseId: courseId, state: state});
    };
    //我的收藏
    function getMyfavorite() {
      getMyFavorite.getModel(params).then(function (res) {
        $scope.uppageshow = true;
        $scope.myfavorite = res.response.data;
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
