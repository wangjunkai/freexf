'use strict';

angular.module('freexf')
  .controller('lottery_ctrl', function ($scope, $rootScope, $injector, $location, $timeout, $state, $ionicPopup, $Loading, $stateParams, $ionicScrollDelegate, AUTH, ENV, MSGICON) {
      $('head').append('<script src="activities/js/hm.js" async=""></script>');
      htmlInit();
      $scope.courseId = $stateParams.courseId;
      $scope.userData = AUTH.FREEXFUSER.data;
      $scope.resultShow = false;    //抽奖结果
      var params = {
          CourseId: $scope.courseId,
          StudentId: $scope.userData.userLg ? $scope.userData.rowId : ''
      };
      getDiscounts(params);


      var lottery = {
          index: 0,	//当前转动到哪个位置
          count: 0,	//总共有多少个位置
          timer: 0,	//setTimeout的ID，用clearTimeout清除
          speed: 500,	//初始转动速度
          times: 0,	//转动次数
          cycle: 30,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
          prize: -1,	//中奖位置
          init: function (id) {
              if ($("#" + id).find(".lottery-unit").length > 0) {
                  var $lottery = $("#" + id);
                  var $units = $lottery.find(".lottery-unit");
                  this.obj = $lottery;
                  this.count = $units.length;
                  //$lottery.find(".lottery-unit-"+this.index).addClass("active");
              };
          },
          roll: function () {
              var index = this.index;
              var count = this.count;
              var lottery = this.obj;
              $(lottery).find(".lottery-unit-" + index).removeClass("active");
              index += 1;
              if (index > count - 1) {
                  index = 0;
              };
              $(lottery).find(".lottery-unit-" + index).addClass("active");
              this.index = index;
              return false;
          },
          stop: function (index) {
              this.prize = index;
              return false;
          }
      };

      function roll() {
          lottery.times += 1;
          lottery.roll();
          if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
              clearTimeout(lottery.timer);
              lottery.prize = -1;
              lottery.times = 0;
              $scope.$apply(function () {
                  $scope.resultShow = true;
              });
              click = false;
          } else {
              if (lottery.times < lottery.cycle) {
                  lottery.speed -= 10;
              } else if (lottery.times == lottery.cycle) {
                  var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetRandomDiscount&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + params.StudentId + '","CourseId":"' + params.CourseId + '"}';
                  var result;
                  $.ajax({
                      type: 'POST',
                      cache: 'false',
                      url: teacherList,
                      dataType: "json",
                      success: function (data) {
                          if (data) {
                              //获取中奖位置
                              if (typeof ($('.DiscountCode' + data.DiscountCode).attr('dnum')) != 'undefined') {
                                  lottery.prize = $('.DiscountCode' + data.DiscountCode).attr('dnum')
                              } else {
                                  lottery.prize = -1;
                              }
                              $scope.$apply(function () {
                                    $scope.resultData = data;
                                    $scope.result = result;
                              })
                          }
                      }
                  });
              } else {
                  if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                      lottery.speed += 110;
                  } else {
                      lottery.speed += 20;
                  }
              }
              if (lottery.speed < 40) {
                  lottery.speed = 40;
              };
              //console.log(lottery.times + '^^^^^^' + lottery.speed + '^^^^^^^' + lottery.prize);
              lottery.timer = setTimeout(roll, lottery.speed);
          }
          return false;
      }

      var click = false;//是否已进入转动抽奖
      lottery.init('lottery');
      $scope.beginGo = function () {
          if (click) {
              return false;
          } else {
              var GetStudentDiscounts = '/Entrace/Dispatch.aspx?FunctionName=Student.GetStudentDiscounts&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + params.StudentId + '","CourseId":"' + params.CourseId + '"}';
              $.ajax({
                  type: 'POST',
                  cache: 'false',
                  url: GetStudentDiscounts,
                  dataType: "json",
                  success: function (data) {
                      if (data.length > 0) {
                          $('#lottery tbody').addClass("active");
                          lottery.speed = 100;
                          roll();
                          click = true;
                          return false;
                      } else {
                          $Loading.show({ class: MSGICON.fail, text: '您已抽过奖，请到我的订单支付~' });
                          $timeout(function () {$state.go('myorder');}, 2000);
                      }
                  }
              });
          }
      }
      $scope.goPay = function () {
          $rootScope.paycourseId = $scope.courseId;
          $state.go('pay', {Discount:$scope.resultData, DiscountCode: $scope.resultData.DiscountCode })
      };

      function htmlInit() {
          var trWidth = $('#lottery').css('width');
          var tdW = $('#lottery td').css('width');
          $('#lottery td').css({'height': tdW});
      }
      function getDiscounts(obj) {
          var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetAllDiscount&Version=1&EndClientType=H5&Key=""&JsonPara={"CourseId":"' + obj.CourseId + '"}';
          $.ajax({
              type: 'POST',
              cache: 'false',
              url: teacherList,
              dataType: "json",
              success: function (data) {
                  $scope.$apply(function () {
                      $scope.DiscountList = data;
                  })
              }
          });
      }

  })
