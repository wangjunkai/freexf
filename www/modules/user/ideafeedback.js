'use strict';
angular.module('freexf')
  .controller('ideafeedback_ctrl', function ($scope, $timeout, $ionicLoading, $exceptionHandler, ENV, feedBack) {
    var FeedBack = feedBack(ENV._api.__feedback);

    function ideafeedbackModel() {
      this.idea = {
        as_mobile: '',
        as_feedtype: '意见反馈',
        as_content: ''
      };
      return this.idea;
    }
    $scope.idea = new ideafeedbackModel();
    $scope.$on('$ionicView.loaded', function () {});
    $scope.submitidea = function () {
      var idea = $scope.idea;
      FeedBack.getModel(idea).then(function (res) {
        console.log(res.response.data);
      })
    };
  });
