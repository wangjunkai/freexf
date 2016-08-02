angular.module('freexf', ['ionic'])
  .controller('member_ctrl', function ($scope, $rootScope, $injector, $location, $ionicPopup, $ionicLoading, $ionicModal, $timeout, $state, AUTH, ENV, getuserinf, UpdateUserValue, MyAccountCrouseRepository) {

    var user = {
      sign: AUTH.FREEXFUSER.data.Sign,
      rowid: AUTH.FREEXFUSER.data.rowId
    };

    function myuserModel() {
      this.my = {
        nickname: '',
        sex: '',
        name: '',
        mobile: ''
      };
      return this.my;
    }

    $scope.myuser = new myuserModel();
    $scope.userImformation = new myuserModel();

    var GetUserinf = getuserinf(ENV._api.__getuserinformation);
    var UpdataValue = UpdateUserValue(ENV._api.__UpdateNewValue);
    var getMyAccount = MyAccountCrouseRepository(ENV._api.__myAccountCrouse);
    //初始化
    var myUrl = $location.absUrl();
    $scope.readonly = true;
    $scope.ImgBoxShow = false;
    $scope.checkWomen = false;
    $scope.checkMan = false;
    $scope.checkNobody = false;
    $scope.canPopup = false;
    $scope.shareUrl = myUrl;
    $scope.$on('$ionicView.loaded', function () {
    });
    //获取用户信息列表
    GetUserinf.getModel(user).then(function (res) {
      $scope.myuser = res.response.data[0] || new myuserModel();
      $scope.userImformation = res.response.data[1] || new myuserModel();

      if (!$scope.myuser.nickname == '') {
        $scope.iscode = true;
      }
      if ($scope.myuser.sex == '男') {
        $scope.man();
      } else if ($scope.myuser.sex == '女') {
        $scope.women();
      } else {
        $scope.nobody();
      }
    });

    getMyAccount.getModel({'Sign': user.sign, 'studentId': user.rowid}).then(function (res) {
      $scope.recommendlist = res.response.data.ls_recommendlist;
      $scope.MyCourse = res.response.data.ls_MyCourses;
      autoInput();
    });
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
      name.on('input', function () {
        loginInput();
      });
      name.val() && loginInput();
    }

      //修改名称

    $("#updateUserName")[0].readOnly = false;

    $scope.changeName = function (b) {
      $("#updateUserName")[0].readOnly = b;
      $("#updateUserName").trigger('focusin');

    };
    $scope.$watch('myuser.nickname', function (newname, old) {
      newname === old || UpdataValue.postModel({
        'freexfPara': $scope.userImformation.nickname,
        'NewValue': $scope.myuser.nickname
      }).then(function (res) {
      });
    });
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
    //女生头像
    $scope.women = function () {
      $scope.checkWomen = true;
      $scope.checkMan = false;
      $scope.checkNobody = false;
      $scope.userImage = {
        "background-position": "-52px -190px"
      };
      //修改用户name信息
      UpdataValue.postModel({'freexfPara': $scope.userImformation.sex, 'NewValue': "女"}).then(function (res) {
        //隐藏图片框
        if (ls_return = "success") {
          $scope.ImgBoxShow = false;
          $scope.canPopup = false;
        }
      });
    };
    //男生头像
    $scope.man = function () {
      $scope.checkWomen = false;
      $scope.checkMan = true;
      $scope.checkNobody = false;
      $scope.userImage = {
        "background-position": "-217px -102px"
      };
      //修改用户name信息
      UpdataValue.postModel({'freexfPara': $scope.userImformation.sex, 'NewValue': "男"}).then(function (res) {
        //隐藏图片框
        if (ls_return = "success") {
          $scope.ImgBoxShow = false;
          $scope.canPopup = false;
        }
      });
    };
    //小鹿头像
    $scope.nobody = function () {
      $scope.checkWomen = false;
      $scope.checkMan = false;
      $scope.checkNobody = true;
      $scope.userImage = {
        "background-position": "-52px -104px;"
      };
      UpdataValue.postModel({'freexfPara': $scope.userImformation.sex, 'NewValue': ""}).then(function (res) {
        //隐藏图片框
        //if (ls_return = "success") {
        $scope.ImgBoxShow = false;
        $scope.canPopup = false;
        //}
      });
    };
    $scope.goStudy = function (courseId, state) {
      $state.go('coursedetail', {courseId: courseId, state: state});
    };

    //邀请
    $ionicModal.fromTemplateUrl('showLink', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.modal.show();
      window.yqmurl = myUrl;
      yaoqingimg(window.yqmurl);
      if (myUrl == "") {
        $scope.shareUrl = "http://www.freexf.com/";
        window.yqmurl = "http://www.freexf.com/";
      }
    };
    function yaoqingimg(yqmurl) {
      var code = $("#code");
      if (!code.hasClass('on')) {
        code.addClass("on");
        code.qrcode({
          width: 125, //宽度
          height: 125, //高度
          text: yqmurl
        });
      }
    }
  });


