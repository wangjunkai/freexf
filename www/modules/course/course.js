'use strict';

angular.module('freexf')
  .controller('course_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, ENV, GetCategoryRepository) {
      var GetCategory = GetCategoryRepository(ENV._api.__GetCategory);
      GetCategory.getModel().then(function (res) {
          $scope.Category1 = res.response.data[0]['ls_Category'];   
          $scope.Category2 = res.response.data[0]['ls_lingualList'];  
      });
      $scope.goCourseList = function (category1, category2) {
          console.log(category2);
          $state.go('courseplate', { Category1: category1, Category2: category2 });
      };
  });
