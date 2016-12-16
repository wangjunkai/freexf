'use strict';


angular.module('freexf')
  .controller('pay_ctrl', function ($scope, $rootScope, $state, $q, $ionicPopup, $injector, $stateParams, $ionicLoading, $timeout, AUTH, ENV, AddOrderFun, UpdateAPES, localStorageService, apes) {
    var AddOrder = AddOrderFun(ENV._api.__AddOrder);
    var studentCouponList = 'Coupon.GetStudentCouponList',
      buyCourseDiscount = 'Coupon.BuyCourseDiscount';

    $scope.userData = AUTH.FREEXFUSER.data;
    $scope.OrderId = $stateParams.OrderId;
    $scope.DiscountCode = $stateParams.DiscountCode;
    $scope.Discount = $stateParams.Discount;
    $scope.oneBuy = $stateParams.oneBuy;
    $scope.myPopup = {};
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

    //创建订单
    function createOrder() {
      AddOrder.create({
        "studentId": $scope.userData.rowId,
        "Sign": $scope.userData.Sign,
        "ProductId": $rootScope.paycourseId,
        "DiscountCode": $scope.DiscountCode
      })
        .then(function (res) {

          $scope.AddOrder = res.response.data;
          $scope.payohref = res.response.data.AliPayId;
          $scope.payoname = res.response.data.ProductName;
          $scope.needpayfee = res.response.data.NeedPayFee;
          $scope.payomoney = res.response.data.price;
          $scope.payood = res.response.data.orderFormatId;
          $scope.orderId = res.response.data.OrderId;
          $scope.SetOrderTime = res.response.data.SetOrderTime;
          $scope.orderError = false;

          apes.apesFun('APES3');
          if ($scope.payomoney == null || $scope.payoname == null || $scope.orderId == null || $scope.SetOrderTime == null) {
            $scope.orderError = true;
            $scope.payhide = true
          } else {
            $scope.payhide = false
          }
          $scope.goOrderDetail = function () {
            $state.go('payaddress', {OrderId: $scope.payood});
          };

          if ($scope.payomoney == 0) {
            $scope.mianfeiShow = true;
            setTimeout(function () {
              $scope.goOrderDetail();
            }, 3000)
          } else {
            $scope.mianfeiShow = false;
          }
          //һԪ��
          if ($scope.oneBuy == 'noChance' && $scope.needpayfee != 1) {
            $scope.onebuyhint = true;
          } else {
            $scope.onebuyhint = false;
          }

          $scope.RealTimeUpdate = function (obj) {
            var thisRurl = '/MFreeXFapi/student/RealTimeUpdate';
            var rturl = $(obj).attr('rthref');
            $.ajax({
              type: 'post',
              cache: 'false',
              url: thisRurl,
              data: 'ProductId=' + $rootScope.paycourseId + '&studentid=' + $scope.userData.rowId + '&orderid=' + $scope.payood,
              success: function (data) {
                if (data != true) {
                  $scope.$apply(function () {
                    $scope.orderError = true;
                  });
                } else {
                  window.location.href = rturl
                }
              },
              error: function (data) {
              }
            });
          };
        });
    }

    //组建当前用户的可用优惠劵
    function getCouponList() {
      getdata(buyCourseDiscount, {StudentId: $scope.userData.rowId, CourseId: $rootScope.paycourseId})
        .then(function (data) {
          if (data&&!data.CouponList) {
            data.CouponList = [];
          }
          //强制最多只显示3条
          data.CouponList.length = 3;
          data.CouponList.push($scope.Discount);
          $scope.volumes = data.CouponList;
          $scope.setVolume(data[0] ? 0 : 3);
        });
    }

    //设置当前分享卷
    $scope.volume = {};
    $scope.setVolume = function (type) {
      //跟新优惠劵状态
      $scope.volume = $scope.volumes[type];
      $scope.DiscountCode = $scope.volume.DiscountCode;
    };

    //选择优惠劵弹窗
    $scope.shareVolume = function () {
      $scope.myPopup['volume'] = $ionicPopup.confirm({
        title: '优惠劵选择',
        cssClass: 'freexf-agreement shareVolume-share-content',
        templateUrl: 'volume_share.html',
        scope: $scope,
        buttons: [
          {
            text: "取消",
            onTap: function (e) {
              $scope.DiscountCode = '';
              createOrder.call(null);
            }
          },
          {
            text: "确定",
            type: 'button-balanced',
            onTap: function (e) {
              createOrder.call(null);
            }
          }
        ]
      });
    };

    //已经下过单和已经抽过活动奖，直接走下单接口
    if (!$scope.Discount) {
      createOrder.call(null);
    } else {
      if ($scope.Discount.OrderId) {
        createOrder.call(null);
      } else {
        getCouponList.call(null);
        $scope.shareVolume();
      }
    }
    $scope.ThisWX = false;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      $scope.ThisWX = true;
    }
    $scope.goback = function () {
      history.go(-1);
    }
  });
