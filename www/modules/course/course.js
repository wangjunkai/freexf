'use strict';

angular.module('freexf')
  .controller('course_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, ENV, DispatchRepository) {
      //var GetCategory = GetCategoryRepository(ENV._api.__GetCategory);
      var GetCategory = DispatchRepository(ENV._api.__Dispatch, '/Entrace');
      GetCategory.getModel({
          "FunctionName": 'Category.GetCategory',
          "Version": 1,
          "EndClientType": 'H5',
          "JsonPara": {}
      }).then(function (res) {
          var data = res.response.data;
          $scope.ls_Category = data && data['ls_Category'];
          delete data['ls_Category'];
          $scope.ls_Second = data;
          //$scope.Category2 = res.response.data[0]['ls_lingualList'];
      });

      //GetCategory.getModel().then(function (res) {
      //    $scope.Category1 = res.response.data[0]['ls_Category'];   
      //    $scope.Category2 = res.response.data[0]['ls_lingualList'];  
      //});
      $scope.goCourseList = function (category1, category2) {
          if (category2 && category2.indexOf("freexfpree=") > -1) {
              $state.go(category2.split(" freexfpree=")[1]);
          } else {
              $state.go('courseplate', { Category1: category1, Category2: category2 });
          }          
      };
  })
.filter('cutSummer', function () {
    return function (item) {
        return item.indexOf(" freexfpree=") > -1 ? item.split(" freexfpree=")[0] : item;          
    }
})
.filter('formatname', function () {
    return function (item) {
        return item.length > 0 ? item : ["全部"];
    }
});

