'use strict';

angular.module('freexf')
  .controller('liveCalendar_ctrl', function ($scope, $state, AUTH) {
      $('head').append('<script src="activities/js/Calendarfun.js" async=""></script>');
      $scope.auth = AUTH.FREEXFUSER.data;

      var category = $('.course-category');
      category.find('span').width('25%');

      $scope.prev = true;
      $scope.next = false;
      doAjax('多语种');

      category.find('span').click(function () {
          $('.course-category').find('span').removeClass('active');
          $(this).addClass('active');
          var categoryJson = $(this).text();
          if (categoryJson == '会 计') {
              categoryJson = '会计职业';
          }
          if (categoryJson == '大英语') {
              categoryJson = '英语';
          }
          $('#inf-ul').empty();
          $scope.$apply(function () {
              $scope.prev = true;
              $scope.next = false;
          });
          doAjax(categoryJson);
      })

      function doAjax(categoryJson) {
          var calendarurl = '/Entrace/Dispatch.aspx?FunctionName=LiveRadio.GetLiveRadioCalendarList&Version=1&EndClientType=H5&JsonPara={"Category":"' + categoryJson + '","StudentId":"' + $scope.auth.rowId + '"}';
          $.ajax({
              type: 'GET',
              cache: 'false',
              url: calendarurl,
              success: function (data) {
                  ajaxSuccess(eval(data));
              }
          });
      }

      function ajaxSuccess(data, showYear, showMonth, showDay) {
          window.data = data;
          window.curTime = window.data[0].NowDate;

          var curTime = data[0].NowDate;
          var curYear = curTime.split('-')[0];
          var curMonth = curTime.split('-')[1];
          var curDay = curTime.split('-')[2];
          curMonth = parseInt(curMonth);
          curDay = parseInt(curDay);
          if (typeof (showYear) == "undefined") {
              showYear = curYear;
          }
          if (typeof (showMonth) == "undefined") {
              showMonth = curMonth;
          }
          if (typeof (showDay) == "undefined") {
              showDay = curDay;
          }
          if (curMonth == showMonth && curDay == showDay) {
              showCalendar(showYear, showMonth, showDay, 1);
          } else {
              showCalendar(showYear, showMonth, showDay)
          }

          if (data[0].ProductName != null) {
              var liveNum = new Array;
              //遍历本月每天
              $('.msg').each(function (i) {
                  liveNum[i] = 0;
                  var that = $(this);
                  var num = that.attr('id').split('g')[1];
                  var calendarDate = $('#GD' + num).attr('ymdday');
                  //遍历考试日期
                  $(data).each(function (j) {
                      var nowI = i;
                      var liveDate = this.LiveRadioDate.split('-');
                      liveDate = liveDate[0] + liveDate[1] + liveDate[2];
                      if (calendarDate == liveDate) {
                          liveNum[nowI]++;
                          that.addClass('mark');
                          var subject = this.ProductType.split('/')[1];
                          if (subject == '西班牙语') {
                              subject = '西语';
                          }
                          that.find('.subject').text(subject);
                          that.find('.time').text('•••');

                          var teacher = this.TeacherName;
                          teacher = $.grep(teacher, function (n) { return $.trim(n).length > 0; }).join(',')
                          that.attr('livenum', liveNum[nowI]);
                          that.attr('time' + liveNum[nowI], this.LiveRadioTime.substring(0, 5));
                          that.attr('livename' + liveNum[nowI], this.ProductName);
                          that.attr('teacher' + liveNum[nowI], teacher);
                          that.attr('liveradioId' + liveNum[nowI], this.LiveRadioId);
                          that.attr('isapply' + liveNum[nowI], this.StudentIsApply);
                          that.attr('description' + liveNum[nowI], this.ProductDescription);
                          that.attr('liveradiobackurl' + liveNum[nowI], this.LiveRadioBackURL)

                          if (this.LiveRadioBackURL.length) 
                              that.attr('notyet' + liveNum[nowI], 'false');
                          else that.attr('notyet' + liveNum[nowI], 'true');
                      }
                  })
              })
              //默认显示今日直播课程
              if ($('.today').hasClass('mark')) {
                  $('.today').click();
                  $('.today').removeClass('active');
              }
              //非本月日期灰色显示
              $('.calendar-date:first td').each(function () {
                  var date = $(this).find('font:first');
                  if (date.text() * 1 > 7) {
                      $(this).addClass('not-cur');
                      var num = $(this).attr('id').split('D')[1];
                      $('#msg' + num).find('p').empty();
                      $('#msg' + num).removeClass('mark');
                  }
              })
              $('.calendar-date:last td').each(function () {
                  var date = $(this).find('font:first');
                  if (date.text() * 1 < 14) {
                      $(this).addClass('not-cur');
                      var num = $(this).attr('id').split('D')[1];
                      $('#msg' + num).find('p').empty();
                      $('#msg' + num).removeClass('mark');
                  }
              })
              $('.calendar-date').eq(-2).find('td').each(function () {
                  var date = $(this).find('font:first');
                  if (date.text() * 1 < 7) {
                      $(this).addClass('not-cur');
                      var num = $(this).attr('id').split('D')[1];
                      $('#msg' + num).find('p').empty();
                      $('#msg' + num).removeClass('mark');
                  }
              })
          }
      }

      //向右拖拽 上月
      $scope.onSwipeRight = function () {
          $scope.next = false;
          var showDate = $('#calendar-head').find('em').text();
          var showMonth = showDate.split('月')[0];
          var showYear = $('#calendar-head').find('i').text();
          showMonth--;
          if (showMonth < 1) {
              showMonth = 12;
              showYear--;
          }
          $scope.prev = true;
          changeMonth(showYear, showMonth);
      }
      //向左拖拽 下月
      $scope.onSwipeLeft = function () {
          $scope.prev = false;
          var showDate = $('#calendar-head').find('em').text();
          var showMonth = showDate.split('月')[0];
          var showYear = $('#calendar-head').find('i').text();
          showMonth++;
          if (showMonth > 12) {
              showMonth = 1;
              showYear++;
          }
          $scope.next = true;
          changeMonth(showYear, showMonth);
      }

      function changeMonth(showYear, showMonth) {
          var curMonth = window.curTime.split('-')[1]
          var curDay = window.curTime.split('-')[2];
          curMonth = parseInt(curMonth);
          var showDay = 1;
          $('#inf-ul').empty();
          if (showMonth == curMonth) {
              showDay = curDay;
          }
          ajaxSuccess(window.data, showYear, showMonth, showDay);
      }


      function showCalendar(year, month, day, today) {
          //初始化设置日历宽高
          var width = $('.calendar').width() - 20;
          CalendarFun(year, month, day, '.CalendarLists', today);
          $('.calendar td').addClass('date').css({ 'height': width / 25 + 'px', 'width': width / 7 + 'px', 'line-height': width / 22 + 'px' });
          $('.calendar th').css({ 'width': width / 7 + 'px' });
          //设置时间
          $('#calendar-head').find('em').text(month + '月' + day + '日');
          $('#calendar-head').find('i').text(year);
          //每行下增加一行显示区域
          var msgLine = $('<tr class="msg-line"></tr>').insertAfter($('.calendar .calendar-date'));
          $('<td class="msg"><p class="subject"></p><p class="time"></p></td><td class="msg"><p class="subject"></p><p class="time"></p></td><td class="msg"><p class="subject"></p><p class="time"></p></td><td class="msg"><p class="subject"></p><p class="time"></p></td><td class="msg"><p class="subject"></p><p class="time"></p></td><td class="msg"><p class="subject"></p><p class="time"></p></td><td class="msg"><p class="subject"></p><p class="time"></p></td>').appendTo(msgLine);
          $('.msg p').css({ 'height': width / 16 + 'px', 'width': width / 7 + 'px', 'line-height': width / 16 + 'px' });
          $('.msg').each(function (index) {
              $(this).attr('id', 'msg' + index);
          })
          
          //本日显示灰色底
          var today = $('.date-item.on');
          if (today.size()) {
              var num = today.attr('id').split('D')[1];
              $('#msg' + num).addClass('today');
          }
          //if ($('#SD35').html() * 1 < 10) {
          //    $('#SD35').parents('.calendar-date').hide();
          //    $('.msg-line:last').hide();
          //}
      }

      

      $('body').on('click', ".mark", function () {
          var $this = $(this);
          var num = $this.attr('id').split('g')[1];
          var calendarDate = $('#GD' + num).attr('ymdday');
          var year = parseInt(calendarDate.substring(0, 4));
          var month = parseInt(calendarDate.substring(4, 6));
          var day = parseInt(calendarDate.substring(6, 8));

          //设置时间
          $('#calendar-head').find('em').text(month + '月' + day + '日');
          $('#calendar-head').find('i').text(year);

          $('.msg').removeClass('active');
          $('#inf-ul').empty();
          $this.addClass('active');

          var dataLine = $('<li class="date-line"></li>').appendTo($('#inf-ul'));
          $('<em><em>').text(month + '月' + day + '日：').appendTo(dataLine);
          var liveNum = parseInt($this.attr('livenum'));
          for (var i = 0; i < liveNum; i++) {
              var index = i + 1;
              $('<li class="live-name"></li>').text($this.attr('livename' + index)).appendTo($('#inf-ul'));
              var liEle = $('<li class="live-msg"></li>').appendTo($('#inf-ul'));
              $('<span class="teacher"></span>').text('老师：' + $this.attr('teacher' + index)).appendTo(liEle);
              $('<span class="time"></span>').text('时间：' + $this.attr('time' + index)).appendTo(liEle);
              $('<p class="description"></p>').text('课程介绍：'+$this.attr('description' + index)).appendTo(liEle);
              var LiveRadioId = $this.attr('liveradioId' + index);
              var notyet = $this.attr('notyet' + index);
              if (notyet == 'true') {
                  var isApply = $this.attr('isapply' + index);
                  var btnEle = $('<div class="btn apply"></div>');
                  btnEle.attr({ 'liveradioId': LiveRadioId, 'isapply': isApply })
                  if(isApply == 'true')
                      btnEle.text('取消报名').appendTo($('#inf-ul'));
                  else
                      btnEle.text('立即报名').appendTo($('#inf-ul'));
              } else {
                  $('<a class="btn" href="' + $this.attr('liveradiobackurl' + index) + '"></a>').text('立即回顾').appendTo($('#inf-ul'));
              }
          }

          //报名
          $('.apply').click(function () {
              var $this = $(this);
              var id = $this.attr('liveradioId');
              var apply = $this.attr('isapply');
              if (!$scope.auth.userLg) {
                  $state.go('login');
              } else {
                  var applyurl = '/Entrace/Dispatch.aspx?FunctionName=LiveRadio.UpdateIsApply&Version=1&EndClientType=H5&JsonPara={"StudentId":"' + $scope.auth.rowId + '","LiveRadioId":"' + id + '","IsApply":"' + apply.toString() + '"}';
                  $.ajax({
                      type: 'GET',
                      cache: 'false',
                      url: applyurl,
                      success: function (data) {
                          if (data == 'true') {       //修改状态成功
                              //更改报名状态
                              if (apply == 'true') {
                                  $this.attr('isapply', 'false');
                                  $this.text('立即报名');
                              }
                              else {
                                  $this.attr('isapply', 'true');
                                  $this.text('取消报名');
                              }
                          }
                      }
                  });
              }
          })
      })  
  });
