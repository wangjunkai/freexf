;(function () {
  'use strict';

  angular.module('freexf')
    .directive('scrollCourseTab', ['$location', '$ionicScrollDelegate', function ($location, $ionicScrollDelegate) {
        return function ($scope, $element, $attrs) {
        var content = $($element).find('ion-content')[0];
        var coursecontent = $($element).find('#coursedetail');
        var tabs = $($element).find('#tabs')[0];
        var tabs_height = 50; //$(tabs).outerHeight()
        var header_height = 44;
        var header_sub_height = header_height;
        $(content).bind('scroll', function (e) {
          e.preventDefault();
          var newtop = $(coursecontent).position().top;
          if (newtop <= header_sub_height) {
            $(tabs).css('top', 44)
          } else if (newtop > header_sub_height) {
            $(tabs).css('top', -tabs_height)
          }
        })
      }
    }])
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
    .directive('defaultHeaderBar', [function () {
      return function (scope, element, attrs) {
        //angular 包装的jquery有问题
        var $element = $(element[0]);
        scope.$on('$ionicView.loaded', function () {
          var a = $element.find('.bar-left'), b = $element.find('.bar-center'), c = $element.find('.bar-right');
          b.css('width', $element.width() - a.width() - c.width() - 2);
        });
      }
    }])
    //set 在ipad上reload页面后不work，重新定义一个指令来解决此问题
    .directive('setsRouter', function ($rootScope, $state, $frModal) {
      var mtemp = {
        about: {
          text: '关于学费全免网',
          ctrlUrl: 'modules/user/aboutus',
          tempUrl: 'modules/user/aboutus.html'
        },
        contact: {
          text: '联系我们',
          ctrlUrl: 'modules/user/contact',
          tempUrl: 'modules/user/contact.html'
        },
        feedback: {
          text: '意见反馈',
          ctrlUrl: 'modules/user/ideafeedback',
          tempUrl: 'modules/user/ideafeedback.html'
        },
        faq: {
          text: '常见问题',
          ctrlUrl: 'modules/user/faq',
          tempUrl: 'modules/user/commonfaq.html'
        },
        modifypassword: {
          text: '修改密码',
          ctrlUrl: 'modules/user/modifypassword',
          tempUrl: 'modules/user/modifypassword.html'
        }
      };
      return {
        template: function () {
          var str = '';
          for (var i in mtemp) {
            var s = i == 'modifypassword' ?
            '<li ng-class="{logout:!log}" class="' + i + '">' + mtemp[i].text + '</li>' :
            '<li class="' + i + '">' + mtemp[i].text + '</li>';
            str += s;
          }
          return str;
        },
        controller: function ($scope, $element, $attrs) {
          var $element = $($element[0]), $li = $($element.find('li'));
          var autoload = function(){
            for (var i in mtemp) {
              (function (i) {
                $frModal.modal(mtemp[i]).then(function (modal) {
                  $scope[i] = modal;
                });
              })(i);
            }
          };
          $li.on('click', function (e) {
            $frModal.openModal($scope,e.target.className,mtemp);
          });
        }
      };
    })
    //ion-tabs 在ipad上reload页面后不work，重新定义一个指令来解决此问题
    .directive('tabsRouter', function ($rootScope, $state, $ionicTabsDelegate, $userTabs) {
      return function (scope, element, attrs) {
        var $element = $(element[0]);
        scope.account = $userTabs.getActive();
        $rootScope.$on('userTabs:active', function (ev, state) {
          scope.account = state.state;
          $ionicTabsDelegate.select(2);
        });
        $($element.find('a')).each(function (i, self) {
          $(self).on('click', function () {
            $ionicTabsDelegate.select(i);
            $state.go($($element.find('ion-tab')[i]).attr('class'));
          });
        })
      }
    })
    //我的账户tab标签
    .directive('accountTab', function ($rootScope, $freexfUser, $ionicTabsDelegate, $state, $userTabs) {
      return {
        scope: {},
        template: function () {
          return '<ul class="tab">' +
            '<li class="tab-{{value.state}}" ng-repeat="value in tabs.tabary" ng-class="{active:tabs.isSet(value.index)}" ng-click="tabs.set(value.index)"> ' +
            '{{value.name}}</li></ul>';
        },
        controller: function ($scope, $element, $attrs) {
          var $element = $($element[0]);
          var str = '<div class="MyAcc-content clearfix"><div class="TipLogo fail"></div><p>无法记录和同步学习进度，建议登录后再学习~</p></div>';
          var outset = function () {
            $element.closest('.myaccount').find('ion-nav-view.freexf-account').html(str);
            $userTabs.toBroadCast('myaccount');
          };
          $scope.auth = $freexfUser.auth();
          $scope.$watch('auth.userLg', function (val) {
            !val && outset();
          });
          //监听权限是否改变
          $scope.$on('auth:update', function (event, auth) {
            auth.userLg ? $scope.tabs.set(0) : outset();
          });
          //监听user tabs的变化
          $rootScope.$on('userTabs:active', function (ev, state) {
            $scope.tabs.tabindex(state.index);
          });
          $scope.tabs = function () {
            var tabindex = 0;
            var ary = $userTabs.tabs();
            return {
              gettabindex: function () {
                return tabindex;
              },
              tabindex: function (val) {
                tabindex = val;
              },
              tabary: ary,
              set: function (index) {
                if (!$freexfUser.auth().userLg)return false;
                $state.go(ary[index].state);
              },
              isSet: function (index) {
                return tabindex === index;
              }
            };
          }();
          $userTabs.toBroadCast($state.current.name);
        }
      }
    })
    //搜索指令
    .directive('fxSearch', ['$rootScope', '$injector', '$frModal', '$q', function ($rootScope, $injector, $frModal, $q) {
      var selfModal = $rootScope['$searchModal'];
      var getModal = function (e) {
        //延迟处理
        function m() {
          var deferred = $q.defer();
          if (selfModal) {
            deferred.resolve(selfModal);
          } else {
            $frModal.modal({
              animation: 'slide-in-up',
              ctrlUrl: 'modules/course/coursesearch',
              tempUrl: 'modules/course/coursesearch.html',
              backdropClickToClose: true
            }).then(function (modal) {
              //添加rootscope modal
              $rootScope['$searchModal'] = selfModal = modal;
              //添加关闭modal方法
              modal.scope['closeModal'] = function () {
                modal.hide();
              };
              deferred.resolve(modal);
            });
          }
          return deferred.promise;
        }

        m().then(function (modal) {
          modal.show();
        });
      };
      var link = function (scope, element, attrs) {
        var $element = $(element[0]);
        $element.on('click', getModal);
      };
      return {
        link: link
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
            back() ? $ionicHistory.goBack() : $state.go('home');
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
})();
