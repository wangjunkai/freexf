'use strict';


angular.module('freexf')
  .controller('forgetpassword_ctrl',function ($scope, $rootScope, $injector, $ionicLoading,$interval,  $timeout, $Loading, AuthRepository) {
    var FORGET = AuthRepository('AjaxForgetPassword.aspx', '/ajax');
    var PHONE_CODE = AuthRepository('sendphonecode.aspx', '/ajax');
    function forgetpasswordModel() {
      this.forget = {
        phone: '',
        code: '',
        phonecode: '',
        password: '',
        confirmPassword: ''
      };
      return this.forget;
    }
    $scope.forget = new forgetpasswordModel();
    //忘记密码
    $scope.forgetpassword = function ($event) {
      $scope.authLoad = true;
      $event.target.disabled = true;
      $Loading.show({class: 'ion-alert-circled', text: '修改中...'}, false);
      var forget=$scope.forget;
      FORGET.getModel(forget).then(function(req){
        var data = req.response.data;
        $Loading.show({class: 'ion-alert-circled', text: data.message}, false, 1500);
        $event.target.disabled = false;
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
      console.log($scope.forget.phone);
      var parameter = {type: 'forgetpwdsms', mobile: $scope.forget.phone, codeyz: $scope.forget.code};
      PHONE_CODE.getModel(parameter).then(function (req) {
        var data = req.response.data;
        var msg = {success: '发送成功,请注意查收!', yzmfalse: '验证码错误!'};
        console.log(data);
        var time = 30;
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
