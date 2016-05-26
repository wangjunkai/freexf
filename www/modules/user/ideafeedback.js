'use strict';
angular.module('freexf')
  .controller('ideafeedback_ctrl', function ($scope, $timeout, $ionicLoading, $exceptionHandler, ENV, feedBack) {
    var FeedBack = feedBack(ENV._api.__feedback);

    function ideafeedbackModel() {
      this.idea = {
        as_mobile: '',
        as_feedtype: '111',
        as_content: ''
      };
      return this.idea;
    }

    $scope.idea = new ideafeedbackModel();
    $scope.$on('$ionicView.loaded', function () {
    });
    $scope.submitidea = function () {
      var idea = $scope.idea;
      console.log(idea);
      FeedBack.create(idea).then(function (res) {
      //FeedBack.all("feedback?as_mobile=''&as_feedtype=''&as_content=''").post(idea).then(function (res) {
        $scope.idea = new ideafeedbackModel();
        console.log(res.response.data);
      })
    };
  });
