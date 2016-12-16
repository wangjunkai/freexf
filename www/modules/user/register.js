'use strict';


angular.module('freexf')
  .controller('register_ctrl', function ($scope, $rootScope, $state, $injector, $interval, $timeout, $Loading, MSGICON, AuthRepository, ENV, UpdateAPES, localStorageService, $ionicPopup, apes) {
      var REGISTER = AuthRepository(ENV._api.__Dispatch, '/Entrace');
    var PHONE_CODE = AuthRepository('sendphonecode.aspx', '/ajax');
    function registerModel() {
      if (typeof (getCookieValue('tuiGuangId')) == 'undefined') {
        this.user = {
          phone: '',
          code: '',
          phonecode: '',
          password: '',
          confirmPassword: '',
          labelphone: '输入手机号',
          labelcode: '输入验证码',
          labelphonecode: '输入短信验证码',
          labelpassword: '输入密码(8-30位)',
          labelconfirmPassword: '确认密码',
          SourceType: 'H5'
        };
      } else {
        this.user = {
          phone: '',
          code: '',
          phonecode: '',
          password: '',
          confirmPassword: '',
          labelphone: '输入手机号',
          labelcode: '输入验证码',
          labelphonecode: '输入短信验证码',
          labelpassword: '输入密码(8-30位)',
          labelconfirmPassword: '确认密码',
          SourceType: 'H5',
          s: getCookieValue('tuiGuangId'),
        };
      }

      return this.user;
    }

    $scope.user = new registerModel();
    $scope.passwordAccord = function () {
      if ($scope.user.password != $scope.user.confirmPassword) {
        $scope.user.labelconfirmPassword = '两次密码不一致'
      } else {
        $scope.user.labelconfirmPassword = '密码一致'
      }
    };
    $scope.login = function () {
        if ($scope.modal && $scope.modal['login']) {
            $scope.modal['register'].hide();
            $scope.modal.openModal('login');
        } else {
            $state.go('login');
        }
    }

    //注册
    $scope.register = function ($event, $form) {
      if ($form.$invalid)return false;
      $scope.authLoad = true;
      var user = angular.extend({}, $scope.user);
      /*      if (!user.agreement) {
       $Loading.show({text: '请阅读用户协议!', class: MSGICON.fail});
       }
       else{*/
      $Loading.show({ text: '注册中...', class: MSGICON.load }, false);
      var param = {
          "FunctionName": 'Student.Register',
          "Version": 1,
          "EndClientType": 'H5',
          "JsonPara": {
              sign:'',
          }
      };
      var registeruser = {
          mobile:$scope.user.phone,
          password:$scope.user.password,
          confirmPassword:$scope.user.confirmPassword,
          phonecode: $scope.user.phonecode,
          SourceType: user.SourceType
      }
      param['JsonPara']['sign'] = Base64.encode(JSON.stringify(registeruser))
      console.log(param)
      REGISTER.getModel(param).then(function (req) {
        var data = req.response.data;
        $Loading.show({class: data.success ? MSGICON.success : MSGICON.fail, text: data.message}, 1500);
        if (data.success) {
          apes.apesFun('APES2');
          if ($scope.modal && $scope.modal['register']) {
            $scope.modal['register'].remove() && $scope.modal['login'].show();
          } else {
            $state.go('loginsregister');
          }
        }
      });
      /*}*/
    };

    //图片验证码
    $scope.CodeImg = function () {
      var img = '/ajax/validate.aspx';
      var time = function () {
        return '?isone=2&v=' + new Date().getTime();
      };
      return {
        img: img + time(),
        getNew: function () {
          this.img = (img + time())
        }
      }
    }();

    //手机验证码
    $scope.PhoneCode = function ($event, $form) {
      if ($form.phone.$invalid || $form.code.$invalid)return false;
      $scope.PhoneCodeLoad = true;
      $event.target.disabled = true;
      var msg = {
        success: {text: '发送成功,请注意查收!', class: MSGICON.success},
        yzmfalse: {text: '验证码错误!', class: MSGICON.fail},
        fail: {text: '该手机号已存在!', class: MSGICON.success}
      };
      var parameter = {type: 'sms', mobile: $scope.user.phone, codeyz: $scope.user.code};
      PHONE_CODE.getModel(parameter).then(function (req) {
        var data = req.response.data;
        $Loading.show(msg[data], 2000);
        console.log(data);
        var time = 60;
        if (data === 'success') {
          var stoptime = $interval(function () {
            if (time == 0) {
              $interval.cancel(stoptime), $event.target.disabled = false, $event.target.innerText = '获取验证码'
            }
            else {
              $event.target.innerText = '再次获取 ' + --time + 's';
            }
          }, 1000);
        } else {
          $event.target.disabled = false;
        }
      })
    };

    //注册之前的提示
    // 触发一个按钮点击，或一些其他目标
    $rootScope.showloginclues = function () {
      var confirmPopup = $ionicPopup.show({
        cssClass: 'freexf-login-clues',
        template: '<div class="freexf-login-clues-content">'
        + '<div class="login-clues-content-message"><img image-lazy-src="img/user/login-clues-3x.png" />'
        + '<a class="cancel" ng-click ="showregister()"><div class="login-clues-button"></div></a>'
        + '</div></div>',
      });
      $rootScope.showregister = function () {
        confirmPopup.close();
      }

      var screenheight = $(window).height();
      //var headerbarheight = $("ion-header-bar").height();
      //var footerbarheight = $("ion-tab").height();
      var allowheight = screenheight - (87);
      //alert(allowheight);
      $(".popup-body").css("height", allowheight);
    }

    if (!$scope.modal) {
      $rootScope.showloginclues();
    }

  });
