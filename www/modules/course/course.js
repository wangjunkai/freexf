'use strict';

angular.module('freexf')
  .controller('course_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, ENV, GetCategoryRepository) {
      //获取一二级分类菜单
      var GetCategory = GetCategoryRepository(ENV._api.__GetCategory);
      GetCategory.getModel().then(function (res) {
          $scope.Category1 = res.response.data[0]['ls_Category'];    //一级分类
          $scope.Category2 = res.response.data[0]['ls_lingualList'];    //二级分类
      });
      //点击跳转至课程列表页并传递参数
      $scope.goCourseList = function (category1, category2) {
          $state.go('courseplate', { Category1: category1, Category2: category2 });
      };
      /** 
      * <pre> 
      * @param arr 
      * @returns {Array} 如果arr中的元素存在空字符串''，则去掉该空字符串 
      * </pre> 
      */
      function skipEmptyElementForArray(arr) {
          var a = [];
          $.each(arr, function (i, v) {
              var data = $.trim(v);//$.trim()函数来自jQuery  
              if ('' != data) {
                  a.push(data);
              }
          });
          return a;
      }
  });
