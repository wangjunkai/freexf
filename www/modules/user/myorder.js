'use strict';


angular.module('freexf')
  .controller('myorder_ctrl', function ($scope, $rootScope, $http, $injector,  $state, $ionicLoading, $timeout, AUTH, ENV, OrderList, DelOrder, $ionicScrollDelegate, DelMyFavoriteRepository,RealTimeUpdate) {
      var count = 0;
      var pageMax = 6;
      $scope.haveNull = false;
      $scope.uppageshow = false;
      $scope.study = false;
      $scope.payOrder = true;
      $scope.bottomtext = '';
      $scope.userData = AUTH.FREEXFUSER.data;
      $scope.orderlist = [];
      var orderlistitem = OrderList(ENV._api.__orderList);
      var GetRealTimeUpdate = RealTimeUpdate(ENV._api.__RealTimeUpdate)
      //获取订单列表
      $scope.$on('$ionicView.loaded', function () {
      });
      //定义符合页面的orderlist
      var orderlistInfo = function (data) {
          var list = [];
          for (var i = 0; i < data.length; i++) {
              var isShow = true;
              if (data[i].IsCanceled == true) {
                  //不显示
                  isShow = false;
              }


              //定义默认值
              var item = {
                  "OrderId": data[i].OrderId,
                  "SetOrderTime": data[i].SetOrderTime,
                  "image": data[i].Image,
                  "ProductName": data[i].ProductName,
                  "teachername": data[i].teachername,
                  "deadline": data[i].deadline,
                  "hour": data[i].hour,
                  "price": data[i].price,
                  "ProductId": data[i].ProductId,
                  "orderRowid": data[i].orderRowid,
                  "status": data[i].status,
                  "isDelivery": data[i].isDelivery,
                  "ispay": data[i].ispay,
                  "IsCanceled": data[i].IsCanceled,
                  "Lstatus":data[i].Lstatus,
                  //后加自定义属性 ，并给其默认值
                  "myVar": "",
                  "ispayAddress": "",
                  "istatus": "",
                  "again": "",
                  "study": true,
                  "payOrder": true,
                  "IsCancel": isShow,
                  "goredetail": true

              };
              //判断是否有收货地址
              if (data[i].isDelivery == 1) {
                  item.ispayAddress = true;
              } else {
                  item.ispayAddress = false;
              }
              //判断是否支付
              if (data[i].ispay == 0) {
                  //等待付款 逻辑
                  item.myVar = "等待付款";
                  item.study = false;
                  item.payOrder = true;
              }
              else if (data[i].ispay == 1) {
                  if (data[i].IsCanceled.toLowerCase() == "true") {
                      //过期 逻辑
                      item.myVar = "交易过期";
                      
                      if (data[i].Lstatus == true) {
                          item.istatus = true;
                          item.again = false;
                      } else {
                          item.istatus = false;
                          item.again = true;
                      }
                      item.redetail = true;
                      item.study = false;
                      item.payOrder = false;
                  }
                  else {
                      //播放逻辑
                      item.myVar = "交易成功";
                      item.study = true;
                      item.payOrder = false;

                      

                  }
              }              
              list.push(item);
          }
          
          return list;
          
      }      
      orderlistitem.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "pageIndex": count, "pageMax": pageMax }).then(function (res) {
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
              $scope.orderlist = $scope.orderlist.concat(orderlistInfo(data));
              if ($scope.orderlist.length < count * pageMax && count > 0) {
                  $scope.uppageshow = false;
                  $scope.bottomtext = '没有更多!'
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');
          })
      };
      //去学习
      $scope.goStudy = function (ProductId, state, Lstatus) {
          if (Lstatus == false) {              
              $state.go('coursedetail', { courseId: ProductId, state: state });
          }         
      };
      //过期，去详情
      $scope.goredetail = function (ProductId) {
          $state.go('coursedetail', { courseId: ProductId });
      };
      //查看订单详情
      $scope.goOrderDetail = function (OrderId) {
          $state.go('payaddress', { OrderId: OrderId });
      };
      //去支付
      $scope.gopay = function (ProductId, orderRowid) {
          //GetRealTimeUpdate.postModel({ "ProductId": ProductId, "studentid": $scope.userData.rowId, "orderid": orderRowid }).then(function (res) {
          //    var data = res.response.data;
          //    if (data) {
                  $rootScope.paycourseId = ProductId;
                  location.href = "#/pay";
              //} else {
              //    count = 0;
              //    orderlistitem.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "pageIndex": count, "pageMax": pageMax }).then(function (res) {
              //        var data = res.response.data;
              //        //是否有订单
              //        if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
              //            //没有订单，提示一句话
              //            $scope.haveNull = true;

              //        } else {
              //            $ionicScrollDelegate.scrollTop();
              //            //分页初始化

              //            count = 0;
              //            $scope.haveNull = false;
              //            $scope.orderlist = orderlistInfo(data);
              //            $scope.uppageshow = true;
              //        };
              //    });
              //}
          //})
          
      };

      //删除订单
      var item;
      var DelOrderList = DelOrder(ENV._api.__delorder);
      $scope.delOrderList = function (OrderId) {
          DelOrderList.postModel({ "Sign": $scope.userData.Sign, "OrderId": OrderId, "studentId": $scope.userData.rowId }).then(function (res) {
            var data = res.response.data;
            $scope.orderlist = orderlistInfo(data);
            if ($scope.userData.Sign == "" && OrderId == "" && $scope.userData.rowId == "") {
                $scope.orderlist.splice($scope.orderlist.indexOf(item), 1);
            }
            //取消
            $scope.orderlist.splice($scope.orderlist.indexOf(item), 1);
            //取消后订单再刷新下页面
            count = 0;
            orderlistitem.getModel({ "studentId": $scope.userData.rowId, "Sign": $scope.userData.Sign, "pageIndex": count, "pageMax": pageMax }).then(function (res) {
                var data = res.response.data;
                $scope.orderlist = orderlistInfo(data);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].IsCanceled == true) {
                        //不显示
                        $scope.IsCancel = false;
                    }
                }
                var data = res.response.data;
                $scope.orderlist = orderlistInfo(data);
            });
      });
     };

  })

