angular.module('freexf', ['ionic'])
  .controller('member_ctrl', function ($scope, $rootScope, $injector, $q,$location, $ionicPopup, $ionicLoading, $ionicModal, $timeout, $state, AUTH, ENV, getuserinf, UpdateUserValue, MyAccountCrouseRepository) {

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

    //初始化信息
    var GetUserinf = getuserinf(ENV._api.__getuserinformation);
    var UpdataValue = UpdateUserValue(ENV._api.__UpdateNewValue);
    var getMyAccount = MyAccountCrouseRepository(ENV._api.__myAccountCrouse);
    var studentCouponList = 'Coupon.GetStudentCouponList';
    //初始化
    var myUrl = $location.absUrl();
    $scope.readonly = true;
    $scope.ImgBoxShow = false;
    $scope.checkWomen = false;
    $scope.checkMan = false;
    $scope.checkNobody = false;
    $scope.canPopup = false;
    $scope.shareUrl = myUrl;

    //获取用户信息列表

    GetUserinf.getModel(user).then(function (res) {
      $scope.myuser = res.response.data[0] || new myuserModel();
      $scope.userImformation = res.response.data[1] || new myuserModel();
      $scope.updateImg($scope.myuser.sex, true);
      autoInput();
      if (!$scope.myuser.nickname == '') {
        $scope.iscode = true;
      }
    });
    $scope.isloading = true;

    getMyAccount.getModel({'Sign': user.sign, 'studentId': user.rowid}).then(function (res) {
      $scope.isloading = false;
      $scope.recommendlist = res.response.data.ls_recommendlist;
      $scope.MyCourse = res.response.data.ls_MyCourses.splice(0, 4);
    });
    getdata(studentCouponList, {StudentId: user.rowid, Status: 0}).then(function (data) {
      $scope.myuser.volume = data?data.length:0;
    });
    function getdata(funname, data) {
      var defer = $q.defer();
      var url = '/Entrace/Dispatch.aspx?FunctionName=' + funname + '&Version=1&EndClientType=H5&Key=""&JsonPara=' + JSON.stringify(data);
      $.ajax({
        type: 'GET',
        cache: 'false',
        url: url,
        dataType: "json",
        success: function (data) {
          defer.resolve(data);
        }
      });
      return defer.promise;
    }
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
      $('body').on('keyup','#updateUserName', function () {
        loginInput();
        updateName();
      });
      name.val() && loginInput();
    }

    //修改名称
    $("#updateUserName")[0].readOnly = false;
    $scope.changeName = function (b) {
      $("#updateUserName")[0].readOnly = b;
      $("#updateUserName").trigger('focusin');
      //return false;
      //改变值
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
      '': {
        "background-position": "-52px -104px;"
      },
      '男': {
        "background-position": "-217px -102px"
      },
      '女': {
        "background-position": "-52px -190px"
      }
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

    //去学习
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


