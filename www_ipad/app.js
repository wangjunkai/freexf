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
        FREEXFUSER: {
          name: 'freexfUser',
          data: {
            Sign: null,
            rowId: null,
            rememberPw: '',
            password: '',
            phone: '',
            userLg: false
          }
        },
        ISLOGIN: ['login', 'tab.myaccount'],
        NOTLOGIN: ['tab.member']
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
      .directive('includeReplace', function () {
        return {
          require: 'ngInclude',
          restrict: 'A',
          link: function (scope, el) {
            el.replaceWith(el.children());
          }
        };
      })
      //初始化计算bar center 宽度
      .directive('defaultHeaderBar', ['$rootScope', '$ionicHistory', '$ionicConfig', '$state', '$injector',
        function ($rootScope, $ionicHistory, $ionicConfig, $state, $injector) {
          return function (scope, element, attrs) {
            //angular 包装的jquery有问题
            var $element = $(element[0]);
            scope.$on('$ionicView.loaded', function () {
              var a = $element.find('.bar-left'), b = $element.find('.bar-center'), c = $element.find('.bar-right');
              b.css('width', $element.width() - a.width() - c.width() - 2);
            });
          }
        }])
      //默认后退按钮当没有历史记录的时候跳转到首页 指令
      .directive('defaultNavBackButton', ['$rootScope', '$ionicHistory', '$ionicConfig', '$state', '$injector',
        function ($rootScope, $ionicHistory, $ionicConfig, $state, $injector) {
          return function (scope, element, attrs) {
            var $element = $(element[0]);
            var back = function () {
              //符合条件，返回home
              var _backView = ['payaddress', 'payfail'];//后退页面
              var _currentView = ['textbook', 'summer', 'coupon', 'abroad'];//当前页面
              return !!($ionicHistory.backView() && $.inArray($ionicHistory.backView().stateName, _backView) < 0 && $.inArray($ionicHistory.currentView().stateName, _currentView) < 0);
            };
            scope.goBack = function () {
              back() ? $ionicHistory.goBack() : $state.go('tab.home');
            };
            scope.$on('$ionicView.loaded', function () {
              var a = back(), b = $element.find('i')[0];
              b.className = b.className.replace(b.className.match(/freexf-\w+/), back() ? 'freexf-goback' : 'freexf-gohomeback');
              $element.css('width', $(b).width()).removeClass('hide');
            });
          }
        }])
      //form 表单验证指令
      .directive('fxValidate', ['$rootScope',
        function ($rootScope) {
          var reg = {
            null: /\S/gi,
            phone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57]|99[0-9])[0-9]{8}$/gi,
            password8_30: /^.{8,30}$/gi
          };
          var formatObj = {
            require: {
              null: [reg.null, '不能为空'],
              phone: [reg.null, '请填写手机号'],
              password: [reg.null, '请填写密码'],
              confirmPassword: [reg.null, '请填写确认密码'],
              imgCode: [reg.null, '请填写图片验证码'],
              phoneCode: [reg.null, '请填写手机验证码']
            },
            format: {
              phone: [reg.phone, '手机号格式错误'],
              password8_30: [reg.password8_30, '密码范围(8-30位)']
            }
          };
          return {
            //设置指令优先顺序
            priority: -1,
            require: '^?ngModel',
            link: function (scope, element, attrs, ctrl) {
              var $element = $(element[0]), msgAry = {}, formatType, formatMsg;
              var temp = function (o) {
                return '<p class="freexf-validate-msg" style="font-size:12px;color:red;">' + o + '</p>';
              };
              //输出提示信息
              var fn = function () {
                //设置form validate
                ctrl.$setValidity('_isOk', true);
                $element.nextAll('.freexf-validate-msg').remove();
                for (var m in msgAry) {
                  if (!(new RegExp(msgAry[m]['type'][0])).test($element.val())) {
                    $element.after(msgAry[m]['temp']);
                    ctrl.$setValidity('_isOk', false);
                  }
                }
                //如果有多条提示信息，按照 fx-validate 中所设置的优先级来提示，最多提示一条
                $element.nextAll('.freexf-validate-msg').length > 1 && $element.nextAll('.freexf-validate-msg:not(:last-child)').remove();
              };
              //添加提示信息到对象 截取字符串规则 【fx-validate="require（type什么类型的正则）:phone（提示信息）;format:phone;"】
              for (var i = 0, j = attrs.fxValidate.split(';'); i < j.length; i++) {
                var data = j[i], fIndex = data.indexOf(':'), lIndex = data.lastIndexOf(':');
                if (fIndex > 0) {
                  formatType = data.substring(0, fIndex), formatMsg = lIndex == data.length ? 'null' : data.substring(fIndex + 1, data.length);
                  var msg = msgAry[formatType + '.' + formatMsg] = {};
                  msg['type'] = formatObj[formatType][formatMsg];
                  msg['temp'] = temp(formatObj[formatType][formatMsg][1]);
                }
              }

              //绑定事件 ，设定规则,如果为 submit() 更改点击行为，主动验证form表单中的数据,submit(‘a’[表单的name],‘b’,‘c’),参数为空全部验证
              if (Object.getOwnPropertyNames(msgAry).length <= 0) {
                var newArgs = (new Function('$', "var submit = function () { return $.makeArray(arguments) }; return " + attrs.fxValidate))($);
                var names = newArgs.length > 0 ? $.map(newArgs, function (val, i) {
                  return '[name=' + val + ']'
                }).join(',') : '[fx-validate]';
                $element.on('click', function () {
                  $($element.closest('form').find(names)).trigger('input');
                });
              }
              else {
                $element.on('input', fn.bind(this));
              }
            }
          }
        }])
      //modal服务
      .factory('$frModal', function ($rootScope, $ionicModal,$compile, $q) {
        function frModal(options) {
          var self = this;
          var opt = options || {};
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
              app.controllerProvider.register(ctrlObj.ctrl, ctrlObj.fn);
              if (!opt.tempUrl) {
                modalDeferred.reject("templateUrl not null!");
              } else {
                $ionicModal.fromTemplateUrl(opt.tempUrl, {
                  scope: opt.scope || $rootScope,
                  animation: opt.animation || 'slide-in-up'
                }).then(function (modal) {
                  $compile($(modal.modalEl).attr("ng-controller",ctrlObj.ctrl)[0]);
                  modalDeferred.resolve(modal);
                });
              }
            });
            return modalDeferred.promise;
          };
          return getModal();
        }
        return function(options){
          return new frModal(options);
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
      .run(['$rootScope', '$state', '$Loading', '$compile', '$timeout', '$anchorScroll', 'localStorageService', 'AUTH', 'XHR',
        function ($rootScope, $state, $Loading, $compile, $timeout, $anchorScroll, localStorageService, AUTH, XHR) {
          //用户本地信息
          var local = localStorageService.get(AUTH.FREEXFUSER.name);
          AUTH.FREEXFUSER.data = local ? local : AUTH.FREEXFUSER.data;

          $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
            if (!AUTH.FREEXFUSER.data.userLg && $.inArray(to.name, AUTH.NOTLOGIN) >= 0) {
              ev.preventDefault();
              $state.go('tab.myaccount');
            }
            else if (AUTH.FREEXFUSER.data.userLg && $.inArray(to.name, AUTH.ISLOGIN) >= 0) {
              ev.preventDefault();
              $state.go('tab.member');
            }
          });
          $rootScope.$on('$viewContentLoading', function (event, viewConfig) {

          });
          $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
            !!$rootScope.xhr || $Loading.hide();
          });
          $rootScope.$on('$stateChangeError', function () {
            ev.preventDefault();
            $state.go('tab.home');
          });

          //根据作用域id取得当前作用域dom
          var _con = function (fn, vf, load) {
            vf.isLoading = load;
            $('ion-content').each(function (e, dom) {
              var view = angular.element($(dom).closest('ion-view'));
              vf && view.length > 0 && vf.$id == view.scope().$id && fn(e, dom);
            });
          };
          $rootScope.$on('$ionicView.beforeEnter', function (event, viewConfig) {
            _con.call(this, function (e, dom) {
              $(dom).siblings('#content-loading').length > 0 || $(dom).after(
                $compile('<div id="content-loading" ng-show="isLoading" scroll="false">' +
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
                $(dom).css({'opacity': 1, 'margin-top': -1});
              }, event.targetScope, false);
            }, viewConfig.direction == 'none' ? 200 : 0);
          });
        }])
      .config(function ($provide, $stateProvider, $controllerProvider, $locationProvider, $urlRouterProvider, $ionicConfigProvider) {

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

        app.controllerProvider = $controllerProvider;

        /*-------------ui-router 配置-----------------------------*/
        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise('/home');

        $stateProvider
          .state('login', {
            url: '/login',
            templateUrl: 'modules/user/login.html',
            controller: 'login_ctrl',
            cache: false,
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
            cache: false,
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
            cache: false,
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
            cache: false,
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
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/set.js']);
              }]
            }
          })
          .state('aboutus', {
            url: '/aboutus',
            templateUrl: 'modules/user/aboutus.html',
            controller: 'aboutus_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/aboutus.js']);
              }]
            }
          })
          .state('commonfaq', {
            url: '/commonfaq',
            templateUrl: 'modules/user/commonfaq.html',
            controller: 'faq_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/faq.js']);
              }]
            }
          })
          .state('ideafeedback', {
            url: '/ideafeedback',
            templateUrl: 'modules/user/ideafeedback.html',
            controller: 'ideafeedback_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/ideafeedback.js']);
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
          .state('myorder', {
            url: '/myorder',
            templateUrl: 'modules/user/myorder.html',
            controller: 'myorder_ctrl',
            cache: false,
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
            cache: false,
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
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/mycollection.js']);
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
          .state('coursesearch', {
            url: '/coursesearch',
            views: {
              '': {
                templateUrl: 'modules/course/coursesearch.html',
                controller: 'coursesearch_ctrl'
              },
              'classmodule@coursesearch': {
                //controller: 'coursesearch_ctrl',
                templateUrl: 'modules/course/classmodule.html'
              }
            },
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/course/coursesearch.js']);
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
          /*          .state('coursedetail', {
           url: '/coursedetail/:courseId&:state',
           templateUrl: 'modules/course/coursedetail.html',
           controller: 'coursedetail_ctrl',
           data:{
           isModal:true
           },
           cache: false,
           resolve: {
           loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
           return $ocLazyLoad.load(['modules/course/coursedetail.js']);
           }]
           }
           })*/
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
            },
            onEnter: function ($ionicTabsDelegate, $timeout) {
              $timeout(function () {
                $ionicTabsDelegate.select(0)
              }, 0);
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
            },
            onEnter: function ($ionicTabsDelegate, $timeout) {
              $timeout(function () {
                $ionicTabsDelegate.select(1)
              }, 0);
            }
          })
          .state('tab.member', {
            url: '/member',
            cache: false,
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
            },
            onEnter: function ($ionicTabsDelegate, $timeout) {
              $timeout(function () {
                $ionicTabsDelegate.select(2)
              }, 0);
            }
          })
          .state('tab.myaccount', {
            url: '/myaccount',
            views: {
              'conent': {
                templateUrl: 'modules/user/myaccount.html',
                controller: 'myaccount_ctrl'
              }
            },
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/myaccount.js']);
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
      });

  });
})();