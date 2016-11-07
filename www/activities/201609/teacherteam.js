'use strict';

angular.module('freexf')
  .controller('teacherteam_ctrl', function ($scope, $rootScope, $injector, $location, $state, $ToDetailState) {
    $scope.teacherTeam = [[{
      "teacherName": "郝佳老师",    //语文
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/郝佳/郝佳.png",
      "teacherInfo": "曾在某国际学校任职语文教师，所辅导学生多名考入各大名校，取得作文比赛好成绩。热爱教育, 讲课风趣幽默，亲和力强；逻辑思维严密，重点突出。善于运用多种教学方式,培养学生对于语文学科的兴趣。",
      "teacherTrait": "魅力点：良师益友、风趣幽默"
    }, {
      "teacherName": "公慧老师",
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/公慧/公慧.png",
      "teacherInfo": "曾在山东省临沂市重点高中担任语文老师，深受学生喜爱，多名学生显著提高成绩，考入理想名校。注重启发学生的开放思维，引起学生对语文的兴趣，特别关注学生的课堂反应和对学生价值观的引导。",
      "teacherTrait": "魅力点：循循善诱、开放思维"
    }], [{
      "teacherName": "田宏老师",    //数学
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/田宏/田宏.png",
      "teacherInfo": "在某校任职期间，辅导的学生中有考上同济大学、南开大学、武汉大学、大连理工大学、中央财经大学、中国科技技术大学、河海大学、重庆大学、西北农林科技大学等重点大学。",
      "teacherTrait": "魅力点：生动风趣、良师益友"
    }, {
      "teacherName": "嵇陈华老师",
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/嵇陈华/嵇陈华.png",
      "teacherInfo": "在某校任职期间，辅导的学生中有考上同济大学、南开大学、武汉大学、大连理工大学、中央财经大学、中国科技技术大学、河海大学、重庆大学、西北农林科技大学等重点大学。授课讲解细腻，引导学生主动思考。熟悉教材以及中考命题方向，擅长教材解读与设计。",
      "teacherTrait": "魅力点：直击考点、由浅入深"
    }], [{
      "teacherName": "Andrew老师",   //英语
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/鲁安达/鲁安达.png",
      "teacherInfo": "擅长情景化教学，一线教学经验丰富。一直参与编写教学教辅资料，辅导学生多次在各大外语学科竞赛中取得好成绩。",
      "teacherTrait": "魅力点：寓教于乐、适合中国孩子的英语学习方法"
    }, {
      "teacherName": "谭铎老师",
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/谭铎/谭铎.png",
      "teacherInfo": "从事一线教学工作十年以来，在所带学段培养出大批的优秀毕业生；曾有学生通过辅导在短短的两个月时间从一模考到中考提高了36分。历年中考均有多名学生考入上海中学，华师大附二中，延安中学，格致中学，建平中学等上海市重点高中。",
      "teacherTrait": "魅力点：直击考点、循循善诱"
    }], [{
      "teacherName": "孙万丽老师",    //物理
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/孙万丽/孙万丽.png",
      "teacherInfo": "2005年高中会考所带班级物理学科全优通过；2009年高考所带物理学科平均成绩达到112分；2011年至2015年连续4年间，多名学生考入重点大学。将系统的有效学习思路带入课堂， 把完备的知识，用直接、简单的方法呈现给学生，重在让学生掌握与提分。",
      "teacherTrait": "魅力点：循循善诱、高效教学"
    }, {
      "teacherName": "祁永亮老师",
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/祁永亮/祁永亮.png",
      "teacherInfo": "教龄10年，辅导出多位学生以优异成绩考入清华、北大、交大等重点高等院校。注重学习效率提高和学生心理辅导，让学生感受到学习成就感。荣获上市教育集团教师风采大赛一等奖及“骨干教师”称号。",
      "teacherTrait": "魅力点：按需教授、直击考点、资历深厚"
    }], [{
      "teacherName": "谭琳老师",    //地理
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/谭琳/谭琳.png",
      "teacherInfo": "自参加工作以来，一直战斗在高考地理教学一线，对高考地理学科有深入研究。地理知识丰富，学生称为“行走的世界地图”。",
      "teacherTrait": "魅力点：专业、随和、有耐心"
    }, {
      "teacherName": "方珍老师",    //历史
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/方珍/方珍.png",
      "teacherInfo": "十多年从教经历，积累了丰富的教学经验。教授的班级历史高考成绩获得全市优胜奖；公校任职期间多次获得全市历史优质课比赛奖项；多次参与全市历史阅卷和优质课评比等历史教研活动。",
      "teacherTrait": "魅力点：善于沟通、亲和力强"
    }, {
      "teacherName": "汪晴老师",    //化学
      "teacherImg": "http://bucketcourse.oss-cn-shanghai.aliyuncs.com/teacher/汪晴/汪晴.png",
      "teacherInfo": "帮助多名后进生打破不及格的“魔咒”，注重培养学生的综合能力，传授考试技巧，让学生会学习更会考试，深受学生们的信赖，多名学生考入同济大学、厦门大学、北京工业大学等名校。",
      "teacherTrait": "魅力点：对症下药、直击考点"
    }],];
    $scope.teacher = $scope.teacherTeam[0];
    getCourseList();
    $scope.courseList;
    $scope.course1;
    $scope.course2;
    $scope.course3;
    $scope.tabs = function (n, $event) {
      var childLi = document.querySelectorAll('.teacherteam-nav li');
      for (var i = 0; i < childLi.length; i++) {
        childLi[i].className = "tab-item";
      }
      $($event.target).addClass("active");
      $($event.target).parents('li').addClass("active");
      $scope.teacher = $scope.teacherTeam[n];
      switch (n) {
        case '0':
          $scope.course1 = $scope.courseList.CourseList5;
          $scope.course2 = $scope.courseList.CourseList6;
          break;
        case '1':
          $scope.course1 = $scope.courseList.CourseList3;
          $scope.course2 = $scope.courseList.CourseList4;
          break;
        case '2':
          $scope.course1 = $scope.courseList.CourseList1;
          $scope.course2 = $scope.courseList.CourseList2;
          break;
        case '3':
          $scope.course1 = $scope.courseList.CourseList9;
          $scope.course2 = $scope.courseList.CourseList10;
          break;
        case '4':
          $scope.course1 = $scope.courseList.CourseList7;
          $scope.course2 = $scope.courseList.CourseList8;
          $scope.course3 = $scope.courseList.CourseList11;
          break;
      }
    }
    //传递：courseId 课程ID
    $scope.toCourseDate = function (courseId) {
      $ToDetailState.go('coursedetail', {courseId: courseId});
    };
    $scope.tele = function () {
      $ToDetailState.go('telephone', {telephone: '400-803-6611'})
    };
    function getCourseList() {
      var courseListUrl = '/Entrace/Dispatch.aspx?FunctionName=Activity.GetTeacherCourse&Version=1&EndClientType=H5&Key=""&JsonPara={}';
      $.ajax({
        type: 'POST',
        cache: 'false',
        url: courseListUrl,
        dataType: "json",
        success: function (data) {
          $scope.$apply(function () {
            if (data) {
              $scope.courseList = data;
              $scope.course1 = $scope.courseList.CourseList5;
              $scope.course2 = $scope.courseList.CourseList6;
            }
          })
        }
      });
    }
  })
