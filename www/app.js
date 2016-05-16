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
    .config(function ($stateProvider, $locationProvider, $urlRouterProvider, $ionicConfigProvider) {

      $locationProvider.html5Mode(false);
      //修改默认后退键样式
      $ionicConfigProvider.backButton.text('').previousTitleText(false).icon('freexf-goback');
      $ionicConfigProvider.templates.maxPrefetch(0);
      //修改默认tabs位置 ios默认（top）,andriod默认为（bottom）
      $ionicConfigProvider.tabs.style('standard').position('bottom');
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
        .state('modifypassword', {
          url: '/modifypassword',
          templateUrl: 'modules/user/modifypassword.html',
          controller: 'modifypassword_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/user/modifypassword.js']);
            }]
          }
        })
        .state('forgetpassword', {
          url: '/forgetpassword',
          templateUrl: 'modules/user/forgetpassword.html',
          controller: 'forgetpassword_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/user/forgetpassword.js']);
            }]
          }
        })
        .state('pay', {
          url: '/pay',
          templateUrl: 'modules/pay/pay.html',
          controller: 'pay_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/pay/pay.js']);
            }]
          }
        })
        .state('paysuccess', {
          url: '/paysuccess',
          templateUrl: 'modules/pay/paysuccess.html',
          controller: 'paysuccess_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/pay/paysuccess.js']);
            }]
          }
        })
        .state('payfail', {
          url: '/payfail',
          templateUrl: 'modules/pay/payfail.html',
          controller: 'payfail_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/pay/payfail.js']);
            }]
          }
        })
        .state('myaccount', {
          url: '/myaccount',
          templateUrl: 'modules/user/myaccount.html',
          controller: 'myaccount_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/user/myaccount.js']);
            }]
          }
        })

        .state('myorder', {
          url: '/myorder',
          templateUrl: 'modules/user/myorder.html',
          controller: 'myorder_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/user/myorder.js']);
            }]
          }
        })
        .state('mycourse', {
          url: '/mycourse',
          templateUrl: 'modules/user/mycourse.html',
          controller: 'mycourse_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/user/mycourse.js']);
  				}]
          }
        })
        .state('courseCenter', {
          url: '/courseCenter',
          templateUrl: 'modules/course/courseCenter.html',
          controller: 'courseCenter_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/course/courseCenter.js']);
            }]
          }
        })

        .state('courselist', {
          url: '/courselist',
          templateUrl: 'modules/course/courselist.html',
          controller: 'courselist_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/course/courselist.js']);
            }]
          }
        })
				.state('coursePlate', {
          url: '/coursePlate',
          templateUrl: 'modules/course/coursePlate.html',
          controller: 'coursePlate_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/course/coursePlate.js']);
            }]
          }
        })
				.state('courseSearch', {
          url: '/courseSearch',
          templateUrl: 'modules/course/courseSearch.html',
          controller: 'courseSearch_ctrl',
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load(['modules/course/courseSearch.js']);
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
              templateUrl: 'modules/student/member.html',
              controller: 'member_ctrl'
            }
          },
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load('modules/student/member.js');
            }]
          }
        })
    });
   
});
