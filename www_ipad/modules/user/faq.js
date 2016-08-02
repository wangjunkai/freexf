'use strict';

define(function () {
  angular.module('freexf')
    .controller('faq_ctrl', function ($scope, $timeout, $sce, $ionicLoading, $exceptionHandler, ENV, MobileFaq) {
      var Faq = MobileFaq(ENV._api.__faq);

      Faq.getModel({ 'as_UUROWID': 'VHP<1%>EX;^3}/;MY8@){-' }).then(function (res) {
        $scope.aboutus = $sce.trustAsHtml(res.response.data.replace(/\r\n/ig, '<br>'));
      });
      $scope.getAboutus = function () {
        return $scope.aboutus;
      }
    })
});
