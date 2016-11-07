'use strict';


angular.module('freexf', ['ionic'])
  .controller('courseplate_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout, $state, $stateParams, $http, $ionicScrollDelegate, ENV, CourseListRepository, NewGetCategoryRepository, DispatchRepository) {

    var repository = DispatchRepository(ENV._api.__Dispatch, '/Entrace');

    var count = 0, pageMax = 6, order = "desc", orderBy = "zonghe";
    var classMap = {
      '': '',
      '全部': '',
      '学期同步': 'xueqitongbu',
      '知识精讲': 'zhishijingjiang',
      '课外拓展': 'kewaituozhan',
      contrast: function (str) {
        var s = str in classMap ? classMap[str] : str;
        try {
          return s.trim();
        } catch (e) {
          return s;
        }
      }
    };
    $scope.courseList = [];//课程列表
    $scope.CategoryList = [];//分类列表
    $scope.CategoryTitle = '';//分类title
    $scope.Category = $stateParams;
    $scope.uppageshow = false;
    $scope.Typer = {
      setTyper: function (index, value) {
        $scope['category_' + index] = value;
        $scope.Typer.setTitle(index, value);
        count = 0;
        getList.call(null, 'GetCategoryList', $scope.CategoryType.GetCategoryList.afterCallBack)
      },
      //设置class 活动向
      setActive: function (index, value) {
        return $scope['category_' + index] == value;
      },
      categoryMap: {0: 'Category2', 1: 'Category3', 2: 'Category4'},
      setCategory: function (index, value) {
        $scope.Category[$scope.Typer.categoryMap[index]] = value;
      },
      //设置title
      setTitle: function (index, value) {
        var _QUANBU = '全部';
        var ary = [];
        var map = $scope.Typer.categoryMap;
        for (var k in map) {
          if (k <= $scope.CategoryList.length) {
            ary[k] = $scope.Category[map[k]];
          }
        }
        if (index >= 0) {
          $scope.Typer.setCategory(index, value);
          ary[index] = value;
        }
        for (var i = 0; i < ary.length; i++) {
          if (ary[i] == '' || ary[i] == undefined) {
            ary[i] = _QUANBU;
          }
          $scope['category_' + i] = ary[i];
        }
        if (ary.length <= 0) {
          ary[0] = _QUANBU;
        }
        var newary = [].concat(ary);
        for (var j = 0; j < newary.length; j++) {
          if (newary[j] == _QUANBU) {
            newary.splice(j, 1);
          }
        }
        $scope.CategoryTitle = newary.join('•');
      }
    };
    //获取分类列表
    function getList(type, afterCallBack) {
      var param = {
        "FunctionName": '',
        "Version": 1,
        "EndClientType": 'H5',
        "JsonPara": {}
      };
      switch (type) {
        case 'GetCategoryClass':
          param['FunctionName'] = 'Category.GetCategory';
          param['JsonPara'] = {};
          break;
        case 'GetCategoryList':
          param['FunctionName'] = 'Student.GetCourseListNew2';
          param['JsonPara'] = {
            "Category": classMap.contrast($scope.Category.Category1),
            "Second": classMap.contrast($scope.Category.Category2),
            "Thirdly": classMap.contrast($scope.Category.Category3),
            "CoursesTypes": classMap.contrast($scope.Category.Category4),
            "OrderBy": orderBy,
            "Order": order,
            "PageIndex": count,
            "PageMax": pageMax
          };
          break;
      }
      repository.getModel(param).then(function (res) {
        afterCallBack.call(null, res);
      });
    }

    //添加类别列表
    function pushClass(data) {
      var ary = [];
      switch ($scope.Category.Category1) {
        case '中小学':
          ary.push(data.ls_Second1, data.ls_SecondK12, data.ls_SecondK11);
          break;
        case '多语种':
          ary.push(data.ls_Second2, data.ls_SecondK13);
          break;
        case '英语':
          ary.push(data.ls_Second0);
          break;
        case '会计职业':
          ary.push(data.ls_Second3);
          break;
        case '考研':
          ary.push(data.ls_Second4);
          break;
        case '兴趣':
          ary.push(data.ls_Second5);
          break;
      }
      $scope.CategoryList = ary;
    }

    $scope.CategoryType = {
      GetCategoryClass: {
        afterCallBack: function (res) {
          pushClass.call(null, res.response.data);
          $scope.Typer.setTitle();
        }
      },
      GetCategoryList: {
        afterCallBack: function (res) {
          count = 0;
          try {
            $scope.courseList = res.response.data;
          } catch (e) {
            $scope.courseList = [];
          }
          $scope.uppageshow = true;
          $scope.categoryActive = false;
          $ionicScrollDelegate.scrollTop();
        }
      }
    };
    for (var i in $scope.CategoryType) {
      getList.call(null, i, $scope.CategoryType[i].afterCallBack)
    }


    //选择排序方式
    var countNum = 0;   //学分
    $scope.courseSort = function ($event) {
      var child = document.querySelectorAll('.freexf-coursesort>div div');
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
      getList.call(null, 'GetCategoryList', $scope.CategoryType.GetCategoryList.afterCallBack);
    };
    //上拉刷新

    $scope.$watch('courseList', function (newval) {
      if (newval.length <= 0) {
        $scope.bottomtext = '没有更多!'
      }
    });
    //分页
    $scope.doRefresh = function () {
      //注意改为自己本站的地址，不然会有跨域问题
      count += 1;
      getList.call(null, 'GetCategoryList', function (res) {
        $scope.courseList = $scope.courseList.concat(res.response.data);
        if ($scope.courseList.length < count * pageMax && count > 0) {
          $scope.uppageshow = false;
          $scope.bottomtext = '没有更多!'
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };
    //传递：courseId 课程ID
    $scope.toCourseDate = function (courseId) {
      $state.go('coursedetail', {courseId: courseId});
    };

  })
  .filter('cutSummer', function () {
    return function (item) {
      return item.indexOf(" freexfpree=") > -1 ? item.split(" freexfpree=")[0] : item;
    }
  });
