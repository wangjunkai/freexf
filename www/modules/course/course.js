'use strict';

angular.module('freexf')
  .controller('course_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, ENV, NewGetCategoryRepository) {
      //var GetCategory = GetCategoryRepository(ENV._api.__GetCategory);
      var GetCategory = NewGetCategoryRepository(ENV._api.__GetCategory_v01);
      GetCategory.getModel().then(function (res) {
          $scope.Category1 = res.response.data[0]['ls_Category'];   
          $scope.Category2 = res.response.data[0]['ls_lingualList'];  
      });
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
});
