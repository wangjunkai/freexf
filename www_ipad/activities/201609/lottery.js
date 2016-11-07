'use strict';

angular.module('freexf')
    .controller('lottery_ctrl', function ($scope, $rootScope, $ionicPopup, $freexfUser,$timeout, $Loading, MSGICON) {
    $scope.result = false;
    $scope.userData = $freexfUser.auth();
    var params = {
      CourseId: $scope.$parent.$data.paycourseId,
      StudentId: $scope.userData.userLg ? $scope.userData.rowId : ''
    };
    getDiscounts(params);
    $scope.beginGo = function () {
      if(click){
        return false;
      }else{
        click = true;
        GetStudentDiscounts(params, function (data) {
          if (!data || data.length <= 0) {
            $Loading.show({class: MSGICON.fail, text: '抱歉,您已经抽过奖了~'}, 2000);
            $timeout(function () {
              $scope.$modal._remove();
              $scope.$parent.openModal('pay', {paycourseId: $scope.$parent.$data.paycourseId, DiscountCode: ''});
            }, 2000)
          } else {
            if (!$scope.lotteryInit) {
              $scope.lotteryInit = true;
              lottery.init('lottery');
            }
            lottery.speed = 100;
            roll();
          }
        });
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

    function GetStudentDiscounts(obj, func) {
      var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetStudentDiscounts&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + obj.StudentId + '","CourseId":"' + obj.CourseId + '"}';
      $.ajax({
        type: 'POST',
        cache: 'false',
        url: teacherList,
        dataType: "json",
        success: function (data) {
          func.call(this, data);
        }
      });
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
          var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetRandomDiscount&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + params.StudentId + '","CourseId":"' + params.CourseId + '"}';
          $.ajax({
            type: 'POST',
            cache: 'false',
            url: teacherList,
            dataType: "json",
            success: function (data) {
                lottery.sdata = data;
                //获取中奖位置
                if (typeof ($('.DiscountCode' + data.DiscountCode).attr('dnum')) != 'undefined') {
                    lottery.prize = $('.DiscountCode' + data.DiscountCode).attr('dnum')
                } else {
                    lottery.prize = -1;
                }
              //switch (data.DiscountCode) {
              //  case '10000090':
              //    lottery.prize = 0;
              //    break;
              //  case '10000060':
              //    lottery.prize = 6;
              //    break;
              //  case '10000030':
              //    lottery.prize = 4;
              //    break;
              //  case '10000020':
              //    lottery.prize = 2;
              //    break;
              //  case '10000100':
              //    lottery.prize = 1;
              //    break;
              //  default:
              //    lottery.prize = 3;
              //    lottery.result = false;
              //    break;
              //}
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

    function getDiscounts(obj) {
      var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetAllDiscount&Version=1&EndClientType=H5&Key=""&JsonPara={"CourseId":"' + obj.CourseId + '"}';
      $.ajax({
        type: 'POST',
        cache: 'false',
        url: teacherList,
        dataType: "json",
        success: function (data) {
          $scope.$apply(function () {
            $scope.Discounts = data;
          })
        }
      });
    }

  });
