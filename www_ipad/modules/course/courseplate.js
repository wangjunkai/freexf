'use strict';


angular.module('freexf')
  .controller('courseplate_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, $stateParams, $http, $ionicScrollDelegate, $frModal, ENV, CourseListRepository, NewGetCategoryRepository) {
      var count = 0;
      var pageMax = 6;
      var order = "desc";
      var orderBy = "zonghe";
      $scope.uppageshow = false;
      $scope.courseList = [];
      $scope.bottomtext = ''
      $scope.Category1 = $stateParams.Category1;  //一级分类
      $scope.Category2 = $stateParams.Category2;  //二级分类
      ($scope.Category2 == "") ? $scope.lingual = "全部" : $scope.lingual = $scope.Category2;
      var isLanguageClass = $scope.Category1 == "中小学" ? true : false
      $scope.languageClass = false;  //中小学课程分类
      $scope.languageClassList = [];
      $scope.gradeclass = false;   //分类收缩状态
      $scope.gradeClassShow = function () {
          $scope.gradeclass = !$scope.gradeclass;
          isLanguageClass ? $scope.languageClass = !$scope.languageClass : false;
      };
      //获取课程列表
      var CourseList = CourseListRepository(ENV._api.__courselistpage);
      CourseList.getModel({
          "category": $scope.Category1,
          "lingual": $scope.Category2,
          "label": "",
          "orderBy": "zonghe",
          "order": "desc",
          "pageIndex": count,
          "pageMax": pageMax
      }).then(function (res) {
          $ionicScrollDelegate.scrollTop();
          //分页初始化
          count = 0;
          $scope.courseList = res.response.data;
          $scope.uppageshow = true;
      });
    //获取一二级分类菜单
      var GetCategory = NewGetCategoryRepository(ENV._api.__GetCategory_v01);
      GetCategory.getModel().then(function (res) {
          $scope.Category1List = res.response.data[0]['ls_Category'];
          getIdx($scope.Category1List);
          $scope.categorys = res.response.data[0]['ls_lingualList'][$scope.Category1Idx];   //二级分类菜单
          //$scope.categorys = isLanguageClass ? categorys.splice(0, categorys.length - 1) : categorys;

          if ($scope.Category1Idx == 1) {
              var languageClassList = res.response.data[0]['ls_lingualList'][6];
              $scope.languageClassList = isLanguageClass ? languageClassList.splice(0, languageClassList.length - 1) : languageClassList;
          }

      });
      //已知一级分类获取一级分类的下标
      function getIdx(arry) {
          $scope.Category1Idx = null;
          for (var i = 0; i < 6; i++) {
              if (arry[i] == $scope.Category1) {
                  $scope.Category1Idx = i;
                  return;
              }
          }
      };
      //选择排序方式
      var countNum = 0;   //学分
      $scope.courseSort = function ($event) {
          var child = document.querySelectorAll('.freexf-coursesort>div');
          var sortText = $event.target.innerHTML;
          count = 0;
          for (var i = 0; i < child.length; i++) {
              child[i].className = "";
          }
          $event.target.className = "active";
          if (sortText == "综合") {
              orderBy = 'zonghe';
              order = "desc";
          } else if (sortText == "最近") {
              orderBy = 'zuijin';
              order = "desc";
          } else if (sortText == "学分" && countNum == 0) {
              orderBy = 'xuefen';
              order = "desc";
              countNum = 1;
          } else if (sortText == "学分" && countNum == 1) {
              orderBy = 'xuefen';
              order = 'asc';
              countNum = 0;
              $event.target.className = $event.target.className + " activeasc";
          }
          CourseList.getModel({
              "category": $scope.Category1,
              "lingual": $scope.Category2,
              "label": "",
              "orderBy": orderBy,
              "order": order,
              "pageIndex": count,
              "pageMax": pageMax
          }).then(function (res) {
              if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
                  //没有结果
                  $scope.courseList = [];
              } else {
                  $ionicScrollDelegate.scrollTop();
                  //分页初始化
                  $scope.courseList = res.response.data;
                  $scope.uppageshow = true;
              }
              ;

          });
      };
      //选择课程分类
      $scope.category = function ($event) {
          $scope.gradeclass = false;
          $scope.languageClass = false;
          var thisText = null;
          count = 0;
          var childLi = document.querySelectorAll('.freexf-languageclass li');
          if ($event.target.innerHTML.indexOf("暑期衔接班") > -1) {
              thisText = "全部";
              $state.go('summer');
          } else {
              thisText = $event.target.innerHTML;
              for (var i = 0; i < childLi.length; i++) {
                  childLi[i].className = "";
              }
              $event.target.className = "active";
          }
          $scope.lingual = thisText;
          (thisText == "全部") ? thisText = "" : thisText;
          $scope.Category2 = thisText;
          CourseList.getModel({
              "category": $scope.Category1,
              "lingual": $scope.Category2,
              "label": "",
              "orderBy": orderBy,
              "order": order,
              "pageIndex": count,
              "pageMax": pageMax
          }).then(function (res) {
              if (res == null || res.response == null || res.response.data == null || res.response.data.length < 1) {
                  //没有结果
                  $scope.courseList = [];
              } else {
                  $ionicScrollDelegate.scrollTop();
                  //分页初始化
                  count = 0;
                  $scope.courseList = res.response.data;
                  $scope.uppageshow = true;
              }
              ;
          });
      };
    //上拉刷新
    //分页
    $scope.doRefresh = function () {
      //注意改为自己本站的地址，不然会有跨域问题
      count += 1;
      CourseList.getModel({
        "category": $scope.Category1,
        "lingual": $scope.Category2,
        "label": "",
        "orderBy": orderBy,
        "order": order,
        "pageIndex": count,
        "pageMax": pageMax
      }).then(function (res) {
        $scope.courseList = $scope.courseList.concat(res.response.data);
        if ($scope.courseList.length < count * pageMax && count > 0) {
          $scope.uppageshow = false;
          $scope.bottomtext = '没有更多!'
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };
    //传递：courseId 课程ID
    var modal_ary = {
      coursedetail: {
        scope: $scope,
        ctrlUrl: 'modules/course/coursedetail',
        tempUrl: 'modules/course/coursedetail.html'
      }
    };
    $scope.openModal = function (name, data, back) {
      $frModal.openModal($scope, name, modal_ary, data, back);
    };
  });
