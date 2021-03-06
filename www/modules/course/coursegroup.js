'use strict';


angular.module('freexf', ['ionic'])

  .controller('coursegroup_ctrl', function ($scope, $sce, $rootScope,$filter, $injector, $ionicLoading, $ionicScrollDelegate, $ionicPopup, $timeout, $state, $stateParams, AUTH, ENV, CourseDateRepository, AddMyFavoriteRepository, DelMyFavoriteRepository, AddFlower, RemoveFlower, GetCourseDetailRepository, GetCourseOutlineRepository, GetvideoUrlRepository) {
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
      $scope.isGroupClass = false;
      $scope.htmlId = "";
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
      GetCourseDetail.getModel(params).then(function (res) {
          $scope.courseDate = res.response.data;
          $scope.coursecollect = $scope.courseDate.favorite;    //收藏
          $scope.flowerstate = $scope.courseDate.isCourseFlowers;   //鲜花
          $scope.teacher = $scope.courseDate.teacher.length == 0 ? false : true     //判断是否有讲师
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
          //$scope.courseDate.isPermissionCrouse = true;    //已购买
          if ($scope.courseDate.isPermissionCrouse == true) {   //开发者用户已购买
              $scope.buy = true;
              $scope.isbuy = true;
          } else {  //未购买
              $scope.buy = false;
              $scope.nobuy = true;
          };
      });
      //大纲
      GetCourseOutline.getModel(params).then(function (res) {
          $scope.courseList = res.response.data.CourseList;
          $scope.outlineFreeList = res.response.data.FreeCourse;
          $scope.endClassList = res.response.data.SeenPartList;  //已学完课程ID
          $scope.isPayed = res.response.data.isPayed;   //购买
          $scope.courseList.length == 1 ? $scope.isGroupClass = false : $scope.isGroupClass = true;
          $scope.isGroupClass ? $scope.htmlId = "coursegroup.html" : $scope.htmlId = "courseoutline.html";
      });
      $scope.showAgreement = function () {
          if ($scope.userData.userLg) {
              PurchaseAgreement();
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
              AddFavorite.postModel({ 'ProductId': params.courseId, 'studentid': params.studentId, 'Sign': params.Sign }).then(function (res) {
                  if (res.response.data.struts == true) {
                      $scope.coursecollect = true;
                  }
              });
          } else {
              //取消收藏
              DelFavorite.postModel({ 'ProductId': params.courseId, 'studentId': params.studentId, 'Sign': params.Sign }).then(function (res) {
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
          };
      };
      //购买协议
      function PurchaseAgreement() {
          var confirmPopup = $ionicPopup.confirm({
              title: '购买协议',
              cssClass: 'freexf-agreement',
              template: '<div class="freexf-agreement">'
                       + '<h5>学费全免网网络节目购买合同</h5>'
                       + '<p>&nbsp;&nbsp;&nbsp;&nbsp;甲方：学员<br/>&nbsp;&nbsp;&nbsp;&nbsp;已方：学费全免网（上海琦珺互联网信息科技有限公司）<br/>&nbsp;&nbsp;&nbsp;&nbsp;鉴于<br/>&nbsp;&nbsp;&nbsp;&nbsp;甲方签约成为乙方在线培训平台的学员用户，乙方将在本合同中告知甲方在学费全免网进行学习是需要注意的事项。甲方确认在仔细阅读本合同并完全了解本合同内容后，按本合同所列内容进行在线学习：<br/>'
                               + '&nbsp;&nbsp;&nbsp;&nbsp;1. 奖学金<br/>'
                               + '&nbsp;&nbsp;&nbsp;&nbsp;1.1课程有效期内甲方观看所购课程视频完成率达到100%后，视甲方完成该课程的学习。课程有效期结束后乙方将向甲方奖励等同于甲方所购课程“报名费”金额的“奖学金”。<br/>'
                               + '&nbsp;&nbsp;&nbsp;&nbsp;1.2课程有效期结束（**日）后，甲方可申请将“已获得奖学金”换算为人民币提取至甲方支付“报名费”时所使用的银行账户或支付宝账户中。<br/>'
                               + '&nbsp;&nbsp;&nbsp;&nbsp;2. 课程学习<br/>'
                                + '&nbsp;&nbsp;&nbsp;&nbsp;2.1乙方在学费全免网所发布的课程，甲方学习该课程需要支付“报名费”，“报名费”以“学分”标注价格，1“学分”=1元人民币。<br/>'
                                + '&nbsp;&nbsp;&nbsp;&nbsp;2.2乙方在学费全免网所发布的所有课程均有课程有效期。在课程有效期内，甲方可以观看该课程下包含的所有学习视频、做练习题。观看视频、做练习题的次数无限制。<br/>'
                                + '&nbsp;&nbsp;&nbsp;&nbsp;2.3甲方应当按照所选课程的教学顺序进行学习，未完整观看前一章节视频则无法获得后一章节学习视频和练习题的权限。<br/>'
                                + '&nbsp;&nbsp;&nbsp;&nbsp;2.4课程有效期到期后，甲方观看该课程学习视频的权限终止，但做练习题的次数、时间无限制。<br/>'
                                + '&nbsp;&nbsp;&nbsp;&nbsp;2.5 甲方应仔细阅读本合同后购买课程，所购课程付款成功即视为知晓并同意所有合同条款。所购课程视频一经开始，甲方不得申请退订。中途退订的，视为甲方违约，违约金相当于甲方未观看视频部分的价格。<br/>'
                                + '<br/>'
                                + '&nbsp;&nbsp;&nbsp;&nbsp;3. 免责条款<br/>'
                                + '&nbsp;&nbsp;&nbsp;&nbsp;甲方在学费全免网网站进行操作时，应审慎操作。如因甲方错误操作造成甲方利益受损的，乙方不承担任何责任。甲方的所有操作记录将被忠实地保存在乙方设备中，如有争议，以该记录为准。<br/>'
                                + '<br/>'
                                + '&nbsp;&nbsp;&nbsp;&nbsp;4. 声明<br/>'
                                + '&nbsp;&nbsp;&nbsp;&nbsp;甲方承诺已了解合同内容，对粗体字提示内容的含义已经乙方释义或甲方已完全了解无异议.。</p>'
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
                       location.href = "#/pay";
                   }
               }
              ]
          });
      };
      //播放
      $scope.coursedVideoPlay = function (videoId, isplay) {                  
              if (!$scope.userData.userLg) {    //未登录
                  location.href = "#/login";
              } else if (!$scope.courseDate.isPermissionCrouse && isplay == 1) {    //试听
                  getUrl(videoId);
              } else if ($scope.courseDate.isPermissionCrouse) {    //已购买课程
                  getUrl(videoId);
              }          
      };
      //获取视频地址路径
      function getUrl(id) {
          GetvideoUrl.getModel({ 'PartId': id }).then(function (res) {
              var videourl = res.response.data;
              var playsetmp4 = document.getElementById('vpmp4');
              if (videourl != "") {
                  playsetmp4.src = videourl;
                  playset.load();
                  $scope.videShow = true;
                  $scope.isbuy = false;
                  $scope.nobuy = false;
              }
          });
      }
      var playTimeFun = function () {
          var playset = document.getElementById('videoplay');
          var h5playtimeend = setInterval(function () {
              window.pagetime = window.pagetime + 10;
              window.playnowtimeNum = playset.currentTime;
              window.totletimeNum = playset.duration;
              //if (window.totletimeNum > 1) {
              //    setCookie('zhangjie' + window.location.href.split('play-')[1].split('-')[0], window.playnowtimeNum, 30, "/")
              //    $('.video-top-bg').removeClass('error')
              //    if (window.hptplay == 'play') {
              //        playset.pause();
              //        window.hptplay = 'theplay';
              //        playset.play();
              //    };
              //};
              if (window.playnowtimeNum / window.totletimeNum >= 0.8 && window.t80 != 't80ok') {
                  //&& window.pagetime/window.totletimeNum>=0.8
                  //控件播放时间80%&&页面停留时间80%，触发
                  var studentId = 'as_studentId=';
                  var courseId = 'as_courseId=';
                  var chaptId = 'as_chapterId=';
                  var getUrlData = '/MFreeXFapi/student/UpdateCourseProgress?' + studentId + '&' + courseId + '&' + chaptId;
                  $.ajax({
                      type: 'POST',
                      cache: 'false',
                      url: getUrlData,
                      success: function (data) {
                          if (data == true && window.totletimeNum > 0) {
                              window.t80 = 't80ok';
                              isShowFun();
                          }
                      },
                      error: function (data) { }
                  });
              };
              if (window.playnowtimeNum / window.totletimeNum == 1) {
                  clearInterval(h5playtimeend);
                  setCookie('zhangjie' + window.location.href.split('play-')[1].split('-')[0], 0, 30, "/");
              };
          }, 1000)
      }
      //playTimeFun()
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
        if (item == '') {
            return 'img/course/teacher_img.png';
        } else {
            return item;
        }
    }
})
.filter('studyEnd', function () {
    return function (item, endClassList) {
        return endClassList.indexOf(item) > -1;
    }
})
