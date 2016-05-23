;(function () {
  define([
    'ionic',
    'oclazyload',
    'restAngular'
  ], function (ionic) {
    angular.module('freexf', [
        'ionic',
        'oc.lazyLoad',
        'restangular'
      ])
      .constant('XHR', 0)
      .constant('AUTH', {
        ISLOGIN: ['login', 'myaccount'],
        NOTLOGIN: ['tab.member']
      })
      //<ion-spinner icon="bubbles">加载中...</ion-spinner>
      //<div class="tab-item"><i class="icon ion-gear-a"></i>Settings</div>
      .constant('$ionicLoadingConfig', {
        template: '<ion-spinner icon="bubbles"></ion-spinner><div class="font">加载中...</div>',
        noBackdrop: false
      })
      .filter('decodeUri', function ($window) {
        return $window.decodeURIComponent;
      })
      .run(['$rootScope', '$state', '$ionicLoading', '$anchorScroll', '$timeout', '$location', 'AUTH', 'XHR',
        function ($rootScope, $state, $ionicLoading, $anchorScroll, $timeout, $location, AUTH, XHR) {
          $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
            $ionicLoading.show();
            if (!$rootScope.user && $.inArray(to.name, AUTH.NOTLOGIN) >= 0) {
              ev.preventDefault();
              $state.go('myaccount');
              return;
            }
            else if ($rootScope.user && $.inArray(to.name, AUTH.ISLOGIN) >= 0) {
              event.preventDefault();
              $state.go('tab.member');
              return;
            }
          });
          $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
          });
          $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

            // $timeout(function () {
            //   $ionicLoading.hide();
            // }, 0);
          });
          $rootScope.$on('$stateChangeError', function () {
            debugger
          });

          $rootScope.$on('$ionicView.beforeEnter', function () {
          });
          $rootScope.$on('$ionicView.enter', function () {
            !!$rootScope.xhr || $ionicLoading.hide();
          });
          $rootScope.$on('$ionicView.afterEnter', function () {
          });

        }])
      .config(function ($provide, $stateProvider, $locationProvider, $urlRouterProvider, $ionicConfigProvider) {

        /*------------ionic 默认配置--------------------------------*/
        //修改默认后退键样式
        $ionicConfigProvider.backButton.text('').previousTitleText(false).icon('freexf-goback');
        $ionicConfigProvider.templates.maxPrefetch(0);
        //修改默认tabs位置 ios默认（top）,andriod默认为（bottom）
        $ionicConfigProvider.tabs.position('bottom');
        //修改title位置 ios默认（center）,andriod默认为（left）
        $ionicConfigProvider.navBar.alignTitle('center');

        /*-------------ui-router 配置-----------------------------*/
        $locationProvider.html5Mode(false);
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

          .state('set', {
            url: '/set',
            templateUrl: 'modules/user/set.html',
            controller: 'set_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/set.js']);
              }]
            }
          })
          .state('aboutus', {
            url: '/aboutus',
            templateUrl: 'modules/user/aboutus.html',
            controller: ''

          })
          .state('commonfaq', {
            url: '/commonfaq',
            templateUrl: 'modules/user/commonfaq.html',
            controller: ''
          })
          .state('ideafeedback', {
            url: '/ideafeedback',
            templateUrl: 'modules/user/ideafeedback.html',
            controller: ''
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
          .state('mycollection', {
            url: '/mycollection',
            templateUrl: 'modules/user/mycollection.html',
            controller: 'mycollection_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/mycollection.js']);
              }]
            }
          })
          .state('courseplate', {
            url: '/courseplate',
            views: {
              '': {
                templateUrl: 'modules/course/courseplate.html'
              },
              'classmodule@courseplate': {
                templateUrl: 'modules/course/classmodule.html'
              }
            },
            controller: 'courseplate_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/course/courseplate.js']);
              }]
            }
          })
          .state('coursesearch', {
            url: '/coursesearch',
            templateUrl: 'modules/course/coursesearch.html',
            controller: 'coursesearch_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/course/coursesearch.js']);
              }]
            }
          })
          .state('coursedetail', {
            url: '/coursedetail',
            views: {
              '': {
                templateUrl: 'modules/course/coursedetail.html'
              },
              'toptabs@coursedetail': {
                templateUrl: 'modules/course/toptabs.html'
              },
              'main@coursedetail': {
                templateUrl: 'modules/course/coursedetailmodule.html'
              }
            },
            controller: 'coursedetail_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/course/coursedetail.js']);
              }]
            }
          })
          .state('coursedetail.courseoutline', {
            url: '/courseoutline',
            views: {
              'main@coursedetail': {
                templateUrl: 'modules/course/coursedetailoutline.html'
              }
            },
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
                return $ocLazyLoad.load(['modules/home/home.js']);
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
                return $ocLazyLoad.load(['modules/course/course.js']);
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
})();
