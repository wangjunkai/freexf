'use strict';


angular.module('freexf')
  .controller('register_ctrl', function ($scope, $rootScope, $state, $injector, $interval, $timeout, $Loading, MSGICON, AuthRepository) {
    var REGISTER = AuthRepository('AjaxRegister.aspx', '/ajax');
    var PHONE_CODE = AuthRepository('sendphonecode.aspx', '/ajax');

    function registerModel() {
      this.user = {
        phone: '',
        code: '',
        phonecode: '',
        password: '',
        confirmPassword: '',
        agreement: true,
        labelphone: '输入手机号',
        labelcode: '输入验证码',
        labelphonecode: '输入短信验证码',
        labelpassword: '输入密码(8-30位)',
        labelconfirmPassword: '确认密码'
      };
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
    //注册
    $scope.register = function ($event) {
      $scope.authLoad = true;
      var user = angular.extend({}, $scope.user);
      if (!user.agreement) {
        $Loading.show({text: '请阅读用户协议!', class: MSGICON.fail});
      }
      else{
        $Loading.show({text: '注册中...', class: MSGICON.load}, false);
        REGISTER.getModel(user).then(function (req) {
          var data = req.response.data;
          $Loading.show({class: data.success ? MSGICON.success : MSGICON.fail, text: data.message}, 1500);
          if (data.success) {
            $state.go('login');
          }
        })
      }
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
    $scope.PhoneCode = function ($event) {
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
        var time = 5;
        var stoptime = $interval(function () {
          if (time == 0) {
            $interval.cancel(stoptime), $event.target.disabled = false, $event.target.innerText = '获取验证码'
          }
          else {
            $event.target.innerText = '再次获取 ' + --time + 's';
          }
        }, 1000);
      })
    };
  });
