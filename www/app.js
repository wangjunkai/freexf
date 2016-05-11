//开始分配路由

define([
  'ionic',
  'oclazyload',
  'angularResource'
], function (ionic) {

  angular.module('freexf', [
      'ionic',
      'oc.lazyLoad',
      'ngResource'
    ])
    .run(['$rootScope', '$ionicLoading', '$anchorScroll', '$timeout', '$location',
      function ($rootScope, $ionicLoading, $anchorScroll, $timeout, $location) {
        $rootScope.$on('$stateChangeStart', function () {
          $ionicLoading.show();
        });
        $rootScope.$on('$stateChangeSuccess', function () {
          $timeout(function () {
            $ionicLoading.hide();
          }, 0);
        });
      }])
    .constant('ENV', {
      'api': 'http://www.freexf.com'
    })
    .constant('$ionicLoadingConfig', {
      template: '<ion-spinner icon="bubbles"></ion-spinner>',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    })
    .controller('headername', function ($scope, $rootScope) {
      $rootScope.hname = '学费全免网';
      $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
          $rootScope.leftbutton = $('#headerButtonc').attr('lb') == 'true';
          $rootScope.rightbutton = $('#headerButtonc').attr('rb') == 'true';

        })
    })
    .config(function ($stateProvider, $locationProvider,$urlRouterProvider, $ionicConfigProvider) {

      $locationProvider.html5Mode(false);
      $ionicConfigProvider.templates.maxPrefetch(0);
      //修改默认tabs位置 ios默认（top）,andriod默认为（bottom）
      $ionicConfigProvider.tabs.position('bottom');
      //修改title位置 ios默认（center）,andriod默认为（left）
      $ionicConfigProvider.navBar.alignTitle('center');

      $urlRouterProvider.otherwise('/home');

      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'modules/user/login.html',
          controller: 'login_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/user/login.js']);
            }]
          }
        })
        .state('register', {
          url: '/register',
          templateUrl: 'modules/user/register.html',
          controller: 'register_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/user/register.js']);
            }]
          }
        })
        .state('coursedetail', {
          url: '/coursedetail',
          templateUrl: 'modules/course/coursedetail.html',
          controller: 'coursedetail_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/course/coursedetail.js']);
            }]
          }
        });

      $stateProvider
        .state('tab', {
          abstract: true,
          templateUrl: 'modules/pubilc/tabs.html'
        })
        .state('tab.home', {
          url: '/home',
          views: {
            'conent': {
              templateUrl: 'modules/home/home.html',
              controller: 'home_ctrl'
            }
          },
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/home/home.js', 'js/index_services.js']);
            }]
          }
        })
        .state('tab.course', {
          url: '/course',
          views: {
            'conent': {
              templateUrl: 'modules/course/course.html',
              controller: 'course_ctrl'
            }
          },
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load('modules/course/course.js');
            }]
          }
        })
        .state('tab.member', {
          url: '/member',
          views: {
            'conent': {
              templateUrl: 'modules/member/member.html',
              controller: 'member_ctrl'
            }
          },
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load('modules/member/member.js');
            }]
          }
        })
    });
});

////路由html，js通用模块
//var urlJs=function(asurl,jsurl){
//    if(typeof (jsurl)=='undefined'){
//        var thouzhui='.'+asurl.split('.')[asurl.split('.').length-1];
//        var thejsurl=asurl.split(thouzhui)[0];
//    }else {
//        var thejsurl=jsurl
//    }
//    require([thejsurl])
//    return asurl;
//};

