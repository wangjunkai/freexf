'use strict';

define(function () {
  angular.module('freexf')
    .controller('modifypassword_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $interval, $timeout, $Loading, $state, $freexfUser, $ionicSideMenuDelegate, MSGICON, AuthRepository) {
        var MODIFY = AuthRepository('AjaxChangePassword.aspx', '/ajax');
        var PHONE_CODE = AuthRepository('sendcode.aspx', '/ajax');
        $scope.phone = $freexfUser.auth().phone;
        function modifypasswordModel() {
          this.modify = {
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
          return this.modify;
        }

        $scope.modify = new modifypasswordModel();
        $scope.modify.phone = $scope.phone;
        $scope.passwordAccord = function () {
          if ($scope.modify.password != $scope.modify.confirmPassword) {
            $scope.modify.labelconfirmPassword = '两次密码不一致'
          } else {
            $scope.modify.labelconfirmPassword = '密码一致'
          }
        };
        //修改密码
        $scope.modifypassword = function ($event, $form) {
          if ($form.$invalid)return false;
          $scope.authLoad = true;
          $event.target.disabled = true;
          $Loading.show({class: MSGICON.load, text: '修改中...'}, false);

          var modify = $scope.modify;
          MODIFY.getModel(modify).then(function (req) {
            var data = req.response.data;
            $Loading.show({class: data.success ? MSGICON.success : MSGICON.fail, text: data.message}, 1500);
            $event.target.disabled = false;
            data.success && $timeout(function () {
              $rootScope.$currentModal && $rootScope.$currentModal._hide();
              $ionicSideMenuDelegate.toggleLeft(false);
            }, 10);
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
          var parameter = {type: 'forgetpwdsms', mobile: $scope.modify.phone, codeyz: $scope.modify.code};
          PHONE_CODE.getModel(parameter).then(function (req) {
            var data = req.response.data;
            $Loading.show(msg[data], 2000);
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
      }
    )
});
