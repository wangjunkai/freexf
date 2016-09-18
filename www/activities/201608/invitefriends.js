'use strict';

angular.module('freexf')
  .controller('invitefriends_ctrl', function ($scope, $rootScope, $injector, $location, $state, $ionicPopup, $ionicLoading, AUTH, ENV) {
      var goalsplit = window.location.href.replace("http://", "");
      var domainname = goalsplit.substr(0, goalsplit.indexOf("/"));
      var tgID=typeof (AUTH.FREEXFUSER.data.rowId) != 'undefined' ? AUTH.FREEXFUSER.data.rowId : ''
      var myUrl = "http://" + domainname + '/mobile/www/index.aspx#/register?s=' + tgID + 'ends'   //获取url链接
      yaoqingimg(myUrl);    //生成二维码
      var canvas = $('#code canvas').get(0);
      var codeImg = convertCanvasToImage(canvas);
      $scope.userData = AUTH.FREEXFUSER.data;   //用户信息

      var getUrlData = '/Entrace/Dispatch.aspx?FunctionName=Student.RecommendStatistics&Version=1&EndClientType=H5&Key=""&JsonPara={}';
      $.ajax({
          url: getUrlData,
          data: {},
          type: "GET",
          dataType: "json",
          success: function (data) {
              $scope.kingList = data.length > 10 ? data.splice(0, 10) : data;
          }
      });
      

      //好友邀请链接
      $scope.showDialog = function () {
          if ($scope.userData.userLg) { //判断登录
              showCode();
          }else {
              location.href = "#/login";
          }          
      }
      function showCode(){
          var confirmPopup = $ionicPopup.confirm({
              title: '',
              cssClass: 'invitefriends-dialog',
              template: '<img src="activities/img/invitefriends/dialog.png" />'
                        +'<div class="box">'                        
                        + '<h2>我的邀请好友链接：</h2>'
                        + '<textarea id="shareLinkInput" >' + myUrl + '</textarea>'
                        + '<div class="qcode">'
                        + '<p>复制框内链接或截取下列二维码</p>'
                        + '<div class="code"><img src="' + codeImg.src + '"/></div>'
                        +'</div>'
                        +'</div>',
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
          var code = $("#code");
          code.qrcode({
                  width: 126, //宽度
                  height: 126, //高度
                  text: codeurl
              });
      }
      //canvas转化成图片
      function convertCanvasToImage(canvas) {
          var image = new Image();
          image.src = canvas.toDataURL("image/png");
          return image;
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
        return item ? item : '小鹿';
    }
});