﻿'use strict';

angular.module('freexf')
  .controller('lotteryDouble11_ctrl', function ($scope, $rootScope, $state, $ionicPopup, $freexfUser, $timeout, $Loading, MSGICON) {
    $scope.result = false;
    $scope.loNum = $scope.$data.lotteryNum;
    $scope.userData = $freexfUser.auth();
    $scope.resultShow = false;    //抽奖结果
    $scope.ContinueText = "继续抽奖";
    $scope.prize = "";
    $scope.Winning = false;
    var params = {
      OrderId: $scope.$data.OrderId,
      StudentId: $scope.userData.userLg ? $scope.userData.rowId : ''
    };
    $scope.beginGo = function () {
      if (click) {
        return false;
      } else {
        click = true;
        if (!$scope.lotteryInit) {
          $scope.lotteryInit = true;
          lottery.init('lottery');
        }
        lottery.speed = 100;
        roll();
      }
    };

    $scope.argument = function (b) {
      $scope.$modal._remove();
      var paycourseId = $scope.$parent.$data.paycourseId;
      b && $scope.$parent.openModal('pay', {
        paycourseId: paycourseId,
        DiscountCode: $scope.resultData && $scope.resultData.DiscountCode
      });
    };
    //继续抽奖
    $scope.Continue = function () {
      if ($scope.loNum == 0) {
        $Loading.show({class: MSGICON.fail, text: '您的抽奖次数已用完，3秒后跳转至"我的课程"'});
        $timeout(function () {
          $state.go('mycourse');
          $scope.$modal._remove();
        }, 3000);

      } else {
        $scope.resultShow = false;
      }
    }


    var click = false;//是否已进入转动抽奖
    var lottery = {
      index: 0,	//当前转动到哪个位置
      count: 0,	//总共有多少个位置
      timer: 0,	//setTimeout的ID，用clearTimeout清除
      speed: 500,	//初始转动速度
      times: 0,	//转动次数
      cycle: 30,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1,	//中奖位置
      result: true,
      init: function (id) {
        if ($("#" + id).find(".lottery-unit").length > 0) {
          var $lottery = $("#" + id);
          var $units = $lottery.find(".lottery-unit");
          this.obj = $lottery;
          this.count = $units.length;
          //$lottery.find(".lottery-unit-"+this.index).addClass("active");
        }
      },
      roll: function () {
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $(lottery).find(".lottery-unit-" + index).removeClass("active");
        index += 1;
        if (index > count - 1) {
          index = 0;
        }
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
        click = false;
        $scope.$apply(function () {
          $scope.resultData = lottery.sdata;
          $scope.result = lottery.result;
        })
      } else {
        if (lottery.times < lottery.cycle) {
          lottery.speed -= 10;
        } else if (lottery.times == lottery.cycle) {
          var lotteryDataUrl = '/Entrace/Dispatch.aspx?FunctionName=LuckyDraw.GetLuckyDrawDoubleEleven&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + params.StudentId + '","uuOrderId":"' + params.OrderId + '","flag":1}';
          $.ajax({
            type: 'POST',
            cache: 'false',
            url: lotteryDataUrl,
            dataType: "json",
            success: function (data) {
              if (data) {
                $scope.loNum = data.numCode2;
                if ($scope.loNum == 0) {
                  $scope.ContinueText = "确定";
                }
                //获取中奖位置
                data.numCode = data.numCode + '';
                switch (data.numCode) {
                  case "2": //抱枕
                    lottery.prize = 2;
                    $scope.prize = "时尚抱枕";
                    $scope.Winning = true;
                    $scope.resultImg = "activities/img/lotteryDouble11/03@3x.png";
                    break;
                  case "3": //kindle
                    lottery.prize = 6;
                    $scope.prize = "kindle paperwhite";
                    $scope.Winning = true;
                    $scope.resultImg = "activities/img/lotteryDouble11/07@3x.png";
                    break;
                  case "4": //ipad
                    lottery.prize = 0;
                    $scope.prize = "32GiPadmini4";
                    $scope.Winning = true;
                    $scope.resultImg = "activities/img/lotteryDouble11/01@3x.png";
                    break;
                  default:
                    lottery.prize = 1;
                    $scope.Winning = false;
                    $scope.resultImg = "activities/img/lotteryDouble11/fail.png";
                    break;
                }
                $scope.resultShow = true;
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
        }
        lottery.timer = setTimeout(roll, lottery.speed);
      }
      return false;
    }

  });
