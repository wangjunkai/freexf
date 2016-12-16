'use strict';

angular.module('freexf')
  .controller('oneBuy_ctrl', function ($scope, $rootScope, $injector, $location, $state, $ionicPopup, $ionicLoading, AUTH, ENV, DispatchRepository) {
      var pageIndex = 0;
      var pageMax = 6;
      var DisPatchList = DispatchRepository(ENV._api.__Dispatch, '/Entrace');
      $scope.uppageshow = false;

      function getCourseList(pageIndex) {
          DisPatchList.getModel({
              "FunctionName": 'Student.GetArmbCourseList',
              "Version": 1,
              "EndClientType": 'H5',
              "JsonPara": {PageIndex: pageIndex, PageMax: pageMax}
          }).then(function (res) {
              if (pageIndex == 0) {
                  $scope.DisPatchList = res.response.data;
                  $('.onebuy-ajax-box').hide();
                  $scope.uppageshow = true;
              }
              else {
                  $scope.DisPatchList = $scope.DisPatchList.concat(res.response.data);
                  if ($scope.DisPatchList.length < pageIndex * pageMax && pageIndex > 0) {
                      $scope.uppageshow = false;
                      $scope.bottomtext = '没有更多!'
                  }
                  $scope.$broadcast('scroll.infiniteScrollComplete');
              }
          });
      }

      getCourseList(pageIndex);

      $scope.doRefresh = function(){
          pageIndex++;
          getCourseList(pageIndex);
      }

      $scope.toCourseDetail = function (courseId) {
          $state.go('coursedetail', { courseId: courseId, oneBuy: 'oneBuy' });

      };
})
