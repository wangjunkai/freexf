'use strict';


angular.module('freexf')
  .controller('register_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $interval, $timeout, $Loading, AuthRepository) {
    var REGISTER = AuthRepository('AjaxRegister.aspx', '/ajax');
    var PHONE_CODE = AuthRepository('sendphonecode.aspx', '/ajax');

    function registerModel() {
      this.user = {
        phone: '',
        code: '',
        phonecode: '',
        password: '',
        confirmPassword: ''
      };
      return this.user;
    }

    $scope.user = new registerModel();
    //注册
    $scope.register = function ($event) {
      $scope.authLoad = true;
      $event.target.disabled = true;
      $Loading.show({class: 'ion-alert-circled', text: '注册中...'}, false);
      var user = $scope.user;
      REGISTER.getModel(user).then(function (req) {
        var data = req.response.data;
        $Loading.show({class: 'ion-alert-circled', text: data.message}, false, 1500);
        $event.target.disabled = false;
      })
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
      var parameter = {type: 'sms', mobile: $scope.user.phone, codeyz: $scope.user.code};
      PHONE_CODE.getModel(parameter).then(function (req) {
        var data = req.response.data;
        var msg = {success: '发送成功,请注意查收!', yzmfalse: '验证码错误!'};
        console.log(data);
        $Loading.show({class: 'ion-alert-circled', text: msg[data]}, false);
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
    }
  });
