'use strict';

angular.module('freexf')
  .controller('microClass_ctrl', function ($scope, $rootScope, $injector, $location, $state, $ionicPopup,$frModal, $ionicLoading, AUTH, ENV, DispatchRepository) {
      var sigCourseData = [];
      var grpCourseData = [];
      var modal_ary = {
          login: {
              scope: $scope,
              ctrlUrl: 'modules/user/login',
              tempUrl: 'modules/user/login.html'
          },
          register: {
              scope: $scope,
              ctrlUrl: 'modules/user/register',
              tempUrl: 'modules/user/register.html'
          },
          coursedetail: {
              scope: $scope,
              ctrlUrl: 'modules/course/coursedetail',
              tempUrl: 'modules/course/coursedetail.html'
          }
      };
      //登录注册框
      $('#loginShow').click(function () {
          $frModal.openModal($scope, 'login', modal_ary)
      })
      $('#registerShow').click(function () {
          $frModal.openModal($scope, 'register', modal_ary)
      })

      //年级块大小
      var sigGrade = $('.single-class .grade');
      var sigGradeWidth = sigGrade.css('width').split('px')[0];
      var spanWidht = (sigGradeWidth - 21) / 6;
      sigGrade.find('div').css({ 'width': spanWidht + 'px', 'height': spanWidht / 2.55 });
      sigGrade.find('span').css('line-height', spanWidht / 2.55 + 'px');

      //获取单课
      var sigCourseurl = '/Entrace/Dispatch.aspx?FunctionName=Activity.TinyClassRoom&Version=1&EndClientType=H5&Key=""&JsonPara={}';
      $.ajax({
          type: 'POST',
          cache: 'false',
          url: sigCourseurl,
          dataType: "json",
          success: function (data) {
              sigCourseData = data;
              sigCoucse(sigCourseData.CourseList1);
          }
      });

      //单课年级块点击事件
      sigGrade.find('.sig-grade').click(function () {
          sigGrade.find('.sig-grade').eq($(this).index()).addClass("cur").siblings().removeClass("cur");
          //var item = 'CourseList' + ($(this).index() + 1);
          //sigCoucse(sigCourseData.item);
          switch ($(this).index() + 1) {
              case 1:
                  sigCoucse(sigCourseData.CourseList1);
                  break;
              case 2:
                  sigCoucse(sigCourseData.CourseList2);
                  break;
              case 3:
                  sigCoucse(sigCourseData.CourseList3);
                  break;
              case 4:
                  sigCoucse(sigCourseData.CourseList4);
                  break;
              case 5:
                  sigCoucse(sigCourseData.CourseList5);
                  break;
              case 6:
                  sigCoucse(sigCourseData.CourseList6);
                  break;
          }
      })

      //显示单课
      function sigCoucse(data) {
          $('.single-class .class').empty();
          $(data).each(function () {
              var detail = $('<div class="class-detail"></div>').appendTo($('.single-class .class'));
              var box = $('<div class="class-box clear-fix"></div>').appendTo(detail);
              var leftdiv = $('<div class="left"></div>').appendTo(box);
              var rightdiv = $('<div class="right"></div>').appendTo(box);
              $('<div style="clear: both"></div>').appendTo(box);
              var imgEle = $('<img />').attr('src', this.Image).appendTo(leftdiv);
              var msg = $('<p class="msg">急速返还学费，只需<b>7</b><span>天</span></p>').appendTo(leftdiv);
              var pricediv = $('<div class="course-price"></div>').html('<b>' + this.Price + '</b><span>   学分</span>').appendTo(leftdiv);
              $('<p class="title"></p>').text(this.ProductName).appendTo(rightdiv);
              $('<P class="teach">课程讲师：<span>' + this.TeacherName + '</span></p>').appendTo(rightdiv);
              var ulEle = $('<ul></ul>').appendTo(rightdiv);
              $('<li></li>').text('课程章节').appendTo(ulEle);
              $(this.Tag).each(function () {
                  $('<li></li>').text(this.substring(3)).appendTo(ulEle);
              })
              var btndiv = $('<div class="btn"><span>查看详情</span></div>').appendTo(rightdiv);
/*              var msgHeight = msg.css('height').split('px')[0]
              var imgHeight = imgEle.css('width').split('px')[0] * 0.576;
              var rightHeight = msgHeight * 1 + imgHeight * 1 + 10;
              var btnHeight = btndiv.css('width').split('px')[0] * 1 * 0.17;
              $('.single-class .btn span').css('line-height', btnHeight + 'px');
              rightdiv.css({ 'height': rightHeight + 'px' });*/
              var courseId = this.ProductId;
              btndiv.click(function () {
                  $frModal.openModal($scope, 'coursedetail', modal_ary, { ProductId: courseId })
              })
              box.click(function () {
                  $frModal.openModal($scope, 'coursedetail', modal_ary, { ProductId: courseId })
              })
          })
      }

      //年级块大小
      var grpGrade = $('.group-class .grade');
      var grpGradeWidth = grpGrade.css('width').split('px')[0];
      var spanWidht = (grpGradeWidth - 23) / 8;
      var gsigGrade = grpGrade.find('.sig-grade');
      gsigGrade.css({ 'width': spanWidht + 'px', 'height': spanWidht / 2.55 });
      grpGrade.find('span').css('line-height', spanWidht / 2.55 + 'px');

      //获取组合课
      var grpCourseurl = '/Entrace/Dispatch.aspx?FunctionName=Activity.GetCourseGroupList&Version=1&EndClientType=H5&Key=""&JsonPara={}';
      $.ajax({
          type: 'POST',
          cache: 'false',
          url: grpCourseurl,
          dataType: "json",
          success: function (data) {
              grpCourseData = data;
              grpCoucse(grpCourseData.CourseList1);
          }
      });

      //组合课年级块点击事件
      gsigGrade.click(function () {
          gsigGrade.eq($(this).index()).addClass("cur").siblings().removeClass("cur");
          switch ($(this).index() + 1) {
              case 1:
                  grpCoucse(grpCourseData.CourseList1);
                  break;
              case 2:
                  grpCoucse(grpCourseData.CourseList2);
                  break;
              case 3:
                  grpCoucse(grpCourseData.CourseList3);
                  break;
              case 4:
                  grpCoucse(grpCourseData.CourseList4);
                  break;
              case 5:
                  grpCoucse(grpCourseData.CourseList5);
                  break;
              case 6:
                  grpCoucse(grpCourseData.CourseList6);
                  break;
              case 7:
                  grpCoucse(grpCourseData.CourseList7);
                  break;
              case 8:
                  grpCoucse(grpCourseData.CourseList8);
                  break;
          }
      })

      //显示组合课
      function grpCoucse(data) {
          $('.group-class .class').empty();
          $(data).each(function (i) {
              var detail = $('<div class="course-detail"></div>').appendTo($('.group-class .class'));
              var box = $('<div class="box"></div>').appendTo(detail);
              var btn = $('<div class="btn"><span>立即注册  免费试听</span></div>').appendTo(detail);
              var imgdiv = $('<div class="course-img"></div>').appendTo(box);
              $('<img/>').attr('src', this.Image).appendTo(imgdiv);
              var pricediv = $('<div class="course-price"></div>').appendTo(box);
              pricediv.html('<b>' + this.Price + '</b><span>学分</span>');
              var textdiv = $('<div class="course-text"></div>').appendTo(box);
              $('<p class="title"></p>').text(this.ProductName).appendTo(textdiv);
              $('<p class="teach">课程讲师：<span>'+this.TeacherName+'</span></p>').appendTo(textdiv);
              $('<hr/>').appendTo(textdiv);
              var pele = $('<p class="hour">课时数：<span>' + this.Hour + '</span></p>').appendTo(textdiv);
              if (i < 3) {
                  $('<span class="star first"></span><span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span>').appendTo(pele);
              }
              if (i > 2 && i < 6) {
                  $('<span class="star first"></span><span class="star"></span><span class="star"></span><span class="star"></span><span class="star half"></span>').appendTo(pele);
              }
              if (i > 5) {
                  $('<span class="star first"></span><span class="star"></span><span class="star"></span><span class="star"></span>').appendTo(pele);
              }
              var boxWidth = ($('.group-class .class').css('width').split('px')[0] - 45) / 4;
              detail.css('width', boxWidth + 'px');
              var btnHeight = btn.css('width').split('px')[0] * 1 * 0.22;
              $('.group-class .btn span').css('line-height', btnHeight + 'px');
              var courseId = this.ProductId;
              btn.click(function () {
                  $frModal.openModal($scope, 'coursedetail', modal_ary, { ProductId: courseId })
              })
              box.click(function () {
                  $frModal.openModal($scope, 'coursedetail', modal_ary, { ProductId: courseId })
              })
          })
      }

      //图片大小
      var img = $('.img');
      var imgWidth = img.css('width').split('px')[0];
      var sigImgWidht = (imgWidth - 10) / 3;
      img.find('.invite').css({ 'width': sigImgWidht + 'px', 'height': sigImgWidht + 'px' });
      img.find('.weibo').css('width', sigImgWidht * 2 + 'px');
      img.find('.wechat').css('width', sigImgWidht * 2 + 'px');
      img.find('.draw').css('width', imgWidth + 'px');

      var teacherurl = '/entrace/Dispatch.aspx?EndClientType=PC&FunctionName=Student.%E6%95%99%E5%B8%88%E5%88%97%E8%A1%A8&JsonPara=%7B%22Second%22:%22%E4%B8%AD%E5%B0%8F%E5%AD%A6%22%7D&Version=1';
      $.ajax({
          type: 'POST',
          cache: 'false',
          url: teacherurl,
          dataType: "json",
          success: function (data) {
              showTeacher(data)
          }
      });

      function showTeacher(data) {
          var teaCon = $('.teacher-content');
          var teaConWidth = teaCon.css('width').split('px')[0];
          var sigboxWidth = (teaConWidth - 60) / 5.5;

          $(data).each(function (i) {
              var sigbox = $('<div class="sigbox" id="teacher' + i + '"></div>').appendTo($('.teacher-content'));
              var pic = $('<div class="pic"></div>').appendTo(sigbox);
              var teaImg = $('<img src="' + this.Image + '" />').appendTo(pic);
              var teaSpan = $('<span></span>').text(this.Name + '老师').appendTo(sigbox);
              sigbox.css({ 'width': sigboxWidth + 'px' });
              pic.css({ 'width': sigboxWidth * 0.9 + 'px', 'height': sigboxWidth * 0.9 + 'px' });
          })
      }


  })
