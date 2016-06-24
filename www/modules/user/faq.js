'use strict';

angular.module('freexf')
  .controller('faq_ctrl', function ($scope, $timeout, $sce, $ionicLoading, $exceptionHandler, ENV, MobileFaq) {
    var Faq = MobileFaq(ENV._api.__faq);
    $scope.$on('$ionicView.loaded', function () {
    });
    Faq.getModel().then(function (res) {
      $scope.aboutus = $sce.trustAsHtml(res.response.data.replace(/\r\n/ig, '<br>'));
    })
  });
