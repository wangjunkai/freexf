'use strict';

angular.module('freexf')
  .controller('course_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, ENV, GetCategoryRepository) {
      //��ȡһ��������˵�
      var GetCategory = GetCategoryRepository(ENV._api.__GetCategory);
      GetCategory.getModel().then(function (res) {
          $scope.Category1 = res.response.data[0]['ls_Category'];    //һ������
          $scope.Category2 = res.response.data[0]['ls_lingualList'];    //��������
      });
      //�����ת���γ��б�ҳ�����ݲ���
      $scope.goCourseList = function (category1, category2) {
          $state.go('courseplate', { Category1: category1, Category2: category2 });
      };
      /** 
      * <pre> 
      * @param arr 
      * @returns {Array} ���arr�е�Ԫ�ش��ڿ��ַ���''����ȥ���ÿ��ַ��� 
      * </pre> 
      */
      function skipEmptyElementForArray(arr) {
          var a = [];
          $.each(arr, function (i, v) {
              var data = $.trim(v);//$.trim()��������jQuery  
              if ('' != data) {
                  a.push(data);
              }
          });
          return a;
      }
  });
