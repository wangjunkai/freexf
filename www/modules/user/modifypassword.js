'use strict';


angular.module('freexf')
  .controller('modifypassword_ctrl',function ($scope, $rootScope, $injector, $ionicLoading,$interval, $timeout, $Loading, AuthRepository,AUTH) {
    var MODIFY = AuthRepository('AjaxForgetPassword.aspx', '/ajax');
    var PHONE_CODE = AuthRepository('sendphonecode.aspx', '/ajax');
    $scope.phone=AUTH.FREEXFUSER.data.phone;
    function modifypasswordModel() {
      this.modify = {
        phone: '',
        code: '',
        phonecode: '',
        password: '',
        confirmPassword: ''
      };
      return this.modify;
    }
    $scope.modify = new modifypasswordModel();
    $scope.modify.phone=$scope.phone;
    //修改密码
    $scope.modifypassword = function ($event) {
      $scope.authLoad = true;
      $event.target.disabled = true;
      $Loading.show({class: 'ion-alert-circled', text: '修改中...'}, false);

      var modify=$scope.modify;
      MODIFY.getModel(modify).then(function(req){
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
      console.log($scope.modify.phone);
      var parameter = {type: 'forgetpwdsms', mobile: $scope.modify.phone, codeyz: $scope.modify.code};
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
