
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
			  //女生头像
			  $scope.women=function(){
			  	 $scope.userImage = {
			  	 	 "background-position" : "-52px -191px",
			  	 }
			  }
			  //男生头像
			  $scope.man=function(){
			  	 $scope.userImage = {
			  	 	 "background-position" : "-217px -102px",
			  	 }
			  }
			  //小鹿头像
			  $scope.nobody=function(){
			  	 $scope.userImage = {
			  	 	 "background-position" : "-52px -104px;",
			  	 }
			  }
				//邀请
				 $ionicModal.fromTemplateUrl('showLink', {
			    scope: $scope
			  }).then(function(modal) {
			    $scope.modal = modal;

			  });
        $scope.openModal = function() {
          $scope.modal.show()
          window.yqmurl='www.ssss'
          yaoqingimg(window.yqmurl);
        }
        

  })
  var yaoqingimg=function(yqmurl){
    if(	!$("#code").hasClass('on')){
      $("#code").addClass("on");
      $("#code").qrcode({
        width: 125, //宽度
        height: 125, //高度
        text:yqmurl,
      });
    }

  }
