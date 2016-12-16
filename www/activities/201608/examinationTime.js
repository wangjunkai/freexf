'use strict';

angular.module('freexf')
  .controller('examinationTime_ctrl', function ($scope,$state) {
      $('head').append('<script src="activities/js/Calendarfun.js" async=""></script>');

      var calendarurl = '/Entrace/Dispatch.aspx?FunctionName=Student.%E8%80%83%E8%AF%95%E6%97%A5%E5%8E%86&Version=1&EndClientType=H5&JsonPara={}';
      $.ajax({
          type: 'GET',
          cache: 'false',
          url: calendarurl,
          success: function (data) {
              ajaxSuccess(eval(data));
          }
      });

      $scope.prev = true;
      $scope.next = false;

      function ajaxSuccess(data, showMonth, showDay) {
          window.data = data;
          window.curTime = window.data[0].CurrentTime;

          var curYear = window.curTime.split('-')[0];
          var curMonth = window.curTime.split('-')[1]//.split('0')[1];
          var curDay = window.curTime.split('-')[2];
          curMonth = parseInt(curMonth);
          if (typeof (showMonth) == "undefined") {
              showMonth = curMonth;
          }
          if (typeof (showDay) == "undefined") {
              showDay = curDay;
          }
          if (curMonth == showMonth && curDay == showDay) {
              showCalendar(curYear, showMonth, showDay, 1);
          } else {
              showCalendar(curYear, showMonth, showDay)
          }

          var msgArray = new Array;
          var examNum = new Array;
          //遍历本月每天
          $('.date-item').each(function (i) {
              examNum[i] = 0;
              var ele = $('#GD' + i);
              var calendarDate = ele.attr('ymdday');
              //遍历考试日期
              for (var j = 0; j < data.length; j++) {
                  var nowI = i;
                  var examDate = data[j].ExamTime.split('-');
                  examDate = examDate[0] + examDate[1] + examDate[2];
                  if (calendarDate == examDate) {
                      examNum[nowI]++;
                      ele.addClass('mark');
                      ele.attr('exam-num', examNum[nowI])
                      ele.attr('msg' + examNum[nowI], data[j].ExamName);
                  }
              }
          })
      }

      $scope.gotele = function(){
        $state.go('telephone',{telephone:'400-686-5511'})
      };
      //向右拖拽 上月
      $scope.onSwipeRight = function () {
          $scope.next = false;
          var showDate = $('.calendar-box').find('em').text()
          var showMonth = showDate.split('月')[0];
          showMonth--;
          if (showMonth == 8) {
              $scope.prev = true;
          } else if (showMonth == 0) {
              showMonth = 11;
          } else if (showMonth < 8) {
              showMonth = 8;
          };
          changeMonth(showMonth);
      }
      //向左拖拽 下月
      $scope.onSwipeLeft = function () {
          $scope.prev = false;
          var showDate = $('.calendar-box').find('em').text()
          var showMonth = showDate.split('月')[0];
          showMonth++;
          if (showMonth > 12) {
              showMonth = 12;
          }
          if (showMonth == 12) {
              $scope.next = true;
          }
          changeMonth(showMonth);
      }

      function changeMonth(showMonth) {
          var curYear = window.curTime.split('-')[0];
          var curMonth = window.curTime.split('-')[1]//.split('0')[1];
          var curDay = window.curTime.split('-')[2];
          curMonth = parseInt(curMonth);
          var showDay = 1;
          $('.time-information').find('em').empty();
          $('.time-information').find('ul p').empty();
          if (showMonth == curMonth) {
              showDay = curDay;
          }
          if (curMonth == showMonth && curDay == showDay) {
              showCalendar(curYear, showMonth, showDay, 1);
          } else {
              showCalendar(curYear, showMonth, showDay)
          }
          ajaxSuccess(window.data, showMonth, showDay);
      }

      $('body').on('click', ".date-item", function () {
          var $this = $(this);
          var calendarDate = $this.attr('ymdday');
          var month = calendarDate.substring(4, 6);
          var day = calendarDate.substring(6, 8);
          month = parseInt(month);
          day = parseInt(day)

          $('.date-item').removeClass('active');
          $('.time-information').find('em').empty();
          $('.time-information').find('ul p').empty();
          $this.addClass('active');
          $('.calendar-box').find('em').text(month + '月' + day + '日');
          if (month == 1 && day == 1) {
              $('.calendar-box').find('i').text('2017');
          } else {
              $('.calendar-box').find('i').text('2016');
          }
          if ($this.hasClass('mark')) {
              $('.time-information').find('em').text(month + '月' + day + '日：');
              for (var i = 0; i < $this.attr('exam-num') * 1; i++) {
                  $('.time-information').find('ul p').eq(i).text($this.attr('msg'+(i+1)))
              }
          } else {

          }
      })

      function showCalendar(year, month, day, today) {
          //初始化设置日历宽高
          var trWidth = $('#calendar tr').css('width');
          var thW = trWidth.substring(0, trWidth.length - 2) - 1;
          var tdW = (trWidth.substring(0, trWidth.length - 2)) - 15;
          CalendarFun(year, month, day, '#CalendarLists', today);
          $('.calendar-box').find('em').text(month + '月' + day + '日');
          if (month == 1 && day == 1) {
              $('.calendar-box').find('i').text('2017');
          } else {
              $('.calendar-box').find('i').text('2016');
          }
          if ($('#SD35').html() * 1 < 10) {
              $('#SD35').parents('.calendar-date').hide();
          }
          $('#calendar td').css({ 'height': tdW / 7 + 'px', 'width': tdW / 7 + 'px', 'line-height': tdW / 7 + 'px' });
          $('#calendar th').css({ 'width': thW / 7 + 'px' });
      }
  });
