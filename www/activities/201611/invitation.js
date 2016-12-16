'use strict';

angular.module('freexf')
  .controller('invitation_ctrl', function ($scope, $rootScope, $injector, $fxModal, $location, $state, $ionicPopup, $ionicLoading, AUTH, ENV) {

    var goalsplit = window.location.href.replace("http://", "");
    var domainname = goalsplit.substr(0, goalsplit.indexOf("/"));
    var tgID = typeof (AUTH.FREEXFUSER.data.rowId) != 'undefined' ? AUTH.FREEXFUSER.data.rowId : ''
    var myUrl = "http://" + domainname + '/mobile/www/index.aspx#/register?s=' + tgID + 'ends'   //获取url链接
    yaoqingimg(myUrl);    //生成二维码
    var canvas = $('#code canvas').get(0);
    var codeImg = convertCanvasToImage(canvas);
    $scope.text = "登录获得我的好友邀请链接";
    $scope.userData = AUTH.FREEXFUSER.data;   //用户信息
    $rootScope.$on('auth:update', function (event, auth) {
      $scope.userData = auth;
      $scope.islogin = $scope.userData.userLg ? true : false;
      $scope.text = $scope.userData.userLg ? "获得我的好友邀请链接" : "登录获得我的好友邀请链接";
      goalsplit = window.location.href.replace("http://", "");
      domainname = goalsplit.substr(0, goalsplit.indexOf("/"));
      tgID = typeof (AUTH.FREEXFUSER.data.rowId) != 'undefined' ? AUTH.FREEXFUSER.data.rowId : ''
      myUrl = "http://" + domainname + '/mobile/www/index.aspx#/register?s=' + tgID + 'ends'   //获取url链接
      yaoqingimg(myUrl);    //生成二维码
      canvas = $('#code canvas').get(0);
      codeImg = convertCanvasToImage(canvas);
    })
    $scope.kingList = ["15821076512", "13801877916", "18516614809", "13651962064", "15601625899", "18717778139", "13817506280", "15000708549", "15000415105", "15618718909"];
    //登陆注册modal
    $fxModal.init($scope).then(function (modal) {
      $scope.modal = modal;
    });
    var getUrlData = '/Entrace/Dispatch.aspx?FunctionName=Activity.GetInvitationPhone&Version=1&EndClientType=H5&Key=""&JsonPara={}';
    $.ajax({
      type: 'POST',
      cache: 'false',
      url: getUrlData,
      dataType: "json",
      success: function (data) {
        $scope.$apply(function () {
          if (data.length > 0) {
            $scope.kingList = data.concat($scope.kingList);
            $scope.kingList = $scope.kingList.splice(0, 10);
          }
        });
      }
    });

    $scope.text = $scope.userData.userLg ? "获得我的好友邀请链接" : "登录获得我的好友邀请链接";

    //好友邀请链接
    $scope.showDialog = function () {
      $state.otherGo('login', function () {
        if ($scope.userData.userLg) {
          showCode();
        } else {
          $scope.modal.openModal('login');
        }
      }, null);
    }
    function showCode() {
      var confirmPopup = $ionicPopup.confirm({
        title: '',
        cssClass: 'invitefriends-dialog',
        template: '<img src="activities/img/invitefriends/dialog.png" />'
        + '<div class="box">'
        + '<h2>我的邀请好友链接：</h2>'
        + '<textarea id="shareLinkInput" >' + myUrl + '</textarea>'
        + '<div class="qcode">'
        + '<p>复制框内链接或截取下列二维码</p>'
        + '<div class="code"><img src="' + codeImg.src + '"/></div>'
        + '</div>'
        + '</div>',
        buttons: [
          {
            text: "拒绝",
            onTap: function (e) {
            }
          }
        ]
      });
    };
    //生成邀请码
    function yaoqingimg(codeurl) {
      $('#code').html("");
      var code = $("#code");
      code.qrcode({
        width: 126, //宽度
        height: 126, //高度
        text: codeurl
      });
    }

    //canvas转化成图片
    function convertCanvasToImage(canvas) {
      if (canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
      }
    }
  })
  .filter('phoneFilter', function () {
    return function (item) {
      if (item) {
        return item.substring(0, 3) + '****' + item.substring(7, 11);
      } else {
        return item;
      }

    }
  })
  .filter('nameFilter', function () {
    return function (item) {
      switch (item) {
        case 0:
          return '第一名';
          break;
        case 1:
          return '第二名';
          break;
        case 2:
          return '第三名';
          break;
        case 3:
          return '第四名';
          break;
        case 4:
          return '第五名';
          break;
        case 5:
          return '第六名';
          break;
        case 6:
          return '第七名';
          break;
        case 7:
          return '第八名';
          break;
        case 8:
          return '第九名';
          break;
        case 9:
          return '第十名';
          break;
      }
    }
  });
