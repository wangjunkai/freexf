'use strict';


angular.module('freexf')
  .controller('forgetpassword_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $interval, $state, $timeout, $Loading, MSGICON, AuthRepository) {
    var FORGET = AuthRepository('AjaxForgetPassword.aspx', '/ajax');
    var PHONE_CODE = AuthRepository('sendphonecode.aspx', '/ajax');

    function forgetpasswordModel() {
      this.forget = {
        phone: '',
        code: '',
        phonecode: '',
        password: '',
        confirmPassword: '',
        labelphone: '输入手机号',
        labelcode: '输入验证码',
        labelphonecode: '输入短信验证码',
        labelpassword: '输入密码(8-30位)',
        labelconfirmPassword: '确认密码'
      };
      return this.forget;
    }

    $scope.forget = new forgetpasswordModel();
    $scope.passwordAccord = function () {
      if ($scope.forget.password != $scope.forget.confirmPassword) {
        $scope.forget.labelconfirmPassword = '两次密码不一致'
      } else {
        $scope.forget.labelconfirmPassword = '密码一致'
      }
    };
    //忘记密码
    $scope.forgetpassword = function ($event) {
      $scope.authLoad = true;
      $event.target.disabled = true;
      $Loading.show({class: MSGICON.load, text: '修改中...'}, false);
      var forget = $scope.forget;
      FORGET.getModel(forget).then(function (req) {
        var data = req.response.data;
        $Loading.show({class: data.success ? MSGICON.success : MSGICON.fail, text: data.message}, 1500);
        $event.target.disabled = false;
        if (data.success) {
          $timeout(function () {
            $state.go('login');
          }, 1000)
        }
      })
    };

    //图片验证码
    $scope.CodeImg = function () {
      var img = '/ajax/validate.aspx';
      var time = function () {
        return '?v=' + new Date().getTime();
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
      var parameter = {type: 'sms', mobile: $scope.forget.phone, codeyz: $scope.forget.code};
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
