'use strict';

angular.module('freexf')
  .controller('courseDiscount_ctrl', function ($scope, $rootScope, $injector, $location, $state, $ionicPopup, $frModal, $ionicLoading, AUTH, ENV, DispatchRepository) {
      var MulCourseData = [];
      var k12CourseData = [];
      var accountCourseData = [];
      var engCourseData = [];
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

      var count = 0;
      var pageMax = 6;
      var order = "desc";
      var orderBy = "zonghe";
      var CourseList = DispatchRepository(ENV._api.__Dispatch, '/Entrace');
      function getCourseList(index, category1, category2) {
          CourseList.getModel({
              "FunctionName": 'Student.GetCourseListNew',
              "Version": 1,
              "EndClientType": 'H5',
              "JsonPara": {
                  "Category": category1,
                  "Second": category2,
                  "Thirdly": "",
                  "OrderBy": orderBy,
                  "Order": order,
                  "PageIndex": count,
                  "PageMax": pageMax
              }
          }).then(function (res) {
              if (index == 1) {
                  $scope.courseList1 = res.response.data;
              } else if (index == 2) {
                  $scope.courseList2 = res.response.data;
              } else if (index == 3) {
                  $scope.courseList3 = res.response.data;
              } else if (index == 4) {
                  $scope.courseList4 = res.response.data;
              }

          })
      }
      getCourseList(1, '多语种', '日语');
      getCourseList(2, '中小学', '四年级');
      getCourseList(3, '会计职业', '会计从业资格');
      getCourseList(4, '英语', '托福');

      //传递：courseId 课程ID
      $scope.toCourseDate = function (name, data, back) {
          $frModal.openModal($scope, name, modal_ary, data, back);
      };

      var $div_li = $('.multilingual .active_tab_menu ul li');
      $div_li.click(function () {
          var text = $(this).text();
          $(this).addClass("on").siblings().removeClass("on");
          getCourseList(1, '多语种', text, '');
      })

      var $div_li = $('.k12 .active_tab_menu ul li');
      $div_li.click(function () {
          var text = $(this).text();
          $(this).addClass("on").siblings().removeClass("on");
          getCourseList(2, '中小学', text, '');
      })

      var $div_li = $('.accounting .active_tab_menu ul li');
      $div_li.click(function () {
          var text = $(this).text();
          $(this).addClass("on").siblings().removeClass("on");
          getCourseList(3, '会计职业', text, '');
      })

      var $div_li = $('.english .active_tab_menu ul li');
      $div_li.click(function () {
          var text = $(this).text();
          $(this).addClass("on").siblings().removeClass("on");
          getCourseList(4, '英语', text, '');
      })

      $('.multilingual .active_course_list').append('<div class="more-course-button">点击了解更多多语种课程</div>');
      $('.k12 .active_course_list').append('<div class="more-course-button">点击了解更多中小学课程</div>');
      $('.accounting .active_course_list').append('<div class="more-course-button">点击了解更多会计课程</div>');
      $('.english .active_course_list').append('<div class="more-course-button">点击了解更多英语课程</div>');
      //多语种课程跳转
      $('.multilingual .more-course-button').click(function () {
          window.open('/mobile/www_ipad/index.html#/courseplate/%E5%A4%9A%E8%AF%AD%E7%A7%8D&&', '_self');
      })
      //中小学课程跳转
      $('.k12 .more-course-button').click(function () {
          window.open('/mobile/www_ipad/index.html#/courseplate/%E4%B8%AD%E5%B0%8F%E5%AD%A6&&', '_self');
      })
      //会计课程跳转
      $('.accounting .more-course-button').click(function () {
          window.open('/mobile/www_ipad/index.html#/courseplate/%E4%BC%9A%E8%AE%A1%E8%81%8C%E4%B8%9A&&', '_self');
      })
      //英语课程跳转
      $('.english .more-course-button').click(function () {
          window.open('/mobile/www_ipad/index.html#/courseplate/%E8%8B%B1%E8%AF%AD&&', '_self');
      })
  })
