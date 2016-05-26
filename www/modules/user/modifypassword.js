'use strict';


angular.module('freexf')
  .controller('modifypassword_ctrl',function ($scope, $rootScope, $injector, $ionicLoading, $timeout,AuthRepository) {
    var MODIFY = AuthRepository('AjaxForgetPassword.aspx', '/ajax');
    var PHONE_CODE = AuthRepository('sendphonecode.aspx', '/ajax');
    function modifypasswordModel() {
      this.modify = {
        phone: '',
        code: '',
        phonecode: '',
        password: '',
        confirmPassword: ''
      };
      return this.forget;
    }
    $scope.modify = new modifypasswordModel();
    //忘记密码
    $scope.forgetpassword = function ($event) {
      // $scope.authLoad = true;
      // $event.target.disabled = true;
      var modify=$scope.modify;
      MODIFY.create(modify).then(function(req){
        // $event.target.disabled = false;
        $scope.modify=new modifypasswordModel();
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
      var parameter = {type: 'sms', mobile: $scope.modify.phone, codeyz: 'true'};
      PHONE_CODE.getModel(parameter).then(function (req) {
        debugger
      })
    }
  });
