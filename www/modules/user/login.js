'use strict';


angular.module('freexf')
  .controller('login_ctrl', function ($scope, $rootScope, $Loading, $timeout, $state, $ionicHistory, AUTH, MSGICON, localStorageService, AuthRepository) {
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
    $scope.toLogin = function ($event, $form) {
      if ($form.$invalid) return false;
      var login = angular.extend({}, $scope.login);
      delete login.rememberPw;
      var loginSign = '{"phone":"' + $scope.login.phone + '","password":"' + $scope.login.password + '"}';
      loginSign = Base64.encode(loginSign);
      $Loading.show({class: MSGICON.load, text: '登录中...'}, false);
      AUTH.toLogin(loginSign).then(function (req) {
        var data = req.response.data;
        $Loading.show({
          class: data.success ? MSGICON.success : MSGICON.fail,
          text: data.success ? '登录成功!' : data.message
        }, 1500);
        if (data.success) {
          $scope.freexfUser = {
            Sign: req.response.data['Sign'],
            rowId: req.response.data['rowId'],
            rememberPw: $scope.login.rememberPw,
            password: $scope.login.rememberPw ? $scope.login.password : null,
            phone: $scope.login.phone,
            userLg: true
          };

          if ($scope.modal && $scope.modal['login']) {
            $scope.modal['login'].remove();
          } else {
            $timeout(function () {
              var _backView = ['register'];
              if ($ionicHistory.backView() && $.inArray($ionicHistory.backView().stateName, _backView) < 0) {
                $ionicHistory.goBack();
              } else {
                $state.go('tab.home');
              }
            }, 10)
          }
        }
      })
    };
    $scope.register = function () {
      if ($scope.modal && $scope.modal['register']) {
        $scope.modal['login'].hide();
        $scope.modal.openModal('register');
      } else {
        $state.go('register');
      }
    }

    $scope.$watch('freexfUser', function (newval, oval) {
      if (newval == oval && newval == undefined) {
        return;
      }
      localStorageService.set(AUTH.FREEXFUSER.name, newval);
      AUTH.FREEXFUSER.data = newval ? newval : AUTH.FREEXFUSER.data;
      $rootScope.$broadcast('auth:update', AUTH.FREEXFUSER.data);
    });
  });






