'use strict';


angular.module('freexf')
  .controller('login_ctrl', function ($scope, $rootScope, $state, $injector, $ionicLoading, $timeout, AuthRepository) {
    var LOGIN = AuthRepository('AjaxLogin.aspx', '/ajax');

    function loginModel() {
      this.login = {
        phone: '',
        password: ''
      };
      return this.login;
    }

    $scope.login = new loginModel();
    //登录
    $scope.toLogin = function ($event) {
      var login = $scope.login;

      LOGIN.getModel(login).then(function (req) {
        $scope.login = new loginModel();
        if (req.response.data.success) {
          $rootScope.user = true;
          $state.go('tab.member');
        }
      })
    };
  });

