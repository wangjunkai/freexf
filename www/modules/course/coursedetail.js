'use strict';


angular.module('freexf', ['ionic'])

  .controller('coursedetail_ctrl', function ($scope, $sce, $rootScope, $filter, $injector, $ionicLoading, $ionicScrollDelegate, $ionicPopup, $interval, $timeout, $state, $stateParams, localStorageService, AUTH, ENV, CourseDateRepository, AddMyFavoriteRepository, DelMyFavoriteRepository, AddFlower, RemoveFlower, GetCourseDetailRepository, GetCourseOutlineRepository, GetvideoUrlRepository, UpdateAPES, apes) {
    var GetvideoUrl = GetvideoUrlRepository(ENV._api.__GetvideoUrl)
    var GetCourseDetail = GetCourseDetailRepository(ENV._api.__GetCourseDetail);
    var GetCourseOutline = GetCourseOutlineRepository(ENV._api.__GetCourseOutline);
    var CourseDate = CourseDateRepository(ENV._api.__coursedate);
    var AddFavorite = AddMyFavoriteRepository(ENV._api.__addfavorite);
    var DelFavorite = DelMyFavoriteRepository(ENV._api.__delfavorite);
    var addFlower = AddFlower(ENV._api.__addflower);
    var removeFlower = RemoveFlower(ENV._api.__removeflower);
    var playset = document.getElementById('videoplay');
    $scope.courseId = $stateParams.courseId;
    $scope.userData = AUTH.FREEXFUSER.data;
    $scope.isLogin = $scope.userData.userLg ? true : false;
    $scope.buy = false;
    $scope.isbuy = false;
    $scope.nobuy = false;
    $scope.coursedetail = $stateParams.state == '1' ? false : true;	//课程介绍
    $scope.courseoutline = $stateParams.state == '1' ? true : false;	//大纲
    $scope.flowerstate = false;		//献花
    $scope.coursecollect = false;   //收藏状态
    $scope.isStyle;
    $scope.videShow = false;//播放显示
    $scope.courseList = [];
    var isGroupClass = false;
    $scope.showGroupCourse = false;
    $scope.htmlId = "";
    $scope.nowVideoPlayId = "";
    $scope.groupCourse = false;
    $scope.more = false;
    $scope.moreTxt = "展开更多";
    var params = {
      courseId: $scope.courseId,
      studentId: $scope.userData.userLg ? $scope.userData.rowId : '',
      Sign: $scope.userData.userLg ? $scope.userData.Sign : ''
    };
    var paramsflower = {
      ProductId: $scope.courseId,
      studentid: $scope.userData.userLg ? $scope.userData.rowId : '',
      Sign: $scope.userData.userLg ? $scope.userData.Sign : ''
    };
    $scope.$on('$ionicView.loaded', function () {
    });
    apes.apesFun('APES1');
    ;
    GetCourseDetail.getModel(params).then(function (res) {
      $scope.courseDate = res.response.data;
      $scope.coursecollect = $scope.courseDate.favorite;    //收藏
      $scope.flowerstate = $scope.courseDate.isCourseFlowers;   //鲜花
      $scope.teacher = $scope.courseDate.teacher.length == 0 ? false : true     //判断是否有讲师
      $scope.IsOpenCrouse = $scope.courseDate.IsOpenGroup == false ? "立即购买" : "尚未开课"; //是否开课
      $scope.a = $sce.trustAsHtml($scope.courseDate.courseIntroduce);
      $scope.b = $sce.trustAsHtml($scope.courseDate.teachingGoal);
      $scope.c = $sce.trustAsHtml($scope.courseDate.materialIntroduce);
      $scope.d = $sce.trustAsHtml($scope.courseDate.courseStrength);
      $scope.e = $scope.courseDate.teacherIntroduce;
      $scope.a == "" || $scope.a == null || $scope.a == "&nbsp;" ? $scope.isCourseShow = false : $scope.isCourseShow = true;
      $scope.b == "" || $scope.b == null || $scope.b == "&nbsp;" ? $scope.isObjectivesShow = false : $scope.isObjectivesShow = true;
      $scope.c == "" || $scope.c == null || $scope.c == "&nbsp;" ? $scope.isIntroductionShow = false : $scope.isIntroductionShow = true;
      $scope.d == "" || $scope.d == null || $scope.d == "&nbsp;" ? $scope.isAdvantageShow = false : $scope.isAdvantageShow = true;
      $scope.e.length == 0 || $scope.e[0] == "" || $scope.e[0] == "&nbsp;" || $scope.e[0] == null ? $scope.isProfileShow = false : $scope.isProfileShow = true;
      if ($scope.courseDate.CrouseBigList == null || $scope.courseDate.CrouseBigList.length == 0) {
        $scope.groupCourse = false;
        $scope.more = false;
        $scope.showGroupCourse = false
      } else {
        $scope.groupCourse = true;
        $scope.courseDate.CrouseBigList.length == 1 ? $scope.more = false : $scope.more = true;
        $scope.showGroupCourse = true;
      }
      if ($scope.courseDate.isPermissionCrouse == true) {   //开发者用户
        $scope.buy = true;
        $scope.isbuy = true;
        $scope.nobuy = false;
      } else {
        $scope.buy = false;
        $scope.isbuy = false;
        $scope.nobuy = true;
      }
      if ($scope.courseDate.IsOpenGroup) {
        $scope.nobuy = false;
      }
      //大纲
      GetCourseOutline.getModel(params).then(function (res) {
        $scope.courseList = res.response.data.CourseList;
        $scope.outlineFreeList = res.response.data.FreeCourse;
        $scope.endClassList = res.response.data.SeenPartList;  //已学完课程ID
        $scope.isPayed = res.response.data.isPayed;   //购买
        $scope.courseList.length == 1 ? isGroupClass = false : isGroupClass = true;
        $scope.isnull = $scope.courseList[0].OutlineList.length > 0 ? true : false;    //是否有章节
        isGroupClass ? $scope.htmlId = "coursegroup.html" : $scope.htmlId = "courseoutline.html";
        //$scope.courseDate.isPermissionCrouse = true;    //已购买
        if ($scope.isnull) {
          $scope.lastCharptId = $scope.courseDate.lastCharptId == null || $scope.courseDate.lastCharptId == "" ? $scope.courseList[0].OutlineList[0].CharpterList[0].uuRowId : $scope.courseDate.lastCharptId;
          getUrl($scope.lastCharptId, 'init');
        } else {
          $scope.lastCharptId = "";
          $scope.CharpterList = false;
        }

      });
    });
    $scope.moreGroupCourse = function () {
      $scope.groupCourse = !$scope.groupCourse;
      $scope.moreTxt == "展开更多" ? $scope.moreTxt = "收起" : $scope.moreTxt = "展开更多";
    }

    $scope.showAgreement = function () {
      if ($scope.userData.userLg) {
        PurchaseAgreement();
        setTimeout(function () {
          $('.goumaitit').attr('download', '购买协议')
        }, 100);
      }
      else {
        location.href = "#/login";
      }
    };
    $scope.collectState = function () {
      if ($scope.userData.userLg) {
        Favorite();
      } else {
        location.href = "#/login";
      }

    };
    $scope.flowerStateClick = function () {
      if ($scope.userData.userLg) {
        Flower();
      } else {
        location.href = "#/login";
      }
    };

    //课程介绍
    $scope.coursedetailClick = function () {
      $scope.coursedetail = true;
      $scope.courseoutline = false;
    };
    //课程大纲
    $scope.courseoutlineClick = function () {
      $scope.coursedetail = false;
      $scope.courseoutline = true;
    };
    //课程大纲伸缩展示（组合课）
    $scope.toggle = function ($event) {
      var $title = $($event.target).parents('li').find('.courseTitle');
      var $parLi = $title.parents('li');
      if ($title.hasClass('active')) {
        $parLi.find('.freexfcourseitem').slideUp();
        $title.removeClass('active');
      } else {
        $parLi.find('.freexfcourseitem').slideDown();
        $title.addClass('active');
      }
    }
    //课程大纲伸缩展示（非组合可）
    $scope.chapterToggle = function ($event) {
      var $title = $($event.target).parents('li.coursechapterli').find('.coursechapter');
      var $parLi = $title.parents('li.coursechapterli');
      if ($title.hasClass('active')) {
        $parLi.find('.chapter').slideUp();
        $title.removeClass('active');
      } else {
        $parLi.find('.chapter').slideDown();
        $title.addClass('active');
      }
    }
    //收藏取消收藏
    function Favorite() {
      if ($scope.coursecollect == false) {  //收藏
        AddFavorite.postModel({
          'ProductId': params.courseId,
          'studentid': params.studentId,
          'Sign': params.Sign
        }).then(function (res) {
          if (res.response.data.struts == true) {
            $scope.coursecollect = true;
          }
        });
      } else {
        //取消收藏
        DelFavorite.postModel({
          'ProductId': params.courseId,
          'studentId': params.studentId,
          'Sign': params.Sign
        }).then(function (res) {
          if (res.response.data.struts == true) {
            $scope.coursecollect = false;
          }
        })
      }
    };
    //献花取消献花
    function Flower() {
      if ($scope.flowerstate == false) {
        addFlower.postModel(paramsflower).then(function (res) {
          if (res.response.data.struts == true) {
            $scope.flowerstate = true;
            $scope.courseDate.flowers++;
          }
        });
      } else {
        //取消献花
        removeFlower.postModel(paramsflower).then(function (res) {
          if (res.response.data.struts == true) {
            $scope.flowerstate = false;
            $scope.courseDate.flowers--;
          }
        });
      }
      ;
    };
    //购买协议
    function PurchaseAgreement() {
      var confirmPopup = $ionicPopup.confirm({
        title: '购买协议' + '<a href="http://www.freexf.com/help/%E5%AD%A6%E8%B4%B9%E5%85%A8%E5%85%8D%E7%BD%91%E7%BD%91%E7%BB%9C%E8%8A%82%E7%9B%AE%E8%B4%AD%E4%B9%B0%E5%90%88%E5%90%8C.pdf" target="view_window" class="goumaitit" >(点击下载PDF)</a>',
        cssClass: 'freexf-agreement',
        template: '<div class="freexf-agreement">'
        + '<h5>学费全免网网络节目购买合同</h5>'
        + '<p class="MsoNormal" align="center" style="text-align:center;line-height:15.0pt;mso-pagination:widow-orphan;vertical-align:middle"><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span style="font-family: 微软雅黑, sans-serif;">甲方：学费全免网注册学员</span><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span style="font-family: 微软雅黑, sans-serif;">乙方：上海琦珺互联网信息科技有限公司（学费全免网）<span lang="EN-US">&nbsp; <o:p></o:p></span></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span style="font-family: 微软雅黑, sans-serif;">客服热线：<span lang="EN-US">400-803-6611 </span>服务时间：<span lang="EN-US">9:00-21:00</span>（全年无休）。</span><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;">&nbsp;</span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span style="font-family: 微软雅黑, sans-serif;">鉴于</span><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span style="font-family: 微软雅黑, sans-serif;">甲方签约成为乙方在线培训平台的学员用户，乙方将在本合同中告知甲方在学费全免网<span lang="EN-US">(www.freexf.com)</span>进行学习时需要注意的事项。甲方确认在仔细阅读本合同并完全了解本合同内容后，按本合同所列内容进行在线学习，具体条款如下：<span lang="EN-US"><o:p></o:p></span></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">&nbsp;</span></p><p class="MsoNormal" align="left" style="margin-left: 18pt; text-indent: -18pt; line-height: 15pt; vertical-align: middle;"><b><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">1.<span style="font-weight: normal; font-stretch: normal; font-size: 7pt; line-height: normal;">&nbsp;&nbsp;&nbsp;</span></span></b><b><span style="font-family: 微软雅黑, sans-serif;">课程学习<span lang="EN-US"><o:p></o:p></span></span></b></p><p class="MsoNormal" align="left" style="margin-left: 19.5pt; text-indent: -19.5pt; line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">1.1<span style="font-stretch: normal; font-size: 7pt; line-height: normal;">&nbsp; </span></span><span style="font-family: 微软雅黑, sans-serif;">甲方</span><span style="font-family: 微软雅黑, sans-serif;">可以通过先购买课程再进行学习，学习乙方所发布的相应课程。甲方在乙方网站上从订购、学习到学习完成以及最终返还的整个过程都将以<span lang="EN-US">“</span>学分<span lang="EN-US">”</span>的形式进行记录。<span lang="EN-US"><o:p></o:p></span></span></p><p class="MsoNormal" align="left" style="margin-left: 19.5pt; text-indent: -19.5pt; line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;">1.2<span style="font-stretch: normal; font-size: 7pt; line-height: normal;">&nbsp;&nbsp;</span></span><span style="font-family: 微软雅黑, sans-serif;">每门课程都有相应的有效期，有效期内甲方可以根据教学内容进行视频学习，也可根据自行水平选择性式或者反复性学习。</span><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;">&nbsp;</span></p><p class="MsoNormal" align="left" style="margin-left: 18pt; text-indent: -18pt; line-height: 15pt; vertical-align: middle;"><b><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">2.<span style="font-weight: normal; font-stretch: normal; font-size: 7pt; line-height: normal; ">&nbsp;&nbsp;&nbsp;</span></span></b><b><span style="font-family: 微软雅黑, sans-serif;">学费返还方式<span lang="EN-US"><o:p></o:p></span></span></b></p><p class="MsoNormal" align="left" style="margin-left: 19.5pt; text-indent: -19.5pt; line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">2.1<span style="font-stretch: normal; font-size: 7pt; line-height: normal;">&nbsp; </span></span><span style="font-family: 微软雅黑, sans-serif;">每门课程对应的有效期结束后的<span lang="EN-US">3-5</span>个工作日内，乙方将向甲方返还所购课程相对应的学费至最初甲方订购所使用的支付渠道账号。<span lang="EN-US"><o:p></o:p></span></span></p><p class="MsoNormal" align="left" style="margin-left: 19.5pt; text-indent: -19.5pt; line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">2.2<span style="font-stretch: normal; font-size: 7pt; line-height: normal;">&nbsp; </span></span><span style="font-family: 微软雅黑, sans-serif;">课程有效期到期后，甲方观看该课程视频学习的权限终止，但做练习题的次数、时间无限制。<b><span lang="EN-US"><o:p></o:p></span></b></span></p><p class="MsoNormal" align="left" style="margin-left: 19.5pt; text-indent: -19.5pt; line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">2.3<span style="font-stretch: normal; font-size: 7pt; line-height: normal;">&nbsp; </span></span><span style="font-family: 微软雅黑, sans-serif;">甲方应仔细阅读本合同后购买课程，所购课程付款成功即视为知晓并同意所有合同条款。所购课程视频一经开始，甲方不得申请退订。</span><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">&nbsp;</span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">3. </span><span style="font-family: 微软雅黑, sans-serif;">免责条款</span><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><b><span style="font-family: 微软雅黑, sans-serif;">甲方在“学费全免网”进行操作时，应审慎操作。如因甲方错误操作造成甲方利益受损的，“学费全免网”不承担任何责任。甲方的所有操作记录将被忠实地保存在乙方设备中，如有争议，以该记录为准。</span></b><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">&nbsp;</span><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span lang="EN-US" style="font-family: 微软雅黑, sans-serif;">4. </span><span style="font-family: 微软雅黑, sans-serif;">声明</span><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p><p align="center" style="text-align: center; margin: 0cm 0cm 0.0001pt;"></p><p class="MsoNormal" align="left" style="line-height: 15pt; vertical-align: middle;"><span style="font-family: 微软雅黑, sans-serif;">甲方承诺已了解合同内容，对粗体字提示内容的含义已经乙方释义或甲方已完全了解并无异<span lang="EN-US">.</span>。</span><span lang="EN-US" style="font-size: 10pt; font-family: 微软雅黑, sans-serif;"><o:p></o:p></span></p>'
        + '</div>',
        buttons: [
          {
            text: "拒绝",
            onTap: function (e) {
              //playset.play();
              //$scope.videShow = true;
            }
          },
          {
            text: "同意",
            type: 'button-balanced',
            onTap: function (e) {
              $rootScope.paycourseId = $scope.courseId;
              getDiscounts({StudentId: params.studentId, CourseId: params.courseId});
            }
          }
        ]
      });
    };
    $scope.zhekouId = [
      //中小学
      '7a0ce779f4194cc2ae136d26ad7af9b5',
      '084284722c9649e99467376746016d89',
      '536e5e67b81442879a448ec6c9dd4658',
      '50fd0fe57c5841de8158a349fd6e6e63',
      '77485d75eae846b682705897af56ed9b',
      '5583846da22c497dba607254c38746e7',
      //多语种
      '9b80691974e544abaffcdc77b75a7f4b',
      '72b04609c88e474a8d20a6ccf9e78341',
      'e7144e6af52a41e4af6ff52a2c421073',
      '7957f8e089e94d1281db0980b89fcffb',
      'dc11d8c0b80c48bba1b9382801ede9ea',
      '4b45418d06fa4a57bd1888935483071a',
      //英语
      '9802a643f232442dace7d97d2deb6a97',
      'c8acfeddf5534881a8e23ca29cd06d32',
      '9d5a5bfea1ad44a1844c1f288915e0b3',
      '4b7d85bf7d29486a92b6b808ac6979a7',
      //会计
      'efbae01348724a539b876080826416ac',
      '0ec52858dcc242f491594d6cf72ad061',
      '7d49475ba62e402cbdae3386b5450050',
      '378322b500964be0b1828f2d407e8ea3'
    ];
    function getRandomDiscount(obj) {
      var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetRandomDiscount&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + obj.StudentId + '","CourseId":"' + obj.CourseId + '"}';
      $.ajax({
        type: 'GET',
        cache: 'false',
        url: teacherList,
        dataType: "json",
        success: function (data) {
          if (data) {
            $state.go('pay', {DiscountCode: data.DiscountCode});
          }
        }
      });
    }

    function getDiscounts(obj) {
      var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetStudentDiscounts&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + obj.StudentId + '","CourseId":"' + obj.CourseId + '"}';
      $.ajax({
        type: 'GET',
        cache: 'false',
        url: teacherList,
        dataType: "json",
        success: function (data) {
          if (data.length > 0) {
/*            if ($.inArray(params.courseId, $scope.zhekouId) < 0) {
              $state.go('lottery', {courseId: $scope.courseId});
            } else {*/
              getRandomDiscount({StudentId: params.studentId, CourseId: params.courseId});
            /*}*/
          } else {
            $state.go('pay', {DiscountCode: ''});
          }
        }
      });
    }

    $scope.showPopup = function () {
      // 自定义弹窗
      var myPopup = $ionicPopup.show({
        title: '400-803-6611',
        cssClass: 'freexf-contact',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '拨打',
            type: 'button-positive',
            onTap: function (e) {
              location.href = "tel:400-803-6611";
            }
          },
        ]
      });
      myPopup.then(function (res) {
      });
    };
    //播放
    $scope.coursedVideoPlay = function (videoId, isplay) {
      $interval.cancel($rootScope.h5playtimeend);
      $scope.nowVideoPlayId = videoId;
      if (!$scope.userData.userLg) {    //未登录
        location.href = "#/login";
      } else if (!$scope.courseDate.isPermissionCrouse && isplay == 1) {    //试听
        getUrl(videoId);
      } else if ($scope.courseDate.isPermissionCrouse) {    //已购买课程
        getUrl(videoId);
      }
    };
    ////获取视频地址路径
    //function initGetUrl(id) {
    //    if (id != "") {
    //        GetvideoUrl.getModel({ 'PartId': id }).then(function (res) {
    //            var videourl = res.response.data;
    //            var playsetmp4 = document.getElementById('vpmp4');
    //            window.h5playtimeendOn = false;
    //            if (videourl != "") {
    //                playsetmp4.src = videourl;
    //            };
    //        });
    //    }
    //}
    function getUrl(id, init) {
      if (id != "") {
        GetvideoUrl.getModel({'PartId': id}).then(function (res) {
          var videourl = res.response.data;
          var playsetbox = document.getElementById('videobox');
          var playsetmp4 = document.getElementById('vpmp4');
          window.h5playtimeendOn = false;
          if (videourl != "") {
            if (typeof (document.getElementById('videoplay')) != undefined) {
              playsetbox.innerHTML = ''
            }
            var htmlboxa = '<video id="videoplay" style="width:100%;position:relative;z-index:10;" controls="controls" ><source id="vpmp4" src="' + videourl + '" type="video/mp4"></video>'
            playsetbox.innerHTML = htmlboxa
            //playsetmp4.src = videourl;
            if (typeof (init) == 'undefined') {
              document.getElementById('videoplay').play();
              $scope.videShow = true;
              $scope.isbuy = false;
              $scope.nobuy = false;
              playTimeFun(id)
              var studentId = 'as_studentId=' + params.studentId;
              var courseId = 'as_courseId=' + params.courseId;
              var chaptId = 'as_chapterId=' + id;
              var getUrlData = '/MFreeXFapi/student/UpdateLastCharptId';
              $.ajax({
                type: 'POST',
                cache: 'false',
                url: getUrlData,
                data: studentId + '&' + courseId + '&' + chaptId,
                success: function (data) {
                },
                error: function (data) {
                }
              });

            } else {

            }
          }
          ;
          apes.apesFun('APES5');
          ;

        });
      }
    }

    var playTimeFun = function (zhangjieid) {
      //var playset = document.getElementById('videoplay');
      //window.h5playtimeendOn = true;
      window.pagetime = 0;
      $rootScope.h5playtimeend = $interval(function () {
        //console.log(window.playnowtimeNum)
        window.pagetime = window.pagetime + 5;
        //window.playnowtimeNum = playset.currentTime;
        //window.totletimeNum = playset.duration;
        console.log(window.pagetime);
        if (window.pagetime >= 300) {
          //&& window.pagetime/window.totletimeNum>=0.8
          //控件播放时间80%&&页面停留时间80%，触发
          var studentId = 'as_studentId=' + params.studentId;
          var courseId = 'as_courseId=' + params.courseId;
          var chaptId = 'as_chapterId=' + zhangjieid;
          var getUrlData = '/MFreeXFapi/student/UpdateCourseProgress';
          $.ajax({
            type: 'POST',
            cache: 'false',
            url: getUrlData,
            data: studentId + '&' + courseId + '&' + chaptId,
            success: function (data) {
              $interval.cancel($rootScope.h5playtimeend);
            },
            error: function (data) {
              $interval.cancel($rootScope.h5playtimeend);
            }
          });
        }
        ;

      }, 5000)
    }

    $scope.fn = function (item, nowId, buy) {
      if (nowId && buy) {
        return item == nowId;
      } else {
        return false;
      }
    };
    $scope.goStudy = function (courseId, state) {
      $state.go('coursedetail', {courseId: courseId, state: state});
    }

  })
  .directive('scrollCourseTab', ['$location', '$ionicScrollDelegate', function ($location, $ionicScrollDelegate) {
    return function ($scope, $element, $attrs) {
      var content = $($element).find('ion-content')[0];
      var coursecontent = $($element).find('#coursedetail');
      var tabs = $($element).find('#tabs')[0];
      var tabs_height = $(tabs).outerHeight();
      var header_height = 44;
      var header_sub_height = header_height + tabs_height;
      $(content).bind('scroll', function (e) {
        e.preventDefault();
        var top = $(coursecontent).offset().top;
        if (top <= header_sub_height) {
          $(tabs).css('top', 44)
        } else if (top > header_sub_height) {
          $(tabs).css('top', -tabs_height)
        }
      })
    }
  }])
  .directive('scrollCourseTab', ['$location', '$ionicScrollDelegate', function ($location, $ionicScrollDelegate) {
    return function ($scope, $element, $attrs) {
      var rowId = $($element).find('ion-content')[0];

    }
  }])

  .filter('teacherPath', function () {
    return function (item, num) {
      if (item == '' || item == '/images/courses/default-teacher.png') {
        return 'img/course/teacher_img.png';
      } else {
        return item;
      }
    }
  })
  .filter('studyEnd', function () {
    return function (item, endClassList, buy) {
      if (buy) {
        return endClassList.indexOf(item) > -1;
      } else {
        return false;
      }

    }
  })
  .filter('cutCharptName', function () {
    return function (item) {
      //var pattern=/(.*).mp4$/g
      return item ? "上次学到：" + item : "您还没有学习该课程";
    }
  })
