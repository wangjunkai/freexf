'use strict';


angular.module('freexf', ['ionic'])

  .controller('coursedetail_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $ionicPopup, $timeout, $state, $stateParams, AUTH, ENV, CourseDateRepository, AddMyFavoriteRepository, DelMyFavoriteRepository, IsFlowerClass, AddFlower, RemoveFlower) {
      var CourseDate = CourseDateRepository(ENV._api.__coursedate);
      var AddFavorite = AddMyFavoriteRepository(ENV._api.__addfavorite);
      var DelFavorite = DelMyFavoriteRepository(ENV._api.__delfavorite);
      var isFlower = IsFlowerClass(ENV._api.__IsFlowerClass);
      var addFlower = AddFlower(ENV._api.__addflower);
      var removeFlower = RemoveFlower(ENV._api.__removeflower);     
      $scope.courseId = $stateParams.courseId;
      $scope.userData = AUTH.FREEXFUSER.data;
      $scope.isLogin = $scope.userData.userLg ? true : false;
      $scope.buy = false;
      $('#viewContent').addClass('has-footer');
      $scope.coursedetail = $stateParams.state == '1' ? false : true;	//课程介绍
      $scope.courseoutline =$stateParams.state=='1'?true:false;	//大纲
      $scope.flowerstate = false;		//献花
      $scope.coursecollect = false;   //收藏状态
      $scope.isStyle;
      $scope.videShow = false;//播放显示
      var params = {
          courseId: $scope.courseId,
          studentId: $scope.userData.userLg ? $scope.userData.rowId : '',
          Sign: $scope.userData.userLg ? $scope.userData.Sign : ''
      };
      var paramsflower = {
          courseId: $scope.courseId,
          studentid: $scope.userData.userLg ? $scope.userData.rowId : '',
          Sign: $scope.userData.userLg ? $scope.userData.Sign : ''
      };
      CourseDate.getModel(params).then(function (res) {
          $scope.courseDate = res.response.data;
          var outline = res.response.data.l_RetValueall;
          $scope.coursecollect = $scope.courseDate.favorite;
          $scope.flowerstate = $scope.courseDate.isCourseFlowers;
          var arr = [];
          //$scope.courseDate.isPermissionCrouse = true;    //已购买
          if ($scope.courseDate.isPermissionCrouse == true) {
              $scope.buy = true;
              $('#viewContent').removeClass('has-footer');
              for (var i = 0; i < outline.length; i++) {
                  for (var j = 0; j < outline[i].length; j++) {
                      if (outline[i][j].isNoFree == true) {
                          outline[i][j].isNoFree = false;   //除试听其他课程改为不是试听
                      }
                  }
              }
              $scope.outlineList = outline;
          } else {             
              for (var i = 0; i < outline.length; i++) {
                  for (var j = 0; j < outline[i].length; j++) {
                      if (outline[i][j].isNoFree == true) {                          
                          arr.push(JSON.parse(JSON.stringify(outline[i][j])));
                          outline[i][j].isNoFree = false;   //将除试听以外的章节内容改为不是试听课程
                          outline[i][j].videoUrl = null;
                          for (var e = 0; e < arr.length; e++) {
                              arr[e].chapter = "试听课程";
                          }
                          var len = outline.unshift(arr);
                      }
                  }
              }              
              $scope.outlineList = outline;
          };         

          $scope.a=$scope.courseDate.courseIntroduce;
          $scope.b = $scope.courseDate.teachingGoal;
          $scope.c = $scope.courseDate.materialIntroduce;
          $scope.d = $scope.courseDate.courseStrength;
          $scope.e = $scope.courseDate.teacherIntroduce;
          $scope.a == "" || $scope.a == null || $scope.a == "&nbsp;" ? $scope.isCourseShow = false : $scope.isCourseShow = true;
          $scope.b == "" || $scope.b == null || $scope.b == "&nbsp;" ? $scope.isObjectivesShow = false : $scope.isObjectivesShow = true;
          $scope.c == "" || $scope.c == null || $scope.c == "&nbsp;" ? $scope.isIntroductionShow = false : $scope.isIntroductionShow = true;
          $scope.d == "" || $scope.d == null || $scope.d == "&nbsp;" ? $scope.isAdvantageShow = false : $scope.isAdvantageShow = true;
          $scope.e == "" || $scope.e == null || $scope.e == "&nbsp;" ? $scope.isProfileShow = false : $scope.isProfileShow = true;


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
      //收藏取消收藏    
      function Favorite() {
          if ($scope.coursecollect == false) {  //收藏                
              AddFavorite.postModel(paramsflower).then(function (res) {
                  if (res.response.data.struts == true) {
                      $scope.coursecollect = true;
                  }
              });
          } else {
              //取消收藏
              DelFavorite.postModel(params).then(function (res) {
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
                       + '<p>甲方：学员<br/>已方：学费全免网（上海琦珺互联网信息科技有限公司）<br/>鉴于<br/>甲方：学员<br/>已方：学费全免网（上海琦珺互联网信息科技有限公司）<br/>鉴于<br/>'
                       + '甲方签约成为乙方在线培训平台的学员用户，乙方将在本须知中告知甲方在学费全免网进行学习是需要注意的事项。甲方确认在仔细阅读本须知并完全了解本须知内容后，按本须知所列内容进行在线学习：'
                               + '1.  课程学习'
                               + '1.1乙方在学费全免网所发布的课程，甲方学习该课程需要支付“报名费”，“报名费”以“学分”标注价格，1“学分”=1元人民币。'
                               + '1.2乙方在学费全免网所发布的所有课程均有课程有效期。在课程有效期内，甲方可以观看该课程下包含的所有学习视频、做练习题。观看视频、做练习题的次数无限制，但只对第一次做题的成绩做记录。'
                               + '1.3甲方应当按照所选课程的教学顺序进行学习，未完整观看前一章节视频则无法获得后一章节学习视频和练习题的权限。'
                               + '1.4课程有效期到期后，甲方观看该课程学习视频的权限终止，但做练习题的次数、时间无限制。'
                               + '1．5甲方观看所购课程视频完成率达到100%后，乙方视甲方完成该课程的学习。乙方将向甲方奖励等同于甲方所购课程的“奖学金”。'
                               + '2.  奖学金'
                               + '2.1甲方每观看完一个课程视频，乙方将会为甲方记录下完成该课程视频所应获得的“奖学金”。每一课程视频对应的“已获得奖学金”=（该课程报名费/该课程视频总数）。'
                               + '2.2 甲方还可以通过完成“奖学金任务”获得额外的“已获得奖学金”。'
                               + '2.3 课程有效期结束后，乙方将甲方“已获得奖学金”换算为人民币发放至甲方指定的银行账户。</p>'
                       + '</div>',
              buttons: [
               {
                   text: "拒绝",
                   onTap: function (e) {
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
      $scope.coursedVideoPlay = function (videourl) {
          if (!$scope.userData.userLg) {
              location.href = "#/login";
          } else if (videourl == '') {              
              PurchaseAgreement();
          }else {
              var playset = document.getElementById('videoplay');
              var playsetmp4 = document.getElementById('vpmp4');

              playsetmp4.src = videourl;
              //playset.play()
              playset.load();
              $scope.videShow = true;
          }         
      };
  })
