'use strict';

define(function () {
  angular.module('freexf')
    .controller('login_ctrl', function ($scope, $rootScope, $Loading, $timeout, $state, $ionicHistory, $frModal, $freexfUser, MSGICON, localStorageService, AuthRepository) {
      var LOGIN = AuthRepository('AjaxLogin.aspx', '/ajax');

      function loginModel() {
        this.login = {
          phone: '',
          password: '',
          rememberPw: false
        };
        return this.login;
      }

      $scope.login = $freexfUser.auth() || (new loginModel());

      //登录
      $scope.toLogin = function ($event, $form) {
        if ($form.$invalid)return false;
        var login = angular.extend({}, $scope.login);
        delete login.rememberPw;
        var loginSign = '{"phone":"' + $scope.login.phone + '","password":"' + $scope.login.password + '"}';
        loginSign = Base64.encode(loginSign);

        $Loading.show({class: MSGICON.load, text: '登录中...'}, false);
        LOGIN.getModel({"sign": loginSign}).then(function (req) {
          var data = req.response.data;
          $Loading.show({
            class: data.success ? MSGICON.success : MSGICON.fail,
            text: data.success ? '登录成功!' : data.message
          }, 1500);
          if (data.success) {
            var freexfUser = {
              Sign: req.response.data['Sign'],
              rowId: req.response.data['rowId'],
              rememberPw: $scope.login.rememberPw,
              password: $scope.login.rememberPw ? $scope.login.password : null,
              phone: $scope.login.phone,
              userLg: true
            };

            $freexfUser.setUser(freexfUser);
            localStorageService.set($freexfUser.name(), $freexfUser.auth());

            $timeout(function () {
              if ($scope.$modal._backModal()) {
                $scope.$modal._back();
              } else {
                $scope.$modal._remove();
              }
            }, 10)
          }
        })
      };

      var modal_ary = {
        register: {
          scope: $scope,
          ctrlUrl: 'modules/user/register',
          tempUrl: 'modules/user/register.html'
        },
        forgetpassword: {
          scope: $scope,
          ctrlUrl: 'modules/user/forgetpassword',
          tempUrl: 'modules/user/forgetpassword.html'
        }
      };
      $scope.openModal = function (name, data, back) {
        $frModal.openModal($scope, name, modal_ary, data, back);
      };
    })
});

