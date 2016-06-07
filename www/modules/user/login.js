'use strict';


angular.module('freexf')
  .controller('login_ctrl', function ($scope, $rootScope, $state, $injector, $ionicLoading, $Loading, $timeout,$ionicHistory, AUTH, localStorageService, AuthRepository) {
    var LOGIN = AuthRepository('AjaxLogin.aspx', '/ajax');
    function loginModel() {
      this.login = {
        phone: '',
        password: '',
        rememberPw: false
      };
      return this.login;
    }
    $scope.login = AUTH.FREEXFUSER.data ? AUTH.FREEXFUSER.data : (new loginModel());

    //登录
    $scope.toLogin = function ($event) {
      var login = angular.extend({}, $scope.login);
      delete login.rememberPw;
      $Loading.show({class: 'ion-alert-circled', text: '登陆中...'}, false);
      LOGIN.getModel(login).then(function (req) {
        var data = req.response.data;
        $Loading.show({class: 'ion-alert-circled', text: data.success ? '登陆成功!' : '登陆失败!'}, 1500);
        if (data.success) {
          $scope.freexfUser = {
            Sign: req.response.data['Sign'],
            rowId: req.response.data['rowId'],
            rememberPw: $scope.login.rememberPw,
            password: $scope.login.rememberPw ? $scope.login.password : null,
            phone: $scope.login.phone,
            userLg: true
          };
          $timeout(function () {
              $ionicHistory.goBack()
          },10)
        }
      })
    };

    $scope.$watch('freexfUser', function (value) {
      localStorageService.set(AUTH.FREEXFUSER.name, value);
      AUTH.FREEXFUSER.data = value ? value : AUTH.FREEXFUSER.data;
    });

  });

