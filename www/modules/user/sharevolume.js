/**
 * Created by wangjunkai on 2016/12/6.
 */
'use strict';

angular.module('freexf')
  .controller('sharevolume_ctrl', function ($scope, $timeout, $ionicPopup, $Loading, $ionicLoading, $q, $state, AUTH, MSGICON) {

    $scope.auth = AUTH.FREEXFUSER.data;
    //分享卷接口列表
    var shareDiscountList = 'Coupon.GetShareDiscountList',
      studentCouponList = 'Coupon.GetStudentCouponList',
      addStudentCoupon = 'Coupon.AddStudentCoupon';

    //分享卷模板类型
    $scope.templates = {
      usable: {tpl: 'volume_usable.html', num: 0, type: 'usable', name: '可用优惠劵', url: 'volume_usable.html', data: {}},
      inactive: {
        tpl: 'volume_inactive.html',
        num: 1,
        type: 'inactive',
        name: '未激活优惠劵',
        url: 'volume_inactive.html',
        data: {}
      },
      other: {tpl: 'volume_other.html', num: 1, type: 'other', name: '其他优惠劵', url: 'volume_other.html', data: {}}
    };

    //设置各模板的状态
    $scope.templateImg = {
      '未激活': 'img/shareVolume/zuofei.png',
      '已失效': 'img/shareVolume/zuofei.png',
      '已使用': 'img/shareVolume/shiyong.png',
      '已过期': 'img/shareVolume/guoqi.png'
    };
    function setInit(data, type) {
      for (var i = 0; i < data.length; i++) {
        data[i].GetDate&&(data[i].GetDate = new Date(data[i].GetDate).getTime());
        data[i].EndDate&&(data[i].EndDate = new Date(data[i].EndDate).getTime());
        if (type == 'other') {
          data[i].imgbg = $scope.templateImg[data[i].Status];
        }
        if (type != 'usable') {
          data[i].btntype = 'not-use';
        }
      }
      return data;
    }

    $scope.setVolumeType = function (type) {
      $scope.template = $scope.templates[type];
      var Status = $scope.templates[type] && $scope.templates[type].num;
      getdata(studentCouponList, {StudentId: $scope.auth.rowId, Status: Status}).then(function (data) {
        $scope.template.data = setInit(data, type);
      });
    };
    $scope.setVolumeType.call(null, 'usable');

    //设置当前分享卷
    getdata(shareDiscountList, {})
      .then(function (data) {
        $scope.volumes = data;
        $scope.volume = $scope.volumes[0];
      });
    $scope.volume = {};
    $scope.setVolume = function (type) {
      $timeout(function () {
        $scope.volume = $scope.volumes[type];
      }, 0)
    };

    //分享卷弹窗
    $scope.shareModal = {
      StudentId: $scope.auth.rowId,
      Mobile: '',
      DiscountId: '',
      NickName: '',
      tailMobile: ''
    };
    $scope.$watch('shareModal.Mobile', function (newval, oldval) {
      var val = '';
      if (newval && newval.length == 11 && newval != oldval) {
        val = newval.substring(newval.length - 4);
      }
      $scope.shareModal.tailMobile = val;
    });
    $scope.myPopup = {};
    $scope.$on('$ionicView.beforeLeave', function () {
      for (var i in $scope.myPopup) {
        $scope.myPopup[i] && $scope.myPopup[i].close();
      }
    });
    $scope.shareVolume = function () {
      $scope.myPopup.shareVolume = $ionicPopup.confirm({
        title: '分享优惠劵',
        cssClass: 'freexf-agreement shareVolume-share-content',
        templateUrl: 'volume_share.html',
        scope: $scope,
        buttons: [
          {
            text: "取消",
            onTap: function (e) {
            }
          },
          {
            text: "立即领取",
            type: 'button-balanced',
            onTap: function (e) {
              e.preventDefault();
              $scope.shareModal.DiscountId = $scope.volume.DiscountId;
              function de(){
                var defer = $q.defer();
                if ($scope.shareModal.Mobile && $scope.shareModal.NickName) {
                  var phone = new RegExp(/^(1[0-9][0-9]|99[0-9])[0-9]{8}$/gi);
                  if (!phone.test($scope.shareModal.Mobile)) {
                    defer.resolve("请输入正确的手机号!");
                  } else {
                    getdata(addStudentCoupon, $scope.shareModal).then(function (data) {
                      if(data){
                        defer.resolve("邀请已发送!");
                        $scope.setVolumeType.call(null, 'usable');
                        $timeout(function(){
                          $scope.myPopup.shareVolume.close();
                        },1000);
                      }else{
                        defer.resolve("该手机号已经被使用过了!");
                      }
                    });
                  }
                } else {
                  defer.resolve('手机号和昵称不能为空!');
                }
                return defer.promise;
              }
              de().then(function(msg){
                $Loading.show({text: msg, class: MSGICON.fail}, 1500);
              },function(){});
            }
          }
        ]
      });
    };

    $scope.toUse = function () {
      $state.go('tab.course');
    };
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


  });
