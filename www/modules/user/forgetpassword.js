'use strict';


angular.module('freexf')
  .controller('forgetpassword_ctrl',function ($scope, $rootScope, $injector, $ionicLoading, $timeout,AuthRepository) {
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
      // $scope.authLoad = true;
      // $event.target.disabled = true;
      var forget=$scope.forget;
      FORGET.create(forget).then(function(req){
        // $event.target.disabled = false;
        $scope.forget=new forgetpasswordModel();
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
      var parameter = {type: 'sms', mobile: $scope.forget.phone, codeyz: 'true'};
      PHONE_CODE.getModel(parameter).then(function (req) {
        debugger
      })
    }
  });
