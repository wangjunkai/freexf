'use strict';

angular.module('freexf')
  .controller('microClass_ctrl', function ($scope, $rootScope, $ionicModal, $injector, $location, $state, $ToDetailState, $fxModal, $ionicPopup, $ionicLoading, AUTH, ENV, DispatchRepository) {
    var sigCourseData = [];
    var grpCourseData = [];
    //单课年级块大小
    var sigGrade = $('.single-class .grade');
    var sigGradeWidth = sigGrade.css('width').split('px')[0];
    var spanWidht = (sigGradeWidth - 20) / 3;
    sigGrade.find('.sig-grade').css({'width': spanWidht + 'px', 'height': spanWidht / 2.55});
    sigGrade.find('span').css('line-height', spanWidht / 2.55 + 'px');

    $scope.gotele = function () {
      $ToDetailState.go('telephone',{telephone: '400-803-6611'})
    };
    //登陆注册modal
    /*    $fxModal.init($scope).then(function (modal) {
     $scope.modal = modal;
     });*/
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
        var box = $('<div class="class-box"></div>').appendTo(detail);
        var leftdiv = $('<div class="left"></div>').appendTo(box);
        var rightdiv = $('<div class="right"></div>').appendTo(box);
        $('<div style="clear: both"></div>').appendTo(box);
        var imgEle = $('<img />').attr('src', this.Image).appendTo(leftdiv);
        var msg = $('<p class="msg">急速返还学费，只需<b>7</b><span>天</span></p>').appendTo(leftdiv);
        var pricediv = $('<div class="course-price"></div>').html('<b>' + this.Price + '</b><span>   学分</span>').appendTo(leftdiv);
        $('<p class="title"></p>').text(this.ProductName).appendTo(rightdiv);
        $('<P class="teach">课程讲师：<span>' + this.TeacherName + '</span></p>').appendTo(rightdiv);
        $('<p class="chap">课程章节</p>').appendTo(rightdiv);
        var ulEle = $('<ul></ul>').appendTo(rightdiv);
        $(this.Tag).each(function () {
          $('<li></li>').text(" • " + this.substring(3)).appendTo(ulEle);
        })
        var msgHeight = msg.css('height').split('px')[0]
        var imgHeight = imgEle.css('width').split('px')[0] * 0.576;
        var rightHeight = msgHeight * 1 + imgHeight * 1 + 14;
        rightdiv.css({'height': rightHeight + 'px'});
        var courseId = this.ProductId;
        box.click(function () {
          $ToDetailState.go('coursedetail',{courseId: courseId});
        })
      })
    }

    //组合课年级块大小
    var grpGrade = $('.group-class .grade');
    var grpGradeWidth = grpGrade.css('width').split('px')[0];
    var spanWidht = (grpGradeWidth - 25) / 4;
    var gsigGrade = grpGrade.find('.sig-grade');
    gsigGrade.css({'width': spanWidht + 'px', 'height': spanWidht / 2.55});
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
        var detail = $('<div class="class-detail"></div>').appendTo($('.group-class .class'));
        var box = $('<div class="class-box"></div>').appendTo(detail);
        var leftdiv = $('<div class="left"></div>').appendTo(box);
        var rightdiv = $('<div class="right"></div>').appendTo(box);
        $('<div style="clear: both"></div>').appendTo(box);
        var imgEle = $('<img />').attr('src', this.Image).appendTo(leftdiv);
        var msg = $('<p class="msg">课时数:<span class="hour">' + this.Hour + '</span></p>').appendTo(leftdiv);
        if (i < 3) {
          $('<span class="star last"></span><span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span>').appendTo(msg);
        }
        if (i > 2 && i < 6) {
          $('<span class="star last half"></span><span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span>').appendTo(msg);
        }
        if (i > 5) {
          $('<span class="star last"></span><span class="star"></span><span class="star"></span><span class="star"></span>').appendTo(msg);
        }
        var pricediv = $('<div class="course-price"></div>').html('<b>' + this.Price + '</b><span>   学分</span>').appendTo(leftdiv);
        $('<p class="title"></p>').text(this.ProductName).appendTo(rightdiv);
        var teachdiv = $('<P class="teach">课程讲师：<span class="span">' + this.TeacherName + '</span></p>').appendTo(rightdiv);
        var btndiv = $('<div class="btn"><span>立即注册  免费试听</span></div>').appendTo(rightdiv);
        var msgHeight = msg.css('height').split('px')[0]
        var imgHeight = imgEle.css('width').split('px')[0] * 0.576;
        var rightHeight = msgHeight * 1 + imgHeight * 1 + 10;
        var btnHeight = btndiv.css('width').split('px')[0] * 1 * 0.29;
        $('.btn span').css('line-height', btnHeight + 'px');
        teachdiv.css('margin-top', '5px');
        rightdiv.css({'height': rightHeight + 'px'});
        //$('.star').css('line-height', msg.css('height').split('px')[0] *1+10 + 'px');
        var courseId = this.ProductId;
        btndiv.click(function () {
          $ToDetailState.go('coursedetail',{courseId: courseId});
        })
        box.click(function () {
          $ToDetailState.go('coursedetail',{courseId: courseId});
        })
      })
    }

    //图片大小
    var img = $('.img');
    var imgWidth = img.css('width').split('px')[0];
    var sigImgWidht = (imgWidth - 12) / 3;
    img.find('div').css({'width': sigImgWidht + 'px', 'height': sigImgWidht + 'px'});
    img.find('.draw').css({'width': imgWidth + 'px', 'height': sigImgWidht + 'px'});


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
      var sigboxWidth = (teaConWidth - 24) / 3.5;

      $(data).each(function (i) {
        var sigbox = $('<div class="sigbox" id="teacher' + i + '"></div>').appendTo($('.teacher-content'));
        var pic = $('<div class="pic"></div>').appendTo(sigbox);
        var teaImg = $('<img src="' + this.Image + '" />').appendTo(pic);
        var teaSpan = $('<span></span>').text(this.Name + '老师').appendTo(sigbox);
        sigbox.css({'width': sigboxWidth + 'px'});
        pic.css({'width': sigboxWidth * 0.9 + 'px', 'height': sigboxWidth * 0.9 + 'px'});

      })

    }

  })
