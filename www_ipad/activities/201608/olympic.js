'use strict';

angular.module('freexf')
    .filter('xingxingban', function () {
        return function ($index) {
            var tIclass = ''
            if ($index > 2) {
                tIclass = tIclass + 'ban '
            }
            return tIclass;
        }
    })
        .filter('xingxinghide', function () {
            return function ($index) {
                var tIclass = ''
                if ($index > 4) {
                    tIclass = tIclass + 'hide '
                }
                return tIclass;
            }
        })

        .filter('olympicCoursehide', function () {
            return function ($index) {
                var tIclass = ''
                if ($index >= 1) {
                    tIclass = tIclass + 'hide '
                }
                return tIclass;
            }
        })
  .controller('olympic_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, AUTH, ENV, DispatchRepository) {
      var DisPatchList = DispatchRepository(ENV._api.__Dispatch, '/entrace');
      //{ "FunctionName": $scope.courseList, "Version": 1, "EndClientType": 'h5', "Key": code, "JsonPara": {} }
      DisPatchList.getModel({ "FunctionName": '奥运.课程列表', "Version": 1, "EndClientType": 'H5', "JsonPara": {} }).then(function (res) {
          $scope.DisPatchList = res.response.data ;
         
      });


      $scope.olyCList = function (kecObj, obj) {
          var obj = obj + '+.linelist'
          if ($(kecObj).length <= 0) {
              $(obj).find(".font").html('没有更多课程')
              
          } else {
              $(kecObj).eq(0).removeClass('hide');
              $(kecObj).eq(0).removeClass('hide');
          }          
      }


  });