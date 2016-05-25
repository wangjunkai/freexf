'use strict';


angular.module('freexf')
  .controller('register_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, AuthRepository) {
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
      var user = $scope.user;
      REGISTER.create(user).then(function (req) {
        $event.target.disabled = false;
        $scope.user = new registerModel();
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
      var parameter = {type: 'sms', mobile: $scope.user.phone, codeyz: 'true'};
      PHONE_CODE.getModel(parameter).then(function (req) {
        debugger
      })
    }
  });
