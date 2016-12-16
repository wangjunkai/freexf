;(function () {
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
          var isa = !ionic.Platform.isAndroid();
          $scope.scrollTo = function () {
            $location.hash($scope.target);
            var handle = $ionicScrollDelegate.$getByHandle($scope.delegate);
            handle.anchorScroll(isa);
            handle.scrollBy(0, -22, isa);
          };
          $element.bind("click", function (e) {
            e.preventDefault();
            $scope.scrollTo();
          });
        }
      };
    }])
    .directive('scrollWatchTab', ['$location', '$ionicScrollDelegate', function ($location, $ionicScrollDelegate) {
      return function ($scope, $element, $attrs) {
        var content = $($element).find('ion-content')[0];
        var anchors = $($element).find('[id^="anchor-section"]');
        var anchor_tab = $($element).find('#anchor-tab')[0];
        var scroll_tab = $(anchor_tab).find('#ion-scroll');
        var scroll_tab_a_width = $(anchor_tab).find('a:first-child').outerWidth();
        var anchor_tab_height = $(anchor_tab).outerHeight();
        var header_height = 44;
        var header_sub_height = header_height + anchor_tab_height;
        //顶部tab左右滚动以及样式
        $(scroll_tab).bind('toLeft', function (e, id) {
          e.preventDefault();
          anchor_tab.className = anchor_tab.className.replace($(anchor_tab).attr('class').match(/anchor-section-\w+/), '');
          $(anchor_tab).addClass(id);
          //var number = $(anchor_tab).find('[anchor-tab^=' + id + ']').prevAll().length;
          //$ionicScrollDelegate.$getByHandle('anchor').scrollTo(scroll_tab_a_width * number, 0, true);
        });
        $(content).bind('scroll', function (e) {
          e.preventDefault();
          $(anchors).each(function (index, anchor) {
            var top = $(anchor).offset().top;
            if (index == 0 && top <= header_sub_height) {
              $(anchor_tab).css('top', 44)
            }
            else if (index == 0 && top > header_sub_height) {
              $(anchor_tab).css('top', -anchor_tab_height)
            }
            if (top <= header_sub_height && top > 0) {
              $(scroll_tab).trigger('toLeft', [anchor.id]);
            }
          });
        })
      }
    }])

    .controller('home_ctrl', function ($scope, $rootScope, $timeout, $ionicLoading, $exceptionHandler, $ionicPopup, $state, $ionicSlideBoxDelegate, AUTH, ENV, HomeRepository) {
        $scope.close = function () {
            $rootScope.isShow = false;
        }
        //下载学费全免网app
        $scope.downFun=function() { 
            $('#iosss').html('a');
            //navigator.userAgent.match(/ (iPhone|iPod|webOS|Android)/i)
            if (/(Android)/i.test(navigator.userAgent)) {
                location.href = "http://www.freexf.com/toapp";
            } else{
                location.href = "https://itunes.apple.com/cn/app/xue-fei-quan-mian-wang/id1159197730?l=zh&ls=1&mt=8";
            }
        }
      var Home = HomeRepository(ENV._api.__GetIndexGather);
      $scope.$on('$ionicView.loaded', function () {
      });

      $scope.au = AUTH;
      $scope.getTime = function () {
        return new Date().getTime();
      };
      //{'eliteNum': 3, 'recNum': 4}
      Home.getModel().then(function (res) {
        $scope.home = res.response.data;
        $ionicSlideBoxDelegate.update();
      });

      $scope.goCourseList = function (category1) {
        $state.go('courseplate', {Category1: category1});
      }
      $scope.goDetail = function (id) {
        $state.go('coursedetail', {courseId: id});
      }
      $scope.aboutUs = function () {
          var aboutPopup = $ionicPopup.confirm({
              title: '',
              cssClass: 'videoBox',
              template: '<video id="aboutVideo" style="width:100%;position:relative;z-index:10;" controls="controls" autoplay="autoplay" ><source id="vpmp4" src="http://css.freexf.com/banner%2F%E5%AD%A6%E8%B4%B9%E5%85%A8%E5%85%8D%E7%BD%91%E7%9F%AD%E4%BB%8B%E7%BB%8D.mp4" type="video/mp4"></video>',
              scope: $scope,
              buttons: [
               {
                   text: "",
                   onTap: function (e) {

                   }
               }]
          });
      }

    })
    .controller('index_daohang_ctrl', function ($scope) {
      //  require(['modules/index/index_ctrl'], function (shouye_ctrl) {
      //    $injector.invoke(shouye_ctrl, this, {'$scope': $scope});
      //  });
    })

})();
