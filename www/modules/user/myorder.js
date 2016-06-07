'use strict';


angular.module('freexf')
  .controller('myorder_ctrl', function ($scope, $rootScope, $http, $injector, $state, $ionicLoading, $timeout, AUTH, ENV, OrderList, DelOrder, $ionicScrollDelegate, DelMyFavoriteRepository) {
      var count = 0;
      var pageMax = 5;
      $scope.haveNull = false;
      $scope.uppageshow = false;
      $scope.study = false;
      $scope.payOrder = true;
      $scope.bottomtext = '';
      $scope.userData = AUTH.FREEXFUSER.data;
      //获取订单列表
      $scope.$on('$ionicView.loaded', function () {
      });
      //定义符合页面的orderlist
      var orderlistInfo = function (data) {
          var list = [];
          //判断是否支付
          for (var i = 0; i < data.length; i++) {
              if (data[i].ispay) {
                  list.push({
                      "OrderId": data[i].OrderId,
                      "SetOrderTime": data[i].SetOrderTime,
                      "image": data[i].image,
                      "ProductName": data[i].ProductName,
                      "teachername": data[i].teachername,
                      "deadline": data[i].deadline,
                      "hour": data[i].hour,
                      "price": data[i].price,
                      "ProductId": data[i].ProductId,
                      //后加自定义属性                  		
                      "myVar": "交易成功",
                      study: true,
                      payOrder: false

                  });
              } else {
                  list.push({
                      "OrderId": data[i].OrderId,
                      "SetOrderTime": data[i].SetOrderTime,
                      "image": data[i].image,
                      "ProductName": data[i].ProductName,
                      "teachername": data[i].teachername,
                      "deadline": data[i].deadline,
                      "hour": data[i].hour,
                      "price": data[i].price,
                      "ProductId": data[i].ProductId,
                      //后加自定义属性                  		
                      "myVar": "等待付款",
                      study: false,
                      payOrder: true
                  });
              };
          }
          return list;
      }
      var orderlistitem = OrderList(ENV._api.__orderList);
      orderlistitem.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign,  "pageIndex": count, "pageMax": pageMax }).then(function (res) {
          var data = res.response.data;
          //是否有订单
          if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
              //没有订单，提示一句话
              $scope.haveNull = true;

          } else {
              $ionicScrollDelegate.scrollTop();
              //分页初始化
              count = 0;
              $scope.haveNull = false;
              $scope.orderlist = orderlistInfo(data);
              $scope.uppageshow = true;
          };
      });
      //下拉分页
      $scope.doRefresh = function () {
          count += 1;
          orderlistitem.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "pageIndex": count, "pageMax": pageMax }).then(function (res) {
              var data = res.response.data;
              $scope.orderlist = orderlistInfo(data);
              if ($scope.orderlist.length < count * pageMax && count > 0) {
                  $scope.uppageshow = false;
                  $scope.bottomtext = '没有更多!'
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');
          })
      };
      //去学习
      $scope.goStudy = function (ProductId) {
          alert(ProductId)
          $state.go('coursedetail', { courseId: ProductId });
      }
      //查看订单详情
      $scope.goStudy = function (OrderId) {
          $state.go('payaddress', { OrderId: OrderId });
      }
      //删除订单
      var item;
      var DelOrderList = DelOrder(ENV._api.__delorder);
      $scope.delOrderList = function (OrderId) {
            DelOrderList.postModel({ "Sign": $scope.userData.Sign, "OrderId": OrderId, "studentId": $scope.userData.rowId }).then(function (res) {
                //取消
                $scope.orderlist.splice($scope.orderlist.indexOf(item), 1);
                

      });
      //orderlistitem.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "pageIndex": count, "pageMax": pageMax }).then(function (res) {
      //          var data = res.response.data;
      //          $scope.orderlist = orderlistInfo(data);
      //});
      };
      
  })
