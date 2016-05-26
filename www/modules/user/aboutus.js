'use strict';
angular.module('freexf')
  .controller('aboutus_ctrl', function ($scope, $timeout, $ionicLoading, $exceptionHandler, ENV, feedBack) {
    var FeedBack = feedBack(ENV._api.__aboutus);

    function ideafeedbackModel() {
      this.idea = {
        as_mobile: '',
        as_feedtype: '',
        as_content: ''
      };
      return this.idea;
    }

    $scope.idea = new ideafeedbackModel();
    $scope.$on('$ionicView.loaded', function () {
    });
    $scope.submitidea = function () {
      var idea = $scope.idea;
      FeedBack.create(idea).then(function (res) {
        $scope.idea = new ideafeedbackModel();
        console.log(res.response.data);
      })
    };
  });
