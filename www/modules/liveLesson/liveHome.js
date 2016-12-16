angular.module('freexf')
  .controller('liveHome_ctrl', function ($rootScope, $scope, $q, $timeout, $window, $ionicPopup, $state, $location, AUTH) {
    $scope.auth = AUTH.FREEXFUSER.data;
    $scope.getTime = function () {
      return new Date().getTime();
    };
    var courseList = 'LiveRadio.GetLiveRadioCourseList',
      backCourseList = 'LiveRadio.GetLiveRadioBackCourseList',
      updateIsApply = 'LiveRadio.UpdateIsApply';

    function getdata(funname, data) {
      var defer = $q.defer();
      var url = '/Entrace/Dispatch.aspx?FunctionName=' + funname + '&Version=1&EndClientType=H5&Key=""&JsonPara=' + JSON.stringify(data);
      try {
        $.ajax({
          type: 'POST',
          cache: 'false',
          url: url,
          dataType: "json",
          success: function (data) {
            defer.resolve(data);
          }
        });
      }
      catch (e) {
        defer.reject(null);
      }
      return defer.promise;
    }

    function coursefn() {
      var _len = 6;
      getdata(courseList, {StudentId: $scope.auth.rowId}).then(function (data) {
        var ary1 = data[0], ary2 = data[1];
        ary1.length = ary1.length > _len ? _len : ary1.length;
        ary2.length = _len - ary1.length;
        $scope.courseList = ary1.concat(ary2);
      });
    }

    coursefn.call(null);
    $scope.active = {};
    $scope.getBackCourseList = function (Category, Second) {
      $scope.active[Category + '-active'] = Second;
      getdata(backCourseList, {StudentId: $scope.auth.rowId, Category: Category, Second: Second=='全部'?'':Second}).then(function (data) {
        $scope.active[Category] = data;
      });
    };

    $scope.goDetail = function (id) {
      $state.go('livecoursedetail', {LiveRadioId: id});
    };
    $scope.StudentIsApply = [];
    $scope.updateApply = function (id, apply) {
      if (!$scope.auth.userLg) {
        $state.go('login');
      } else {
        getdata(updateIsApply, {
          StudentId: $scope.auth.rowId,
          LiveRadioId: id,
          IsApply: (apply).toString()
        }).then(function (data) {
          coursefn.call(null);
        })
      }
    };
    $scope.livePlay = function (data) {
      if (data.LiveRadioBackURL) {
        $state.go('livecoursedetail', {LiveRadioId: data.LiveRadioId});
      } else {
        var path = data.LiveRadioClient,
          id = path.substring(path.lastIndexOf('/') + 1, path.indexOf('?') < 0 ? path.length : path.indexOf('?')).split('-')[1];
        $timeout(function () {
          $window.location.href = 'http://www.freexf.com/zhibo/zbindex.aspx#live=' + id;
        }, 0)
      }
    };
    $scope.aboutUs = function () {
      var aboutPopup = $ionicPopup.confirm({
        title: '',
        cssClass: 'videoBox',
        template: '<video id="aboutVideo" style="width:100%;position:relative;z-index:10;" controls="controls" autoplay="autoplay" ><source id="vpmp4" src="http://css.freexf.com/banner%2F%E5%AD%A6%E8%B4%B9%E5%85%A8%E5%85%8D%E7%BD%91%E7%9F%AD%E4%BB%8B%E7%BB%8D.mp4" type="video/mp4"></video>',
        scope: $scope,
        buttons: [
          {
            text: "",
            onTap: function (e) {

            }
          }]
      });
    }
  })
  .filter('join', function () {
    return function (data) {
      if (data) {
        var ary = [];
        data.forEach(function (x) {
          x && ary.push(x)
        });
        return ary.join(',');
      }
    }
  });

