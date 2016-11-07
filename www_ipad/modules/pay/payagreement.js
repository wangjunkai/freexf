'use strict';

define(function () {
  angular.module('freexf')
    .controller('payagreement_ctrl', function ($scope, $rootScope, $frModal, $timeout, $freexfUser, ENV) {
      var paycourseId = $scope.$parent.$data.paycourseId;
      $scope.argument = function (b) {
        $scope.$modal.remove();
        if (b) {
          getDiscounts({
            paycourseId: paycourseId,
            studentId: $scope.$parent.userData.rowId
          }, function (data) {

            if (!data || data.length <= 0) {
              $scope.$parent.openModal('pay', {paycourseId: paycourseId, DiscountCode: ''});
            } else {
              /*              if ($.inArray(paycourseId, $scope.zhekouId) < 0) {
               $scope.$parent.openModal('lottery', {paycourseId: paycourseId});
               } else {*/
              getRandomDiscount({
                paycourseId: paycourseId,
                studentId: $scope.$parent.userData.rowId
              });
              /*              }*/
            }
          })
        }
      };
      $scope._argument = function (b) {
        $scope.$modal.remove();
        b && $scope.$parent.openModal('lottery', {paycourseId: paycourseId});
      };
      function getDiscounts(obj, func) {
        var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetStudentDiscounts&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + obj.studentId + '","CourseId":"' + obj.paycourseId + '"}';
        $.ajax({
          type: 'GET',
          cache: 'false',
          url: teacherList,
          dataType: "json",
          success: function (data) {
            func.call(this, data);
          }
        });
      }

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
        var teacherList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetRandomDiscount&Version=1&EndClientType=H5&Key=""&JsonPara={"StudentId":"' + obj.studentId + '","CourseId":"' + obj.paycourseId + '"}';
        $.ajax({
          type: 'GET',
          cache: 'false',
          url: teacherList,
          dataType: "json",
          success: function (data) {
            if (data) {
              $scope.$parent.openModal('pay', {
                paycourseId: paycourseId,
                DiscountCode: data.DiscountCode
              });
            }
          }
        });
      }
    });
});

