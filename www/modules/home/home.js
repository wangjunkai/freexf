'use strict';


angular.module('freexf')
  .directive('anchorTab', ['$location', '$ionicScrollDelegate', function ($location, $ionicScrollDelegate) {
    return {
      restrict: 'A',
      scope: {
        target: "@anchorTab",
        delegate: "@",
        animate: "@"
      },
      controller: function ($scope, $element, $attrs) {
        var shouldAnimate = $scope.animate;
        $scope.scrollTo = function () {
          $location.hash($scope.target);
          var handle = $ionicScrollDelegate.$getByHandle($scope.delegate);
          handle.anchorScroll(shouldAnimate);
        };
        $element.bind("click", function (e) {
          e.preventDefault();
          $scope.scrollTo();
        });
      }
    };
  }])
  .directive('myScroll', ['$location', '$ionicScrollDelegate', function ($location, $ionicScrollDelegate) {
    return {
      restrict: 'A',
      scope: true,
      controller: function ($scope, $element, $attrs) {
        var content = $($element).find('ion-content')[0];
        var anchors = $($element).find('[id^="anchor-section"]');
        var anchor_tab = $($element).find('#anchor-tab')[0];
        var scroll_tab = $(anchor_tab).find('ion-scroll');
        var scroll_tab_a_width = $(anchor_tab).find('a:first-child').outerWidth();
        $(scroll_tab).bind('toLeft', function (e, x) {
          e.preventDefault();
          $ionicScrollDelegate.$getByHandle('anchor').scrollTo(x, 0, true);
        });
        $(content).bind('scroll', function (e) {
          e.preventDefault();
          $(anchors).each(function (index, anchor) {
            var top = $(anchor).offset().top;
            if (top <= 70 && top > 0) {
              anchor_tab.className = anchor_tab.className.replace($(anchor_tab).attr('class').match(/anchor-section-\w+/), '');
              $(anchor_tab).addClass(anchor.id);
              var number = $(anchor_tab).find('[anchor-tab^=' + anchor.id + ']').prevAll().length;
              $(scroll_tab).trigger('toLeft', [scroll_tab_a_width * number]);
            }
          });
        })
      }
    }
  }])
  .controller('home_ctrl', function ($scope, $rootScope, $anchorScroll, $ionicScrollDelegate, $location, $injector, $ionicLoading, $timeout, Home) {
    //$scope.home = Home.home.query({id:'1'});
    //$scope.username = (new Home.user()).getName();
    $scope.obj = [
      {}, {}, {}, {}
    ];
//  require(['modules/index/index_ctrl'], function (shouye_ctrl) {
//    $injector.invoke(shouye_ctrl, this, {'$scope': $scope});
//  });
  })
  .controller('index_ctrl2', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, Home) {
    //$scope.home = Home.home.query({id:'1'});
    //$scope.username = (new Home.user()).getName();
  })
  .controller('index_daohang_ctrl', function ($scope) {

  });

