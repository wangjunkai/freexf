'use strict';


angular.module('freexf')
  .controller('coursedetail_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $ionicPopup, $timeout, $state, $stateParams, ENV, CourseDateRepository) {
    //$scope.home = Home.home.query({id:'1'});
    //$scope.username = (new Home.user()).getName();
//  require(['modules/index/index_ctrl'], function (shouye_ctrl) {
//    $injector.invoke(shouye_ctrl, this, {'$scope': $scope});
      //  });

      $scope.courseId = $stateParams.courseId;
      //课程信息
      var CourseDate = CourseDateRepository(ENV._api.__coursedate);

      $scope.$on('$ionicView.loaded', function () {
      });

      CourseDate.getModel({ "courseId": $scope.courseId }).then(function (res) {
          //console.log(res)
          $scope.courseDate = res.response.data;

          //console.log(res);
      });
      //课程信息end

		$scope.coursedetail=true;	//课程介绍
		$scope.courseoutline=false;	//大纲
		$scope.flowerstate=false;		//小花状态
		//课程介绍
		$scope.coursedetailClick=function(){
			$scope.coursedetail=true;
			$scope.courseoutline=false;
		}
		//课程大纲
		$scope.courseoutlineClick=function(){
			$scope.coursedetail=false;
			$scope.courseoutline=true;
		}
		//改变小花状态
		$scope.flowerState=function(){
			$scope.flowerstate=!$scope.flowerstate;
		}
		$scope.showAgreement=function(){
			var confirmPopup = $ionicPopup.confirm({
	       title: '购买协议',
	       cssClass :'freexf-agreement',
	       template:'<div class="freexf-agreement">'
	       			+'<h5>学费全免网网络节目购买合同</h5>'
	       			+'<p>甲方：学员<br/>已方：学费全免网（上海琦珺互联网信息科技有限公司）<br/>鉴于<br/>甲方：学员<br/>已方：学费全免网（上海琦珺互联网信息科技有限公司）<br/>鉴于<br/>'
	       			+'甲方签约成为乙方在线培训平台的学员用户，乙方将在本须知中告知甲方在学费全免网进行学习是需要注意的事项。甲方确认在仔细阅读本须知并完全了解本须知内容后，按本须知所列内容进行在线学习：' 
							+'1.  课程学习'
							+'1.1乙方在学费全免网所发布的课程，甲方学习该课程需要支付“报名费”，“报名费”以“学分”标注价格，1“学分”=1元人民币。'
							+'1.2乙方在学费全免网所发布的所有课程均有课程有效期。在课程有效期内，甲方可以观看该课程下包含的所有学习视频、做练习题。观看视频、做练习题的次数无限制，但只对第一次做题的成绩做记录。'
							+'1.3甲方应当按照所选课程的教学顺序进行学习，未完整观看前一章节视频则无法获得后一章节学习视频和练习题的权限。'
							+'1.4课程有效期到期后，甲方观看该课程学习视频的权限终止，但做练习题的次数、时间无限制。'
							+'1．5甲方观看所购课程视频完成率达到100%后，乙方视甲方完成该课程的学习。乙方将向甲方奖励等同于甲方所购课程的“奖学金”。'							 
							+'2.  奖学金'
							+'2.1甲方每观看完一个课程视频，乙方将会为甲方记录下完成该课程视频所应获得的“奖学金”。每一课程视频对应的“已获得奖学金”=（该课程报名费/该课程视频总数）。'
							+'2.2 甲方还可以通过完成“奖学金任务”获得额外的“已获得奖学金”。'
							+'2.3 课程有效期结束后，乙方将甲方“已获得奖学金”换算为人民币发放至甲方指定的银行账户。</p>'
	       			+'</div>',
	       buttons:[
	       	{
	       		text:"拒绝",
	       		onTap:function(e){
	       		}
	       	},
	       	{
	       		text:"同意",
	       		type:'button-balanced',
	       		onTap:function(e){
	       			location.href="#/pay";
	       		}
	       	}
	       ]
	     });
	     
		}
      //$scope.courseDate.courseOutlineItem
		$scope.expanders = [{
		    title: '试听课程',
		    classLists: [{
		        title: '1.1 课程名称课程名称课程名称课程名称课程名称'
		    }],
		    istest: 'freexf-democlass'
		}, {
		    title: '第一章        基础课程',
		    classLists: [{
		        title: '1.1 课程名称课程名称课程名称课程名称课程名称'
		    }, {
		        title: '1.2 课程名称'
		    }, {
		        title: '1.4 课程名称课程名称课程名称课程名称课程名称课程名称'
		    }, {
		        title: '1.5 课程名称1.6 课程名称'
		    }],
		    istest: 'freexf-courseitem'
		}, {
		    title: '第二章         初级课程',
		    classLists: [{
		        title: '1.1 课程名称课程名称课程名称课程名称课程名称'
		    }, {
		        title: '1.2 课程名称1.3 课程名称'
		    }, {
		        title: '1.4 课程名称课程名称课程名称课程名称课程名称课程名称'
		    }, {
		        title: '1.5 课程名称1.6 课程名称'
		    }],
		    istest: 'freexf-courseitem'
		}]
		
 })
  .directive('accordion',function(){
			return{
				restrict:'AE',
				replace:true,
				transclude:true,
				template:'<div ng-transclude></div>',
				//通过controller暴露指令给外部使用
				controller:function(){
					var expanders=[];
					this.gotOpened=function(selectedExpander){
						angular.forEach(expanders,function(expander){
							if(selectedExpander!=expander){
								expander.showMe=false;
							}
						});
					}
					this.addExpander=function(expander){
						expanders.push(expander);
					}
				}
			}
		})
  .directive('expander',function(){
			return{
				restrict:'EA',
				replace:true,
				transclude:true,
				//require依赖外部的accordion
				require:'^?accordion',
				scope:{
					title:'=expanderTitle',
					istest:'=expanderIstest'
				},
				template:'<li class="item">'		//--class="freexf-test"未购买课程
						+'<div class="freexf-course-title">'
						+'<p>{{title}}</p>'		//ng-click="toggle()"	
						+'</div>'
						+'<div>'
						+'<ul class="list {{istest}}" ng-show="showMe" ng-transclude>'	/*freexf-democlass 试听课程*/
						+'</ul>'
						+'</div>',
				//在这里就可以使用accordionController 内暴露出来的方法，就可以实现与外部的指令进行交互
				link:function(scope,element,attrs,accordionController){
					scope.showMe=true;	//显示false 隐藏
					accordionController.addExpander(scope);
					scope.toggle=function toggle(){
						scope.showMe=!scope.showMe;
						accordionController.gotOpened(scope);
					}
				}
			}
		})
  .directive('course',function(){
			return{
				restrict:'EA',
				replace:true,
				transclude:true,
				//require依赖外部的accordion
				require:'^?accordion',
				scope:{
					title:'=classTitle'
				},
				template:'<li class="item item-button-right endclass">'		// class： endclass 已学完课程  intheclass 没学完课程  默认未学习
								+'<p>{{title}}</p>'
								+'<button class="button freexf-play ">'
								+'<i class="icon freexf-play-outline"></i>'
								+'</button>'
								+'</li>'
			}
		})
  .controller('SomeController',function($scope){
			$scope.expanders=[{
				title:'试听课程',
				classLists:[{
						title:'1.1 课程名称课程名称课程名称课程名称课程名称'
				}],
				istest:'freexf-democlass'
			},{
				title:'第一章        基础课程',
				classLists:[{
						title:'1.1 课程名称课程名称课程名称课程名称课程名称'						
				},{
						title:'1.2 课程名称'
				},{
						title:'1.4 课程名称课程名称课程名称课程名称课程名称课程名称'
				},{					
						title:'1.5 课程名称1.6 课程名称'
				}],
				istest:'freexf-courseitem'
			},{
				title:'第二章         初级课程',
				classLists:[{
						title:'1.1 课程名称课程名称课程名称课程名称课程名称'
				},{
						title:'1.2 课程名称1.3 课程名称'
				},{
						title:'1.4 课程名称课程名称课程名称课程名称课程名称课程名称'
				},{					
						title:'1.5 课程名称1.6 课程名称'
				}],
				istest:'freexf-courseitem'
			}]
		})

