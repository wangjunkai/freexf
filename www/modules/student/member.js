//define(["qrcode"], function(qrcode) {
angular.module('freexf',['ionic'])
  .controller('member_ctrl', function ($scope, $rootScope, $injector,$ionicPopup, $ionicLoading,$ionicModal, $timeout) {
				$scope.readonly = true;
				$scope.ImgBoxShow =false;
				//修改名称
		    $scope.ChangeName= function() {
			    $scope.readonly = false;
			   };
			//失去焦点事件
				$scope.blur=function(){
					$scope.readonly = true;					
				};
				//修改头像
			  $scope.ChangeUserImg=function(){
			  	$scope.ImgBoxShow=!$scope.ImgBoxShow;
			  }
				//邀请
				 $ionicModal.fromTemplateUrl('showLink', {
			    scope: $scope
			  }).then(function(modal) {
			    $scope.modal = modal;
			    
			  });
			  
				//邀请弹框
//				 $scope.showPopup = function() {
//				   $scope.data = {}
//				   // 自定义弹窗
//				   var myPopup = $ionicPopup.show({
//				     template: '<div class="showBox" id="ShareLinkAddress" ng-model="shareSelLink" >'
//				    +'http://www.freexf.com/home/register?p=15312085169&d=04832de76f834045b51264a0e32a38bc'
//				    +'</div>'
//				    +'<p class="words">'
//				    +'复制框内链接，粘贴给好友，或截取下列二维码'
//				    +'</p>'
//				    +'<div id="code" align="center">'
//				    +'<canvas width="20%" height="20%">'
//				    +'</canvas>'
//				    +'</div>',
//				     cssClass :'ShareLink',
//				     scope: $scope,
//				   });
//				   myPopup.then(function(res) {
//				     console.log('Tapped!', res);
//				   });
//				   $timeout(function() {
//				      myPopup.close(); // 5秒后关闭弹窗
//				   }, 50000);
//				  
//				   	
//				  };
   			//二维码
   		
  		
  })
