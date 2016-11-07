;(function () {
  define([
    'ionic'
  ], function (ionic) {
    angular.module('freexf', [
      'ionic',
      'oc.lazyLoad',
      'ngSanitize',
      'ionicLazyLoad',
      'restangular',
      'LocalStorageModule'
    ])
      .constant('MSGICON', {
        success: 'ion-checkmark-round',
        fail: 'ion-alert-circled',
        load: 'ion-load-a'
      })
      .constant('XHR', 0)
      //ionic loading 全局配置服务
      .constant('$ionicLoadingConfig', {
        template: '<ion-spinner icon="bubbles"></ion-spinner><div class="font">加载中...</div>',
        noBackdrop: false
      })
      //decodeUri filter
      .filter('decodeUri', function ($window) {
        return function (item) {
          return
        }
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

      //初始化计算bar center 宽度
      .directive('defaultHeaderBar', ['$rootScope', '$ionicHistory', '$ionicConfig', '$state', '$injector',
        function ($rootScope, $ionicHistory, $ionicConfig, $state, $injector) {
          return function (scope, element, attrs) {
            //angular 包装的jquery有问题
            var $element = $(element[0]);
            scope.$on('$ionicView.loaded', function () {
              var a = $element.find('.bar-left'), b = $element.find('.bar-center'), c = $element.find('.bar-right');
              b.css('width', $element.width() - a.width() - c.width() - 4);
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
              var _backView = ['payaddress', 'payfail', 'lottery'];//后退页面
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
            phone: /^(1[0-9][0-9]|99[0-9])[0-9]{8}$/gi,
            password8_30: /^.{8,30}$/gi
          };
          var formatObj = {
            require: {
              null: [reg.null, '不能为空'],
              phone: [reg.null, '请填写手机号'],
              password: [reg.null, '请填写密码'],
              name: [reg.null, '请填写姓名'],
              address: [reg.null, '请填写收货地址'],
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
      .service('AUTH', function ($injector, $q) {
        var self = this;
        this.FREEXFUSER = {
          name: 'freexfUser',
          data: {
            Sign: null,
            rowId: null,
            rememberPw: '',
            password: '',
            phone: '',
            userLg: false
          }
        };
        this.ISLOGIN = ['login', 'tab.myaccount'];
        this.NOTLOGIN = ['tab.member'];
        this.toLogin = function (login) {
          var defer = $q.defer();
          var LOGIN = $injector.get('AuthRepository').call(null, 'AjaxLogin.aspx', '/ajax');
          var loginSign = '{"phone":"' + self.FREEXFUSER.data.phone + '","password":"' + self.FREEXFUSER.data.password + '"}';
          login = login ? login : Base64.encode(loginSign);
          LOGIN.getModel({"sign": login}).then(function (req) {
            defer.resolve(req);
          });
          return defer.promise;
        }
      })
      .factory('$ToDetailState', function ($document, $location, $state) {
        function toState() {
          this.app = this.getParam.call(this);
          this.map = {
            coursedetail: this.app ? 'course' : 'coursedetail',
            courseplate: this.app ? 'course_list' : 'courseplate',
            telephone: this.app ? 'tele' : 'telephone',
            Category1: 'Category1',
            Category2: 'Category2',
            Category3: 'Category3',
            Category4: 'Category4'
          };
          this.go = this.connect.call(this);
        }

        toState.prototype = {
          getParam: function () {
            return 'app' in $location.$$search ? $location.$$search['app'] : null
          },
          initWebView: function () {
            function connectWebViewJavascriptBridge(callback) {
              var self = this;
              if (window.WebViewJavascriptBridge) {
                callback(WebViewJavascriptBridge)
              } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                  callback(WebViewJavascriptBridge)
                }, false);
              }
            }

            connectWebViewJavascriptBridge.call(this, function (bridge) {
              try {
                bridge.init(function (message, responseCallback) {
                });
              } catch (e) {
              }
            });
          },
          _GON: Object.getOwnPropertyNames,
          initParam: function (state, data) {
            if (!data) {
              data = state;
              state = null;
            }
            var newdata = {};
            if (this.app && state) {
              var obj = {
                coursedetail: function (data) {
                  return data[this._GON(data)[0]]
                },
                telephone: function (data) {
                  return data[this._GON(data)[0]]
                },
                //app搜索列表参数处理
                courseplate: function () {
                  var type = [], param = [], Category = 'Category', QuanBu = '全部';
                  for (var i = 1; i <= 4; i++) {
                    if (Category + i in data) {
                      param.push(data[Category + i])
                    } else {
                      param.push(QuanBu);
                    }
                  }
                  return param.join('-')
                }
              };
              newdata = {type: this.map[state], param: obj[state].call(this, data)};
            } else {
              newdata = data;
            }
            return newdata;
          },
          goState: function (state, data) {
            if (!data) {
              data = state;
              state = null;
            }
            if (!state)return;
            if (state && state == 'telephone') {
              location.href = "tel:400-803-6611";
              return;
            }
            try {
              $state.go(state, this.initParam(data));
            } catch (e) {
            }

          },
          goApp: function (state, data) {
            var newdata = this.initParam(state, data);
            try {
              window.WebViewJavascriptBridge.callHandler('HtmlToAndroid', newdata, function (responseData) {
              });
            } catch (e) {
            }
          },
          removeTitle: function () {
            var headerbar = $($document[0]).find('ion-header-bar'),
              content = $($document[0]).find('ion-content.has-header');
            $(headerbar).css('display', 'none');
            $(content).addClass('no-header');
          },
          connect: function () {
            if (!this.app) {
              return this.goState.bind(this);
            } else {
              this.initWebView();
              this.removeTitle();
              return this.goApp.bind(this);
            }
          }
        };
        var a = new toState();
        return {
          go: a.go
        }
      })
      .factory('$fxModal', function ($ionicModal, $q) {
        var TemplateUrl = {
          login: 'modules/user/loginmodal.html',
          register: 'modules/user/registermodal.html'
        }, names = Object.getOwnPropertyNames(TemplateUrl);

        function init(scope) {
          var defer = $q.defer();
          if (!scope.modal) {
            scope.modal = {};
          }
          for (var i in TemplateUrl) {
            (function (j) {
              $ionicModal.fromTemplateUrl(TemplateUrl[j], {
                scope: scope,
                animation: 'slide-in-up'
              }).then(function (modal) {
                scope.modal[j] = modal;
                if (names.indexOf(j) + 1 == names.length) {
                  defer.resolve(scope.modal);
                }
              });
            })(i)
          }
          scope.modal['openModal'] = function (a) {
            scope.modal[a].show();
          };
          scope.modal['closeModal'] = function (a) {
            scope.modal[a].hide();
          };
          return defer.promise;
        }

        return {
          init: init
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
            template: '<div class="ion-alert-circled" style="font-size: 20px;"></div><div class="font">数据载入错误,请刷新页面重试!</div>'
          });
          exception.message += ' (caused by "' + cause + '")';
          throw exception;
        }
      })
      //apes
      .service('apes', function (localStorageService, ENV, UpdateAPES) {
        this.apesFun = function (apesNum) {
          if (typeof (localStorageService.get('URLshortID')) != 'undefined' && localStorageService.get('URLshortID') != '' && localStorageService.get(apesNum) != '1') {
            var GetUpdateAPES = UpdateAPES(ENV._api.__UpdateAPES);
            GetUpdateAPES.getModel({
              'apesType': apesNum.split('APES')[1],
              'URLTrafficID': localStorageService.get('URLshortID')
            }).then(function (res) {
            });
            localStorageService.set(apesNum, '1');
          }
          ;
        };
        //return apesFun;

      })
      //全局路由配置
      .run(['$rootScope', '$state', '$Loading', '$compile', '$timeout', '$interval', '$anchorScroll', 'localStorageService', 'AUTH', 'XHR', 'ENV', 'UpdateAPES', 'apes',
        function ($rootScope, $state, $Loading, $compile, $timeout, $interval, $anchorScroll, localStorageService, AUTH, XHR, ENV, UpdateAPES, apes) {

          //APES配置
          if (localStorageService.get('APES0') == null) {
            localStorageService.set('APES0', '0');
          }
          if (localStorageService.get('APES1') == null) {
            localStorageService.set('APES1', '0');
          }
          if (localStorageService.get('APES2') == null) {
            localStorageService.set('APES2', '0');
          }
          if (localStorageService.get('APES3') == null) {
            localStorageService.set('APES3', '0');
          }
          if (localStorageService.get('APES4') == null) {
            localStorageService.set('APES4', '0');
          }
          if (localStorageService.get('APES5') == null) {
            localStorageService.set('APES5', '0');
          }
          //用户本地信息
          var local = localStorageService.get(AUTH.FREEXFUSER.name);
          AUTH.FREEXFUSER.data = local ? local : AUTH.FREEXFUSER.data;

          $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

            if (!AUTH.FREEXFUSER.data.userLg && $.inArray(to.name, AUTH.NOTLOGIN) >= 0) {
              ev.preventDefault();
              $state.go('tab.myaccount');
              return;
            }
            else if (AUTH.FREEXFUSER.data.userLg && $.inArray(to.name, AUTH.ISLOGIN) >= 0) {
              ev.preventDefault();
              $state.go('tab.member');
              return;
            }
            ;

          });
          $rootScope.$on('$viewContentLoading', function (event, viewConfig) {

          });
          $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams, rootScope) {
            $interval.cancel($rootScope.h5playtimeend);
            !!$rootScope.xhr || $Loading.hide();
            if (typeof (getCookieValue('Apes_Traffic_ID')) != 'undefined' || getCookieValue('Apes_Traffic_ID') != '') {
              var URLshortID = getCookieValue('Apes_Traffic_ID');
              if (URLshortID != localStorageService.get('URLshortID')) {
                localStorageService.set('URLshortID', URLshortID);
                localStorageService.set('APES0', '0');
                localStorageService.set('APES1', '0');
                localStorageService.set('APES2', '0');
                localStorageService.set('APES3', '0');
                localStorageService.set('APES4', '0');
                localStorageService.set('APES5', '0');
              }
            }
            apes.apesFun('APES0');

            //判断有无iframe id控制 有：干掉它
            //添加iframe，url:?html=window.location.href.split('#')[1]

            setTimeout(function () {
              if ($('iframe').length) {
                $('#childFrame').remove();
              }

              var url = window.location.href.split('#')[1];
              var childFrame = "<div id='childFrame'><iframe src='./seohtml.html?html=" + url + "'></iframe></div>"
              var template = angular.element(childFrame);
              iframeElement = $compile(template)($rootScope);
              angular.element(document.body).append(iframeElement);
            }, 100)

            //  var url = window.location.href.split('#')[1];
            //  var childFrame = "<div id='childFrame'><iframe src='./seohtml.html?html=" + url + "'></iframe></div>"
            //  var template = angular.element(childFrame);
            //  iframeElement = $compile(template)($rootScope);
            //  angular.element(document.body).append(iframeElement);
            //}, 100)

            //$rootScope.baidutj = function () {
            //    $rootScope.nowurl = window.location.href.split('#')[1];
            //    $rootScope.nowurl0 = window.location.href.split('#')[0];
            //    if ($rootScope.nowurl0.indexOf('?') > 1) {
            //        $rootScope.nowurl0 = $rootScope.nowurl0.split('?')[0]
            //    }
            //    $rootScope.pushUrl = $rootScope.nowurl0 + "?v=" + $rootScope.nowurl.substr(1) + "#" + $rootScope.nowurl;
            //    return $rootScope.pushUrl;
            //}

            //setTimeout(function () {
            //    console.log($rootScope.baidutj());
            //    window.history.pushState({}, 0, $rootScope.baidutj());
            //    var _hmt = _hmt || [];
            //    (function () {
            //        var hm = document.createElement("script");
            //        hm.src = "//hm.baidu.com/hm.js?a80a61243445fb2bc4cd94612c8e857e";
            //        var s = document.getElementsByTagName("script")[0];
            //        s.parentNode.insertBefore(hm, s);
            //    })();
            //}, 2000);
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
      .config(function ($provide, $stateProvider, $locationProvider, $urlRouterProvider, $ionicConfigProvider) {

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
          .state('loginsregister', {
            url: '/loginsregister',
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
            url: '/pay/:DiscountCode',
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
          .state('paywx', {
            url: '/paywx/:OrderId',
            templateUrl: 'modules/pay/payweixin.html',
            controller: 'payweixin_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/pay/payweixin.js']);
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
          .state('mycoursenote', {
            url: '/mycoursenote/:courseId',
            templateUrl: 'modules/user/mycoursenote.html',
            controller: 'mycoursenote_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/mycoursenote.js']);
              }]
            }
          })
          .state('mycoursementoring', {
            url: '/mycoursementoring/:courseId',
            templateUrl: 'modules/user/mycoursementoring.html',
            controller: 'mycoursementoring_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/mycoursementoring.js']);
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
            url: '/courseplate/:Category1&:Category2&:Category3&:Category4',
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
            cache: false,
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
          .state('classlearning', {
            url: '/classlearning',
            templateUrl: 'activities/201608/classlearning.html',
            controller: 'classlearning_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201608/classlearning.js']);
              }]
            }
          })
          .state('olympic', {
            url: '/olympic',
            templateUrl: 'activities/201608/olympic.html',
            controller: 'olympic_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201608/olympic.js']);
              }]
            }
          })
          .state('korean', {
            url: '/korean',
            templateUrl: 'activities/201608/koreanlanguage.html',
            controller: 'korean_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201608/koreanlanguage.js']);
              }]
            }
          })
          .state('examinationTime', {
            url: '/examinationTime',
            templateUrl: 'activities/201608/examinationTime.html',
            controller: 'examinationTime_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201608/examinationTime.js']);
              }]
            }
          })
          .state('invitefriends', {
            url: '/invitefriends',
            templateUrl: 'activities/201608/invitefriends.html',
            controller: 'invitefriends_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201608/invitefriends.js']);
              }]
            }
          })
          .state('microClass', {
            url: '/microClass',
            templateUrl: 'activities/201609/microClass.html',
            controller: 'microClass_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201609/microClass.js']);
              }]/*,
              loadMyCtrl2: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/login.js']);
              }],
              loadMyCtrl3: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/user/register.js']);
              }]*/
            }
          })
          .state('oneBuy', {
            url: '/oneBuy',
            templateUrl: 'activities/201610/oneBuy.html',
            controller: 'oneBuy_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201610/oneBuy.js']);
              }]
            }
          })
          .state('courseDiscount', {
            url: '/courseDiscount',
            templateUrl: 'activities/201609/courseDiscount.html',
            controller: 'courseDiscount_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201609/courseDiscount.js']);
              }]
            }
          })
          .state('coursedetail', {
            url: '/coursedetail/:courseId&:state',
            templateUrl: 'modules/course/coursedetail.html',
            controller: 'coursedetail_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/course/coursedetail.js']);
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
          })
          .state('multilingual', {
            url: '/multilingual',
            templateUrl: 'activities/201609/multilingual.html',
            controller: 'multilingual_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201609/multilingual.js']);
              }]
            }
          })
          .state('lottery', {
            url: '/lottery/:courseId',
            templateUrl: 'activities/201609/lottery.html',
            controller: 'lottery_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201609/lottery.js']);
              }]
            }
          })
          .state('teacherteam', {
            url: '/teacherteam',
            templateUrl: 'activities/201609/teacherteam.html',
            controller: 'teacherteam_ctrl',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201609/teacherteam.js']);
              }]
            }
          })
          .state('ExaminationPaper', {
            url: '/ExaminationPaper',
            templateUrl: 'modules/PracticeExam/ExaminationPaper.html',
            controller: 'ExaminationPaper_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/PracticeExam/ExaminationPaper.js']);
              }]
            }
          })
          .state('cetMultilingual', {
            url: '/cetMultilingual',
            templateUrl: 'activities/201610/cetMultilingual.html',
            controller: 'cetMultilingual_ctrl',
            cache: true,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201610/cetMultilingual.js']);
              }]
            }
          })
          //201611 4折狂欢
          .state('fourFoldCarnival', {
            url: '/fourFoldCarnival',
            templateUrl: 'activities/201611/fourFoldCarnival.html',
            controller: 'fourFoldCarnival_ctrl',
            cache: false,
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['activities/201611/fourFoldCarnival.js']);
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
            cache: false,
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
            }
          })
      });

  });
})();
