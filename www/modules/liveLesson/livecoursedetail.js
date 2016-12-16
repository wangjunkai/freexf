'use strict';


angular.module('freexf')
  .controller('livecoursedetail_ctrl', function ($rootScope,$timeout,$window, $scope,$ionicPopup, $sce, $interval, $q, $state, AUTH) {
    $scope.LiveRadioId = $state.params.LiveRadioId;
    $scope.auth = AUTH.FREEXFUSER.data;
    var courseDetail = 'LiveRadio.GetLiveRadioDetail',
    updateIsApply = 'LiveRadio.UpdateIsApply';
    function getdata(funname, data) {
      var defer = $q.defer();
      var url = '/Entrace/Dispatch.aspx?FunctionName=' + funname + '&Version=1&EndClientType=H5&Key=""&JsonPara=' + JSON.stringify(data);
      $.ajax({
        type: 'GET',
        cache: 'false',
        url: url,
        dataType: "json",
        success: function (data) {
          defer.resolve(data);
        }
      });
      return defer.promise;
    }
    getLiveDetail.call(null);
    function getLiveDetail(){
      getdata(courseDetail, {StudentId: $scope.auth.rowId, LiveRadioId: $scope.LiveRadioId}).then(function (data) {
        $scope.livedetail = data;
        $scope.liveurl = $sce.trustAsResourceUrl(data.LiveRadioBackURL);
      });
    }
    $scope.$on('$ionicView.beforeLeave', function () {
      $scope.myPopup&&$scope.myPopup.close();
    });
    //播放
    $scope.coursedVideoPlay = function (url) {
      $interval.cancel($rootScope.h5playtimeend);
      if(!url){
        var path = $scope.livedetail.LiveRadioClient,
          id = path.substring(path.lastIndexOf('/') + 1, path.indexOf('?') < 0 ? path.length : path.indexOf('?')).split('-')[1];
        $timeout(function () {
          $window.location.href = 'http://www.freexf.com/zhibo/zbindex.aspx#live=' + id;
        }, 0)
      }else{
        if (!$scope.auth.userLg) {
          $state.go('login');
        } else {
          if($scope.videShow){
            $('#videoplay')[0].play();
            return false
          }
          $scope.videShow = true;
          var box = $('#videobox');
          var html = '<video id="videoplay" style="width:100%;position:relative;z-index:10;" controls="controls" autoplay><source id="vpmp4" src="' + url + '" type="video/mp4"></video>';
          box.append($(html));
        }
      }
    };

    $scope.reviewPlay = function(){
      if($scope.livedetail.LiveRadioBackURL){
        $scope.coursedVideoPlay($scope.livedetail.LiveRadioBackURL);
      }else{
        $scope.updateApply();
      }
    };
    $scope.updateApply = function (id, apply) {
      if (!$scope.auth.userLg) {
        $state.go('login');
      } else {
        getdata(updateIsApply, {
          StudentId: $scope.auth.rowId,
          LiveRadioId: id,
          IsApply: (apply).toString()
        }).then(function (data) {
          getLiveDetail.call(null);
        })
      }
    };
    $scope.showPopup = function () {
      // 自定义弹窗
      $scope.myPopup = $ionicPopup.show({
        title: $rootScope.tel400,
        cssClass: 'freexf-contact',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '拨打',
            type: 'button-positive',
            onTap: function (e) {
                location.href = "tel:" + $rootScope.tel400;
            }
          }
        ]
      });
      $scope.myPopup.then(function (res) {
      });
    };
  })
  .filter('detailjoin', function () {
    return function (data) {
      if (data) {
        var ary = [];
        data.forEach(function (x) {
          x && ary.push(x)
        });
        return ary;
      }
    }
  });


