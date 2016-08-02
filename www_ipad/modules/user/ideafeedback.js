'use strict';
define(function () {
  angular.module('freexf')
    .controller('ideafeedback_ctrl',

      function ($scope, $timeout, $ionicLoading, $state, $Loading, $exceptionHandler, MSGICON, ENV, feedBack) {
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
        $scope.$on('$ionicView.loaded', function () {
        });
        $scope.submitidea = function () {
          var idea = $scope.idea;
          FeedBack.getModel(idea).then(function (res) {
            var data = res.response.data;
            $Loading.show({class: data ? MSGICON.success : MSGICON.fail, text: data ? '提交成功!' : '提交失败!'}, 1500);
            if (res.response.data) {
              $timeout(function () {
                $state.go('set');
                $scope.idea.as_content = '';
                $scope.idea.as_mobile = '';
              }, 1000)


            }
          })
        };
      }
    )
});
