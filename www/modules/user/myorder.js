'use strict';


angular.module('freexf')
  .controller('myorder_ctrl', function ($scope, $rootScope, $http, $injector, $state, $ionicLoading, $timeout, AUTH, ENV, OrderList, DelOrder, $ionicScrollDelegate, DelMyFavoriteRepository) {
      var count = 0;
      var pageMax = 5;
      $scope.haveNull = false;
      $scope.uppageshow = false;
      $scope.bottomtext = ''
      $scope.userData = AUTH.FREEXFUSER.data;
      //获取订单列表
      $scope.$on('$ionicView.loaded', function () {
      });
      var orderlistitem = OrderList(ENV._api.__orderList);
      orderlistitem.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "isPay": "true", "pageIndex": count, "pageMax": pageMax }).then(function (res) {
          $scope.orderlist = res.response.data;
          if ($scope.orderlist.isPay) {

              $scope.myVar = "交易成功";
          } else {
              $scope.myVar = "等待付款";
          };
          //是否有订单
          if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
              //没有订单，提示一句话
              $scope.haveNull = true;

          } else {
              $ionicScrollDelegate.scrollTop();
              //分页初始化
              count = 0;
              $scope.haveNull = false;
              $scope.orderlist = res.response.data;
              $scope.uppageshow = true;
          };
          //下拉分页
          $scope.doRefresh = function () {
              count += 1;
              orderlistitem.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "isPay": "true", "pageIndex": count, "pageMax": pageMax }).then(function (res) {
                  $scope.orderlist = res.response.data;
                  if ($scope.orderlist.length < count * pageMax && count > 0) {
                    $scope.uppageshow = false;
                    $scope.bottomtext = '没有更多!'
                  }
                  $scope.$broadcast('scroll.infiniteScrollComplete');
                })
          };
          
      });
      
      //删除订单
      var item;
      var DelOrderList = DelOrder(ENV._api.__delorder);
      $scope.delOrderList = function (OrderId) {
        
        DelOrderList.postModel({ "Sign": $scope.userData.Sign, "OrderId": OrderId, "studentId": $scope.userData.rowId }).then(function (res) {
            //取消
            $scope.orderlist.splice($scope.orderlist.indexOf(item), 1);
        });
        orderlistitem.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "isPay": "true", "pageIndex": count, "pageMax": pageMax }).then(function (res) {
            $scope.orderlist = res.response.data;
        });
        
      };
      
      
  })
