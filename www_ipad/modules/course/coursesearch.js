'use strict';
define(function () {
  angular.module('freexf')
    .controller('coursesearch_ctrl', function ($scope, $rootScope, $location, $state,$frModal) {

      $scope.searchString = {
        value: ''
      };
      $scope.hotList = ['雅思', '托福', '新SAT', 'GRE', '日语', '韩语', '俄语', '法语', '出国留学', '高考', '中考', '小升初', '知识点精讲', '奥数', '会计初级', '摄影'];
      //清空input值
      $scope.ClearAll = function () {
        $scope.searchString.value = '';
      };
      //点击搜索按钮事件
      $scope.getResult = function (str) {
        $scope.searchString.value = str;
        href();
      };
      $scope.enterResult = function (e) {
        var keyCode = e.which || e.keyCode;
        keyCode === 13 && href();
      };
      function href() {
        $scope.$modal._hide();
        $state.transitionTo('searchresult', {q: $scope.searchString.value});
      }
    })
});
