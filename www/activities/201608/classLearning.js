'use strict';

angular.module('freexf')
  .controller('classlearning_ctrl', function ($scope, $rootScope, $injector, $location, $state, $ionicPopup, $ionicLoading, AUTH, ENV, DispatchRepository) {
      $('head').append('<script src="activities/js/awardRotate.js" async=""></script>');
      var DisPatchList = DispatchRepository(ENV._api.__Dispatch, '/Entrace');
      var winWidth = document.documentElement.clientWidth;
      var winHeight = document.documentElement.clientHeight;
      //计算转盘指针位置
      var pointer = $('#pointer').find('img');
      var b = $('#pointer').find('b');
      var p = $('#pointer').find('p');
      var bg = $('#turntable-bg')
      var top = (bg.width() - pointer.width() * 1.3) / 2 - 14 * winHeight / 627;
      var left = (bg.width() - pointer.width()) / 2;
      $('#pointer').css({ 'top': top + 'px', 'left': left + 'px' });
      b.css('margin-top', -(pointer.width() * 1.3 * 0.6) + 'px');
      p.css('margin-top', (18 * winHeight / 667) + 'px');

      $('.cover').click(function () {
          $('.mylist').css('display', 'none');
          $('.draw-num').css('display', 'none');
          $('.draw-result').css('display', 'none');
          $('.cover').css('display', 'none');
      });
      //抽奖转盘
      var StudentId = AUTH.FREEXFUSER.data.rowId;
      var PrizeType = "%e8%b4%ad%e7%89%a9%e6%9c%89%e7%a4%bc";
      var extractingTimes = 0;
      var prizeList = ['谢谢参与', '1次抽奖机会', '书包', 'T恤', '耳机', 'Ipad mini2'];
      var bRotate = false;
      if (AUTH.FREEXFUSER.data.userLg) {
          //ajax读取抽奖次数
          getExtractingTimes();
      }
      //extractingTimes = 3;
      $('.pointer').click(function () {
          if (bRotate) return;
          if (AUTH.FREEXFUSER.data.userLg) {
              getExtractingTimes2();
          } else {
              location.href = "#/login";
          }
      });

      //判断剩余次数后再抽奖
      function getExtractingTimes2() {
          var StudentId = AUTH.FREEXFUSER.data.rowId;
          var PrizeType = "%e8%b4%ad%e7%89%a9%e6%9c%89%e7%a4%bc";
          var numurl = '/Entrace/Dispatch.aspx?FunctionName=LuckyDraw.ExtractingTimes&Version=1&EndClientType=PC&Key=""&JsonPara={"StudentId":"' + StudentId + '","Type":"' + PrizeType + '"}';
          $.ajax({
              type: 'POST',
              cache: 'false',
              url: numurl,
              dataType: "json",
              success: function (data) {
                  draw(data)
              }
          });
      }

      function draw(data) {
          var StudentId = AUTH.FREEXFUSER.data.rowId;
          var PrizeType = "%e8%b4%ad%e7%89%a9%e6%9c%89%e7%a4%bc";
          extractingTimes = data;
          if (extractingTimes>0) {
              var drawurl = '/Entrace/Dispatch.aspx?FunctionName=LuckyDraw.GetLuckyDraw&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + StudentId + '","PrizeType":"' + PrizeType + '"}';
              $.ajax({
                  type: 'POST',
                  cache: 'false',
                  url: drawurl,
                  dataType: "json",
                  success: function (data) {
                      startDraw(data);
                  }
              });
          } else {
              divposition($('.draw-num'));
              $('.draw-num').css('display', 'block');
              $('.cover').css('display', 'block');
          }
      }

      //获取中奖信息
      var winnerurl = '/Entrace/Dispatch.aspx?FunctionName=LuckyDraw.GetWinningStudent&Key=""&Version=1&EndClientType=PC&JsonPara={}';
      $.ajax({
          type: 'POST',
          cache: 'false',
          url: winnerurl,
          dataType: "json",
          success: function (data) {
              winningMsg(data);
          }
      });

      //我的中奖记录
      var listbtn = $('#listbtn');
      listbtn.click(function (e) {
          if (AUTH.FREEXFUSER.data.userLg) {
              e = e || window.event;
              //阻止事件冒泡
              if (e.stopPropagation) {
                  e.stopPropagation();
              } else {
                  e.cancelBubble = true;
              }
              divposition($('.mylist'));
              $('.mylist').css('display', 'block');
              $('.cover').css('display', 'block');
              var mydrawurl = '/Entrace/Dispatch.aspx?FunctionName=LuckyDraw.GetMyWinning&Version=1&EndClientType=PC&Key=""&JsonPara={"StudentId":"' + StudentId + '"}';
              $.ajax({
                  type: 'POST',
                  cache: 'false',
                  url: mydrawurl,
                  dataType: "json",
                  success: function (data) {
                      myWinning(data);
                  }
              });
          } else {
              location.href = "#/login";
          }
      })



      //设置悬浮框位置
      function divposition(obj) {
          var divWidth = obj.width();
          var divHeight = obj.height();
          var divTop = (winHeight - divHeight) / 2;
          var divLeft = (winWidth - divWidth) / 2;
          //console.log(winHeight + '*' + winWidth);
          //console.log(divHeight + '*' + divWidth);
          obj.css({ 'top': divTop, 'left': divLeft });
      }

      function startDraw(data) {
          var item = data.numCode * 1;
          switch (item) {
              case 1:
                  rotateFn(5, prizeList[item - 1]);
                  break;
              case 2:
                  rotateFn(2, prizeList[item - 1]);
                  break;
              case 3:
                  rotateFn(4, prizeList[item - 1]);
                  break;
              case 4:
                  rotateFn(3, prizeList[item - 1]);
                  break;
              case 5:
                  rotateFn(6, prizeList[item - 1]);
                  break;
              case 6:
                  rotateFn(1, prizeList[item - 1]);
                  break;
              default:
                  console.log('else');
          }
          getExtractingTimes();
      }

      //转盘超时
      function rotateTimeOut() {
          $('#rotate').rotate({
              angle: 0,
              animateTo: 2160,
              duration: 8000,
              callback: function () {
                  alert('网络超时，请检查您的网络设置！');
              }
          });
      }

      //转盘转动
      function rotateFn(num, msg) {
          bRotate = !bRotate;
          var angles = num * (360 / prizeList.length) - (360 / (prizeList.length * 2));
          $('#rotate').stopRotate();
          $('#rotate').rotate({
              angle: 0,
              animateTo: angles + 1800,
              duration: 8000,
              callback: function () {
                  bRotate = !bRotate;
                  divposition($('.draw-result'));
                  $('.draw-result').css('display', 'block');
                  $('.cover').css('display', 'block');
                  if (num == 5) {
                      $('.result-content').find('span').text('很遗憾');
                      $('.result-content').find('b').text('谢谢您的参与');
                  } else {
                      $('.result-content').find('span').text('恭喜您');
                      $('.result-content').find('b').text('抽中 ' + msg);
                  }
              }
          })
      }

      //获取抽奖机会次数
      function getExtractingTimes() {
          var StudentId = AUTH.FREEXFUSER.data.rowId;
          var PrizeType = "%e8%b4%ad%e7%89%a9%e6%9c%89%e7%a4%bc";
          var numurl = '/Entrace/Dispatch.aspx?FunctionName=LuckyDraw.ExtractingTimes&Version=1&EndClientType=PC&Key=""&JsonPara={"StudentId":"' + StudentId + '","Type":"' + PrizeType + '"}';
          $.ajax({
              type: 'POST',
              cache: 'false',
              url: numurl,
              dataType: "json",
              success: function (data) {
                  changeNum(data)
              }
          });
      }

      //改变剩余机会次数
      function changeNum(data) {
          extractingTimes = data * 1;
          var element = '还有<span>' + extractingTimes + '</span>次机会';
          $('.pointer').find('p').html(element);
      }

      //中奖信息滚动
      function winningMsg(data) {
          var contentbox = document.getElementById('contentbox');
          var iliHeight = 24;//单行滚动的高度
          var speed = 50;//滚动的速度
          var time;
          var delay = 2000;
          //显示中奖信息
          if (data.length > 0) {
              $(data).each(function () {
                  var name = this.NickName.substring(0, 3) + '****' + this.NickName.substring(7, 11);
                  var liele = $('<li><span class="name">' + name + '</span>  中了  <span class="prize">' + this.PrizeName + '</span></li>')
                  $('#contentbox').find('ul').append(liele);
              });
          }
          else {
              $('#contentbox').html('<li>抽奖进行中........</li>');
              $('#contentbox').find('li').addClass('none');
              $('#contentbox').addClass('none');
          }
          contentbox.scrollTop = 0;
          if ($('#contentbox').find('ul').height() > $('#contentbox').height()) {
              contentbox.innerHTML += contentbox.innerHTML;//克隆一份一样的内容
              setTimeout(startScroll, delay);
          }
          function startScroll() {
              time = setInterval(scrollUp, speed);
              contentbox.scrollTop++;
          }
          function scrollUp() {
              if (contentbox.scrollTop % iliHeight == 0) {
                  clearInterval(time);
                  setTimeout(startScroll, delay);
              } else {
                  contentbox.scrollTop++;
                  if (contentbox.scrollTop >= contentbox.scrollHeight / 2) {
                      contentbox.scrollTop = 0;
                  }
              }
          }
      }

      //我的中奖记录
      function myWinning(data) {
          $('.mylistcontent ion-scroll .mylistcontent-lisibox').empty();
          if (data.length == 0) {
              $('.mylistcontent ion-scroll .mylistcontent-lisibox').html('<li>暂无中奖记录</li>');
          } else {
              $(data).each(function () {
                  var name = this.NickName.substring(0, 3) + '****' + this.NickName.substring(7, 11);
                  var liele = $('<li><p class="prize"></p><p class="time"></p></li>').appendTo($('.mylistcontent ion-scroll .mylistcontent-lisibox'));
                  liele.find('.prize').text(name + '   中了   ' + this.PrizeName);
                  liele.find('.time').text(this.CreatedTime);
              });
          }

      }

      DisPatchList.getModel({
          "FunctionName": 'LuckyDraw.GetCourselist',
          "Version": 1,
          "EndClientType": 'H5',
          "JsonPara": {}
      }).then(function (res) {

          $scope.DisPatchList = res.response.data;
      });
      $scope.setData = function (v, e) {
          var initval = '点击收起';
          $scope[v] || ($scope[v] = {});
          if (!('prevValue' in $scope[v])) {
              $scope[v]['prevValue'] = e.target.innerHTML;
          }
          $scope[v]['state'] = !$scope[v]['state'];
          e.target.innerHTML = $scope[v]['state'] ? initval : $scope[v]['prevValue'];
      };
      $scope.goCourseList = function (category1, category2) {
          $state.go('courseplate', { Category1: category1, Category2: category2 });
      };
      $scope.toCourseDate = function (courseId) {
          $state.go('coursedetail', { courseId: courseId });
      };
  });
