;(function () {
  define([
    'ionic',
    'oclazyload',
    'imglazyload',
    'restAngular',
    'angularSanitize',
    'localStorage'
  ], function (ionic) {
    var app = angular.module('freexf', [
      'ionic',
      'oc.lazyLoad',
      'ngSanitize',
      'ionicLazyLoad',
      'restangular',
      'LocalStorageModule'
    ]);

    app.constant('MSGICON', {
      success: 'ion-checkmark-round',
      fail: 'ion-alert-circled',
      load: 'ion-load-a'
    })
      .constant('XHR', 0)
      .constant('AUTH', {
        ISLOGIN: ['login', 'myaccount'],
        NOTLOGIN: ['mycourse', 'myorder', 'mycollection']
      })
      //ionic loading 全局配置服务
      .constant('$ionicLoadingConfig', {
        template: '<ion-spinner icon="bubbles"></ion-spinner><div class="font">加载中...</div>',
        noBackdrop: false
      })

      //decodeUri filter
      .filter('decodeUri', function ($window) {
        return $window.decodeURIComponent;
      })
      .filter('xufen', function () {
        return function (item, num) {
          if (item == 0) {
            return '免费';
          } else {
            return num ? item.substr(0, num) : item;
          }
        }
      })
      .filter('xufenshow', function () {
        return function (item) {
          if (item == 0) {
            return false;
          } else {
            return true;
          }
        }
      })
      .filter('teacherPath', function () {
        return function (item, num) {
          if (item == '') {
            return 'img/course/teacher_img.png';
          } else {
            return item;
          }
        }
      })
      .filter('studyEnd', function () {
        return function (item, endClassList, buy) {
          if (buy) {
            return endClassList.indexOf(item) > -1;
          } else {
            return false;
          }

        }
      })
      .filter('cutCharptName', function () {
        return function (item) {
          var pattern = /(.*).mp4$/g;
          return pattern.test(item) ? "上次学到：" + RegExp.$1 : "您还没有学习该课程";
        }
      })
      .filter('cutSummer', function () {
        return function (item) {
          return item.indexOf(" freexfpree=") > -1 ? item.split(" freexfpree=")[0] : item;
        }
      })
      //user tabs
      .service('$userTabs', function ($rootScope) {
        var self = this;
        var tabs = [
          {index: 0, name: '我的课程', state: 'mycourse'},
          {index: 1, name: '我的订单', state: 'myorder'},
          {index: 2, name: '我的收藏', state: 'mycollection'},
          {index: 3, name: '课程推荐', state: 'myrecommend'}
        ];
        var active = 'mycourse';
        $rootScope.$on('$stateChangeStart', function (ev, state) {
          state.parent == 'myaccount' && self.toBroadCast(state.name);
        });
        this.toBroadCast = function (state) {
          for (var i = 0; i < tabs.length; i++) {
            if (state == tabs[i].state) {
              active = state;
              $rootScope.$broadcast('userTabs:active', {index: tabs[i].index, state: active});
              break;
            }
          }
        };
        this.getActive = function () {
          return active;
        };
        this.tabs = function () {
          return tabs;
        };
      })
      //用户信息服务
      .service('$freexfUser', function ($rootScope, $state, $userTabs, localStorageService, $ionicSideMenuDelegate) {
        var self = this;
        var auth = {
          Sign: null,
          rowId: null,
          rememberPw: '',
          password: '',
          phone: '',
          userLg: false
        };
        var name = 'freexfUser';
        this.setUser = function (data) {
          auth = $.extend({}, auth, data);
          $rootScope.$broadcast('auth:update', auth);
        };
        this.toQuit = function () {
          var freexfUser = {
            Sign: null,
            rowId: null,
            userLg: false
          };
          $state.go('myaccount');
          $userTabs.toBroadCast('mycourse');
          self.setUser(freexfUser);
          localStorageService.set(self.name(), self.auth());
          $ionicSideMenuDelegate.toggleLeft(false);
        };
        this.auth = function () {
          return auth;
        };
        this.name = function () {
          return name;
        };
      })
      //modal服务
      .factory('$frModal', function ($rootScope, $interval, $ionicModal, $compile, $q) {
        //用来存取每个modal的值
        var frModals = function () {
          var modals = [];
          this.currentModal = {};
          this.backModal = {};
          this.addmodals = function (modal) {
            modals.push(modal);
          };
          this.getmodals = function () {
            return modals;
          };
        };
        var root_frModals = new frModals();

        function frModal(options) {
          var self = this;
          var opt = options || {};
          var _frModals = new frModals();
          //后退按钮
          var modalGoBack = function () {
            var self = this;
            self.hide();
            _frModals.backModal.modal ? _frModals.backModal.modal._show(false, 'back') : root_frModals = new frModals();
          };
          //显示modal,记录每个modal和当前modal的历史modal  //hideback参数表示是否隐藏上一个modal
          var modalShow = function (hideback, e) {
            var self = this;
            if (self.scope.$$destroyed) {
              return;
            }
            if (hideback) {
              $(self.$el[0]).find('.modal-backdrop-bg').css('opacity', 0);
              self.show();
              return;
            }
            _frModals.backModal = e === 'back' ? _frModals.backModal : $.extend({}, root_frModals.currentModal);
            _frModals.currentModal = {
              id: self.scope.$id,
              modal: self
            };
            _frModals.addmodals(self);
            root_frModals.currentModal = $.extend({}, _frModals.currentModal);
            _frModals.backModal.modal && _frModals.backModal.modal.hide();
            _frModals.currentModal.modal.show();
          };

          var modalHide = function (e) {
            var self = this;
            self.hide();
            _frModals = new frModals();
            root_frModals = new frModals();
          };
          var modalRemove = function () {
            var self = this;
            _frModals = new frModals();
            root_frModals = new frModals();
            $rootScope['h5playtimeend'] && ($interval.cancel($rootScope['h5playtimeend']));
            self.remove();
          };
          //获取模板ctrl
          var getTemplate = function () {
            var tempDeferred = $q.defer();
            if (!opt.ctrlUrl) {
              tempDeferred.reject("controllerUrl not null!");
            } else {
              require([opt.ctrlUrl], function (ctrlObj) {
                tempDeferred.resolve(ctrlObj);
              })
            }
            return tempDeferred.promise;
          };
          var getModal = function () {
            var modalDeferred = $q.defer();
            getTemplate().then(function (ctrlObj) {
              //app.controllerProvider.register(ctrlObj.ctrl, ctrlObj.fn);
              if (!opt.tempUrl) {
                modalDeferred.reject("templateUrl not null!");
              } else {
                //获取templ
                if (opt.data) {
                  var s = opt.scope || $rootScope;
                  s['$data'] = opt.data;
                }
                $ionicModal.fromTemplateUrl(opt.tempUrl, {
                  scope: opt.scope || $rootScope,//设置scope，如果不提供为root,否则继承父级
                  animation: opt.animation || 'slide-in-up',
                  backdropClickToClose: !!opt.backdropClickToClose,
                  focusFirstInput: true
                }).then(function (modal) {
                  //绑定controller
                  //$compile($(modal.modalEl).attr("ng-controller", ctrlObj.ctrl))(modal.scope);
                  modal.scope['$modal'] = modal;
                  modal['_show'] = modalShow.bind(modal);
                  modal['_hide'] = modalHide.bind(modal);
                  modal['_back'] = modalGoBack.bind(modal);
                  modal['_remove'] = modalRemove.bind(modal);
                  modalDeferred.resolve(modal);
                });
              }
            });
            return modalDeferred.promise;
          };
          //返回promise对象
          return getModal();
        }

        //打开modal
        //scope当前作用域，modalname要打开modal 的name，modalary modal的数组，data需要传递的数据，back若为true不隐藏当前modal
        function openModal(scope, modalname, modalary, data, back) {
          modalary[modalname]['data'] = data;
          var smodal = scope[modalname + '_modal'];
          //判断是否是显示状态，当前modal作用域是否已经移除了
          if (smodal && !smodal._isShown && !smodal.scope.$$destroyed) {
            scope[modalname + '_modal']._show(back);
          } else {
            (new frModal(modalary[modalname])).then(function (modal) {
              (scope[modalname + '_modal'] = modal) && modal._show(back);
            });
          }
        }

        return {
          'modal': function (options) {
            return new frModal(options);
          },
          'modalary': new frModals(),
          'openModal': openModal
        }
      })
      //loading服务
      .factory('$Loading', function ($injector) {
        var $ionicLoading = $injector.get('$ionicLoading');
        var $timeout = $injector.get('$timeout');
        var tpl = '<div class="{{class}}"></div><div class="font">{{text}}</div>';
        var _rep = function (str, data) {
          return str.replace(/{{(\w*)}}/g, function ($1, $2) {
            return data[$2] ? data[$2] : $1;
          })
        };
        var timeout = 1500;
        return {
          //time过期时间，不写默认1500，false不过期
          show: function (obj, time) {
            if (angular.isObject(obj)) {
              obj['template'] ? $ionicLoading.show(obj) : $ionicLoading.show({template: _rep(tpl, obj)});
            }
            else {
              $ionicLoading.show();
            }
            typeof time !== 'boolean' && this.hide(time ? time : timeout);
          },
          hide: function (time) {
            time ? $timeout(function () {
              $ionicLoading.hide()
            }, time) : $ionicLoading.hide();
          }
        }
      })
      //全局错误捕捉服务
      .factory('$exceptionHandler', function ($injector) {
        return function (exception, cause) {
          var $Loading = $injector.get('$Loading');
          $Loading.show({
            template: '<div class="ion-alert-circled" style="font-size: 20px;"></div><div class="font">页面崩溃了,请刷新页面重试!</div>'
          });
          exception.message += ' (caused by "' + cause + '")';
          throw exception;
        }
      })
      //全局路由配置
      .run(['$rootScope', '$state', '$Loading', '$compile', '$timeout', '$anchorScroll', 'localStorageService', 'AUTH', '$freexfUser',
        function ($rootScope, $state, $Loading, $compile, $timeout, $anchorScroll, localStorageService, AUTH, $freexfUser) {
          //用户本地信息
          var local = localStorageService.get($freexfUser.name());
          $freexfUser.setUser(local ? local : $freexfUser.auth());

          $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
            if (!$freexfUser.auth().userLg && $.inArray(to.name, AUTH.NOTLOGIN) >= 0) {
              ev.preventDefault();
              $state.go('myaccount');
            }
            /*else if (AUTH.FREEXFUSER.data.userLg && $.inArray(to.name, AUTH.ISLOGIN) >= 0) {
             ev.preventDefault();
             $state.go('member');
             }*/
          });
          $rootScope.$on('$viewContentLoading', function (event, viewConfig) {

          });
          $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
            !!$rootScope.xhr || $Loading.hide();
          });
          $rootScope.$on('$stateChangeError', function () {
            ev.preventDefault();
            $state.go('home');
          });
          //根据作用域id取得当前作用域dom
          var _con = function (fn, vf, load) {
            vf.isLoading = load;
            $('ion-content').each(function (e, dom) {
              if ($(dom).closest('modal').length <= 0) {
                var view = angular.element($(dom).closest('ion-view'));
                vf && view.length > 0 && vf.$id == view.scope().$id && fn(e, dom);
              }
            });
          };
          $rootScope.$on('$ionicView.beforeEnter', function (event, viewConfig) {
            _con.call(this, function (e, dom) {
              $(dom).siblings('#content-loading').length > 0 || $(dom).after(
                $compile('<div id="content-loading" class="freexf-pane-loading" ng-show="isLoading" scroll="false">' +
                  '<div class="font content-loading">加载中...</div>' +
                  '</div>')(event.targetScope)
              );
              $(dom).removeAttr('style');
            }, event.targetScope, true);
          });

          $rootScope.$on('$ionicView.enter', function (event, viewConfig) {
          });

          $rootScope.$on('$ionicView.afterEnter', function (event, viewConfig) {
            $timeout(function () {
              _con.call(this, function (e, dom) {
                $(dom).css({'opacity': 1, 'transform': 'translate3d(0px, -1px, 0px)'});
              }, event.targetScope, false);
            }, viewConfig.direction == 'none' ? 200 : 0);
          });
        }])
      .config(function ($provide, $stateProvider, $controllerProvider, $filterProvider, $locationProvider, $urlRouterProvider, $ionicConfigProvider, $urlMatcherFactoryProvider) {

        /*------------ionic 默认配置--------------------------------*/
        //修改默认后退键样式
        $ionicConfigProvider.backButton.text('').previousTitleText(false).icon('freexf-goback');
        $ionicConfigProvider.views.transition('android');
        //预下载模板的数量
        $ionicConfigProvider.templates.maxPrefetch(0);
        $ionicConfigProvider.views.forwardCache(true);
        $ionicConfigProvider.views.maxCache(10);
        //修改默认tabs位置 ios默认（top）,andriod默认为（bottom）
        $ionicConfigProvider.tabs.position('bottom');
        //修改title位置 ios默认（center）,andriod默认为（left）
        $ionicConfigProvider.navBar.alignTitle('center');

        app.controller = $controllerProvider.register;
        /*-------------ui-router 配置-----------------------------*/
        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise('/home');
        $stateProvider
          .state('forgetpassword', {
            url: '/forgetpassword',
            templateUrl: 'modules/user/forgetpassword.html',
            controller: 'forgetpassword_ctrl',
            cache: false,
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
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/pay/pay.js']);
              }]
            }
          })
          .state('payaddress', {
            url: '/payaddress/:OrderId',
            templateUrl: 'modules/pay/payaddress.html',
            controller: 'payaddress_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/pay/payaddress.js']);
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
          .state('courseplate', {
            url: '/courseplate/:Category1&:Category2',
            views: {
              '': {
                controller: 'courseplate_ctrl',
                templateUrl: 'modules/course/courseplate.html'
              },
              'classmodule@courseplate': {
                //controller: 'courseplate_ctrl',
                templateUrl: 'modules/course/classmodule.html'
              }
            },
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/course/courseplate.js']);
              }]
            }
          })
          .state('searchresult', {
            url: '/searchresult?q',
            views: {
              '': {
                templateUrl: 'modules/course/searchresult.html',
                controller: 'searchresult_ctrl'
              },
              'classmodule@searchresult': {
                //controller: 'coursesearch_ctrl',
                templateUrl: 'modules/course/classmodule.html'
              }
            },
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/course/searchresult.js']);
              }]
            }
          })
          .state('abroad', {
            url: '/abroad',
            templateUrl: 'activities/201606/abroad.html',
            controller: 'abroad_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201606/abroad.js']);
              }]
            }
          })
          .state('textbook', {
            url: '/textbook',
            templateUrl: 'activities/201606/textbook.html',
            controller: 'textbook_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201606/textbook.js']);
              }]
            }
          })
          .state('coupon', {
            url: '/coupon',
            templateUrl: 'activities/201606/coupon.html',
            controller: 'coupon_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201606/coupon.js']);
              }]
            }
          })
          .state('summer', {
            url: '/summer',
            templateUrl: 'activities/201606/summer.html',
            controller: 'summer_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201606/summer.js']);
              }]
            }
          })
          .state('coursegroup', {
            url: '/coursegroup/:courseId&:state',
            templateUrl: 'modules/course/coursegroup.html',
            controller: 'coursegroup_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/course/coursegroup.js']);
              }]
            }
          });

        $stateProvider
          .state('tab', {
            abstract: true,
            templateUrl: 'modules/pubilc/tabs.html'
          })
          .state('home', {
            url: '/home',
            parent: 'tab',
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
            },
            onEnter: function ($ionicTabsDelegate, $timeout) {
              $timeout(function () {
                $ionicTabsDelegate.select(0)
              }, 0);
            }
          })
          .state('course', {
            url: '/course',
            parent: 'tab',
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
            },
            onEnter: function ($ionicTabsDelegate, $timeout) {
              $timeout(function () {
                $ionicTabsDelegate.select(1)
              }, 0);
            }
          })
          .state('myaccount', {
            url: '/myaccount',
            parent: 'tab',
            views: {
              'conent': {
                templateUrl: 'modules/user/myaccount.html',
                controller: 'myaccount_ctrl'
              }
            },
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/myaccount.js', 'modules/user/set.js']);
              }]
            },
            onEnter: function ($ionicTabsDelegate, $timeout) {
              $timeout(function () {
                $ionicTabsDelegate.select(2)
              }, 0);
            },
            onExit: function ($ionicSideMenuDelegate, $timeout) {
              $timeout(function () {
                $ionicSideMenuDelegate.toggleLeft(false);
              })
            }
          })
          .state('myorder', {
            url: '/myorder',
            parent: 'myaccount',
            views: {
              'account': {
                controller: 'myorder_ctrl',
                templateUrl: 'modules/user/myorder.html'
              }
            },
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/myorder.js']);
              }]
            }
          })
          .state('mycourse', {
            url: '/mycourse',
            parent: 'myaccount',
            views: {
              'account': {
                controller: 'mycourse_ctrl',
                templateUrl: 'modules/user/mycourse.html'
              }
            },
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/mycourse.js']);
              }]
            }
          })
          .state('mycollection', {
            url: '/mycollection',
            parent: 'myaccount',
            views: {
              'account': {
                controller: 'mycollection_ctrl',
                templateUrl: 'modules/user/mycollection.html'
              }
            },
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/mycollection.js']);
              }]
            }
          })
          .state('myrecommend', {
            url: '/myrecommend',
            parent: 'myaccount',
            views: {
              'account': {
                controller: 'myrecommend_ctrl',
                templateUrl: 'modules/user/myrecommend.html'
              }
            },
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/myrecommend.js']);
              }]
            }
          })
      });

  });
})();
