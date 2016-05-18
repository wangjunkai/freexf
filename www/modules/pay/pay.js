'use strict';


angular.module('freexf')
  .controller('pay_ctrl', function ($scope, $rootScope,$state, $ionicPopup, $injector, $ionicLoading, $timeout) {
    $scope.toPay = function(){
      $state.go('paysuccess');
    };
//	// Triggered on a button click, or some other target
// $scope.showPopup = function() {
// $scope.data = {}
//
// // 自定义弹窗
// var myPopup = $ionicPopup.show({
//   template: '<div class="agreement"></div>',
//   title: '购买协议',
//   cssClass:'new',
////   subTitle: '提示内容',
//   scope: $scope,
//   buttons: [
//     { text: '拒绝' },
//     {
//       text: '<b>确定</b>',
//       type: 'button-positive',
//       onTap: function(e) {
//         if (!$scope.data.wifi) {
//           // 不允许用户关闭，除非输入 wifi 密码
//           e.preventDefault();
//         } else {
//           return $scope.data.wifi;
//         }
//       }
//     },
//   ]
// });
// myPopup.then(function(res) {
//   console.log('Tapped!', res);
// });
// $timeout(function() {
//    myPopup.close(); // 3秒后关闭弹窗
// }, 30000);
//};
// //  confirm 对话框

});
