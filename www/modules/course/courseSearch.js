'use strict';

angular.module('freexf')
    .filter('searchFor', function () {

        // All filters must return a function. The first parameter
        // is the data that is to be filtered, and the second is an
        // argument that may be passed with a colon (searchFor:searchString)

        return function (arr, searchString) {

            if (!searchString) {
                return arr;
            }
            var result = [];
            searchString = searchString.toLowerCase();

            // Using the forEach helper method to loop through the array
            angular.forEach(arr, function (item) {

                if (item.ProductName.toLowerCase().indexOf(searchString) !== -1) {
                    result.push(item);
                }

            });

            return result;
        };

    })
  .controller('coursesearch_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, ENV, SearchCourse) {
      $scope.SearchNull = false;
      $scope.ClearAll = function () {
          $scope.searchString = null;
      };
      //û�����ؿγ�ʱС¹ͷ�����
      //if ($scope.CourseListShow == null) {
      //    $scope.SearchNull = true;
      //} else {
      //    $scope.SearchNull = false;
      //}
      var searchCourse = SearchCourse(ENV._api.__searchcourse);

      $scope.$on('$ionicView.loaded', function () {

      });
      searchCourse.getModel({ "seekKey": "", "orderBy": "xuefen", "order": "desc", "pageIndex": '0', "pageMax": '2' }).then(function (res) {
          $scope.courseList = res.response.data;

      });

  });

