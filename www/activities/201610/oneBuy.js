'use strict';

angular.module('freexf')
  .controller('oneBuy_ctrl', function ($scope, $rootScope, $injector, $location, $state, $ToDetailState, $ionicPopup, $ionicLoading, AUTH, ENV, DispatchRepository) {
      var DisPatchList = DispatchRepository(ENV._api.__Dispatch, '/Entrace');
      DisPatchList.getModel({
          "FunctionName": 'LuckyDraw.GetCourselist',
          "Version": 1,
          "EndClientType": 'H5',
          "JsonPara": {}
      }).then(function (res) {
          $scope.DisPatchList = res.response.data;
          //console.log($('#price').length)
          //$('#price').width($(this).height());
      });

      $scope.toCourseDetail = function (courseId) {
          $state.go('coursedetail', { courseId: courseId });
      };
})