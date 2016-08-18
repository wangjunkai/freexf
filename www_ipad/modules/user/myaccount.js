'use strict';

angular.module('freexf')
  .controller('myaccount_ctrl', function ($scope, $rootScope, $state, $location, $ionicSideMenuDelegate, $timeout, $frModal, $ionicModal, $freexfUser, ENV, getuserinf, UpdateUserValue, MyAccountCrouseRepository) {
    //初始化接口
    var GetUserinf = getuserinf(ENV._api.__getuserinformation);
    var UpdataValue = UpdateUserValue(ENV._api.__UpdateNewValue);
    var getMyAccount = MyAccountCrouseRepository(ENV._api.__myAccountCrouse);

    $scope.auth = $freexfUser.auth();

    //初始化用户信息
    function myuserModel() {
      this.my = {
        nickname: '',
        sex: '',
        name: '',
        mobile: ''
      };
      return this.my;
    }

    //初始化
    $scope.myuser = new myuserModel();
    $scope.userImformation = new myuserModel();
    var myUrl = $location.absUrl();
    $scope.readonly = true;
    $scope.ImgBoxShow = false;
    $scope.checkWomen = false;
    $scope.checkMan = false;
    $scope.checkNobody = false;
    $scope.canPopup = false;
    $scope.shareUrl = myUrl;
    $scope.userImage = "";
    //tabs

    //侧边栏
    $scope.showMenu = function ($event) {
      $ionicSideMenuDelegate.toggleLeft();
    };

    //未登录时的操作
    function nologin() {

    }

    //登录后的操作
    function islogin(res) {
      //获取用户信息列表
      $scope.myuser = res.response.data[0] || new myuserModel();
      $scope.userImformation = res.response.data[1] || new myuserModel();
      $scope.updateImg($scope.myuser.sex, true);
      autoInput();
      if (!$scope.myuser.nickname == '') {
        $scope.iscode = true;
      }
      getMyAccount.getModel({'Sign': $scope.auth.Sign, 'studentId': $scope.auth.rowId}).then(function (res) {
        var recommend = res.response.data.ls_recommendlist,
          elite = res.response.data.ls_Elitelist;
        elite.shift();
        $scope.recommendlist = recommend.length>0?recommend:recommend.concat(elite);
        $scope.MyCourse = res.response.data.ls_MyCourses;
      });
    }

    $scope.changeName = function (b) {
      $("#updateUserName")[0].readOnly = b;
      $("#updateUserName").trigger('focusin');
    };
    //修改头像,点击显示/隐藏 修改图像的区域
    $scope.ChangeUserImg = function () {
      $scope.ImgBoxShow = !$scope.ImgBoxShow;
      $scope.canPopup = !$scope.canPopup;
    };
    //点击空白处修改图像框隐藏
    $scope.cancelPopup = function () {
      $scope.ImgBoxShow = false;
      $scope.canPopup = false;
    };
    var man = {
      '': "background-position:-52px -104px;",
      '男': "background-position:-217px -102px",
      '女': "background-position:-52px -190px"
    };
    $scope.updateImg = function (a, New) {
      $scope.myuser.sex = a;
      $scope.userImage = man[a];
      New || UpdataValue.postModel({
        'freexfPara': $scope.userImformation.sex,
        'NewValue': $scope.myuser.sex
      }).then(function (res) {
        //隐藏图片框
        if (res.response.data == "success") {
          $scope.ImgBoxShow = false;
          $scope.canPopup = false;
        }
      });
    };
    $scope.manactive = '';
    $scope.setactive = function (a) {
      return a == $scope.manactive;
    };
    $scope.goStudy = function (courseId, state) {
      $state.go('coursedetail', {courseId: courseId, state: state});
    };

    var modal_ary = {
      login: {
        scope: $scope,
        ctrlUrl: 'modules/user/login',
        tempUrl: 'modules/user/login.html'
      }
    };
    $scope.openModal = function (name, data, back) {
      $frModal.openModal($scope, name, modal_ary, data, back);
    };

    //监听是否是登陆状态
    $rootScope.$on('auth:update', function (event, auth) {
      $scope.auth = auth;
    });
    $scope.$watch('auth.userLg', function (val) {
      if (val) {
        GetUserinf.getModel({'sign': $scope.auth.Sign, 'rowid': $scope.auth.rowId}).then(function (res) {
          if (res.response.data.length <= 0) {
            $freexfUser.toQuit();
          } else {
            islogin(res);
          }
        });
      } else {
        nologin();
      }
    });
    //监听用户名是否改变
    $scope.$watch('myuser.nickname', function (newname, old) {
      newname === old || UpdataValue.postModel({
        'freexfPara': $scope.userImformation.nickname,
        'NewValue': $scope.myuser.nickname
      }).then(function (res) {
      });
    });
    $scope.$on('$destroy', function (event) {
        debugger
      }
    );
    //修改名称input自适应宽度
    function autoInput() {
      var name = $('#updateUserName');
      var loginInput = function () {
        var a, l;
        a = name.css('font-size').replace(/px/, '');
        l = parseInt(a);
        $(name.val().split('')).each(function (index, value) {
          l = l + parseFloat((/[\u4E00-\u9FA5]/.test(value) ? a / 1 : a / 2).toFixed(1))
        });
        name.val() ? name.width(l) : name.removeAttr('style');
      };
      var updateName = function () {
        UpdataValue.postModel({
          'freexfPara': $scope.userImformation.nickname,
          'NewValue': $scope.myuser.nickname
        }).then(function (res) {

        });
      };
      name.on('keyup', function () {
        loginInput();
        updateName();
      });
      name.val() && loginInput();
    }
  });
