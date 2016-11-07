'use strict';


angular.module('freexf', ['ionic'])
  .controller('ExaminationPaper_ctrl', function ($scope, $rootScope, $injector,$sce, $ionicLoading,$ionicPopup, $timeout, $state, $stateParams, $http, ENV,  DispatchRepository) {
      $('head').append('<script src="./lib/echarts/echarts-all.js" async=""></script>');

      $scope.successTip = false;    //提交成功弹框
      $scope.currentQuestionNum = 1;    //当前题号
      $scope.listNum = 0;   //总题数
      $scope.finishNum = 0; //完成题目数量
      var finishSubject = [];
      $scope.first = true;
      $scope.last = false;
      $scope.submit = true;

      var getUrlData = '/Entrace/Dispatch.aspx?FunctionName=Paper&Version=1&EndClientType=H5&Key=""&JsonPara={"PaperCode":"20160907947"}';
      $.ajax({
          url: getUrlData,
          data: {},
          type: "GET",
          dataType: "json",
          success: function (data) {
              $scope.$apply(function () {
                  $scope.GroupName = data.PaperName;
                  $scope.GroupList = data.GroupList;
                  $scope.QuestionList = data.GroupList[0].QuestionList;                  
                  if (finishSubject.length==0){
                      for (var i = 0; i < $scope.GroupList.length; i++) {                      
                          for (var j = 0; j < $scope.GroupList[i].QuestionList.length; j++) {                          
                              var Answer = {
                                  "GroupId": $scope.GroupList[i].QuestionList[j].GroupId,
                                  "QuestionId": $scope.GroupList[i].QuestionList[j].QuestionId,
                                  "Type": $scope.GroupList[i].QuestionList[j].Type,
                                  "Answer": ""
                              };
                              finishSubject.push(Answer);                          
                          }
                      }
                  }
                  $scope.listNum = finishSubject.length;
                  for (var i = 0; i < $scope.listNum; i++) {
                      $('.paper-Number').append('<li class="col col-25">' + (i + 1) + '</li>');
                  };
                  console.log(finishSubject);
              });
          }
      });
      //选项
      $scope.selectIt = function ($event, groupId, questionId, type) {
          $($event.target).addClass('active').siblings().removeClass('active');
          var num = $scope.currentQuestionNum
          $('.paper-Number li').eq(num - 1).addClass('active');
          var text = $($event.target).html();                
          finishSubject[$scope.currentQuestionNum - 1].Answer = text;
          console.log(finishSubject);
      }
      //题目序号
      $('.paper-Number').on('click', 'li', function () {
          var text = parseInt($(this).text());
          $scope.$apply(function () {
              $scope.currentQuestionNum = text;
              $scope.idx = getResult();
              if ($scope.currentQuestionNum == 1) {
                  $scope.first = true;
                  $scope.last = false;
                  $scope.submit = true;
              } else if ($scope.currentQuestionNum == $scope.listNum) {
                  $scope.first = false;
                  $scope.last = true;
                  $scope.submit = false;
              } else {
                  $scope.first = false;
                  $scope.last = false;
                  $scope.submit = true;
              }
          })
      });      
      //上一题
      $scope.lastQuestion = function () {          
          $scope.last = false;
          $scope.submit = true;
          if ($scope.currentQuestionNum == 1) {
              
          } else {
              $scope.currentQuestionNum--;
              if ($scope.currentQuestionNum == 1) {
                  $scope.first = true;
              }
              $scope.idx = getResult();
          }         
      }
      //下一题
      $scope.nextQuestion = function () {
          $scope.first = false;
          if ($scope.currentQuestionNum == $scope.listNum) {

          } else {
              $scope.currentQuestionNum++;              
              if ($scope.currentQuestionNum == $scope.listNum) {
                  $scope.last = true;
                  $scope.submit = false;
              }
              $scope.idx = getResult();
          }         
      }
      //交卷
      $scope.submitPaper = function () {
          var arr=[]
          for (var i = 0; i < $scope.listNum; i++) {
              if (finishSubject[i].Answer == "") {
                  arr.push(i + 1);
              }
          }
          var percentage = arr.length / $scope.listNum;
          if (arr.length > 0) { //未完成题目
              submitUnfinishedTip(arr,100-parseInt(percentage*100));
          } else {
              submitCompleteAllTip();
          }          
      }
      //提交成功提示完成度以及答对率
      function subSuccessTip(finish, correct) {
          initEcharts('round-chart', finish, correct);
          $scope.successTip = true;         
      }
      //交卷提示全部完成     
      function submitCompleteAllTip() {
          var confirmPopup = $ionicPopup.confirm({
              title: '交卷提示',
              cssClass: 'practiceExam',
              template: '<div>你全部完成，确定交卷吗？</div>',
              buttons: [
                {
                    text: "确定交卷",
                    onTap: function (e) {
                        //提交试卷
                        subSuccessTip(100, 70)  //交卷成功
                        //resubmitFailed();//交卷失败
                    }
                },{
                    text: "取消",
                    onTap: function (e) {
                    }
                }
              ]
          });
      };
      //未答题提示
      function submitUnfinishedTip(arr,per) {
          var confirmPopup = $ionicPopup.confirm({
              title: '交卷提示',
              cssClass: 'practiceExam',
              template: '<div class="tip-warning">'
                        + '<span>你还有第' + arr + '题没有做，确定交卷吗？</span>'
                        + '</div>',
              buttons: [
                {
                    text: "确定交卷",
                    onTap: function (e) {
                        //提交试卷
                        subSuccessTip(per, 70)  //交卷成功
                        //resubmitFailed();//交卷失败
                    }
                }, {
                    text: "继续做题",
                    type: 'go-answer',
                    onTap: function (e) {
                    }
                }
              ]
          });
      };
      //提交失败
      function  resubmitFailed() {
          var confirmPopup = $ionicPopup.confirm({
              title: '提交失败',
              cssClass: 'practiceExam',
              template: '<div class="tip-warning">'
                        + '<span>提交失败，请重新提交？</span>'
                        + '</div>',
              buttons: [
                {
                    text: "重新提交",
                    onTap: function (e) {
                        //提交试卷
                    }
                }, {
                    text: "取消",
                    onTap: function (e) {
                    }
                }
              ]
          });
      };      
      function getResult() {
          var idx;          
          if (finishSubject[$scope.currentQuestionNum - 1] != undefined) {
              var result = finishSubject[$scope.currentQuestionNum - 1].Answer;
              switch (result) {
                  case "A":
                      idx = 0;
                      break;
                  case "B":
                      idx = 1;
                      break;
                  case "C":
                      idx = 2;
                      break;
                  case "D":
                      idx = 3;
                      break;
                  case "E":
                      idx = 4;
                      break;
              }
              return idx;
          }
      }
      //绘制圆环（容器id，完成度%，答对率%）
      function initEcharts(id, finish, correct) {
          var labelTop = {
              normal: {
                  color: '#1ab554',
                  label: {
                      show: true,
                      position: 'center',
                      formatter: '{b}',
                      textStyle: {
                          baseline: 'bottom'
                      }
                  },
                  labelLine: {
                      show: false
                  }
              }
          };
          var labelTop2 = {
              normal: {
                  color: '#ea4c00',
                  label: {
                      show: true,
                      position: 'center',
                      formatter: '{b}',
                      textStyle: {
                          baseline: 'bottom'
                      }
                  },
                  labelLine: {
                      show: false
                  }
              }
          };
          var labelBottom = {
              normal: {
                  color: '#ccc',
                  label: {
                      show: true,
                      position: 'center'
                  },
                  labelLine: {
                      show: false
                  }
              }
          };
          var labelFromatter = {
              normal: {
                  color: '#000',
                  label: {
                      formatter: function (params) {
                          return 100 - params.value + '%'
                      },
                      textStyle: {
                          color: '#000',
                          baseline: 'top'
                      }
                  }
              },
          }
          var radius = [30, 35];
          var option = {
              legend: {
                  x: 'center',
                  y: 'center',
                  data: []
              },
              series: [
                  {
                      type: 'pie',
                      center: ['35', '40'],
                      radius: radius,
                      x: '0%', // for funnel
                      itemStyle: labelFromatter,
                      data: [
                          { name: '完成度', value: finish, itemStyle: labelTop2 },
                          { name: '其他', value: 100 - finish, itemStyle: labelBottom }
                      ]

                  },
                  {
                      type: 'pie',
                      center: ['115', '40'],
                      radius: radius,
                      x: '20%', // for funnel
                      itemStyle: labelFromatter,
                      data: [
                          { name: '答对率', value: correct, itemStyle: labelTop },
                          { name: '其他', value: 100 - correct, itemStyle: labelBottom }
                      ]
                  }
              ]
          };
          var myChart = echarts.init(document.getElementById(id));
          myChart.setOption(option);
      }
      function getCookie(objName) {//获取指定名称的cookie的值 
          var arrStr = document.cookie.split("; ");
          for (var i = 0; i < arrStr.length; i++) {
              var temp = arrStr[i].split("=");
              if (temp[0] == objName)
                  return unescape(temp[1]);
          }
      }
      function setCookie(objName, objValue) {
          var str = objName + "=" + escape(objValue);
          document.cookie = str;
          document.cookie = {
              "PaperId": "20160907993",
              "PaperName": "一课一练 欧标A1",
              "uuPaperId": "+V5\/,X?YXY2BE{.PIMVC#E",
              "QuestionAnswerList": [
                  {
                      "GroupId": "",         
                      "QuestionId": "4479",
                      "Type": 1,
                      "Answer": "A"
                  },
                  {
                      "GroupId": "",         
                      "QuestionId": "4480",
                      "Type": 1,
                      "Answer": "D"
              },
                {
                    "GroupId": "",         
                    "QuestionId": "4481",
                    "Type": 1,
                    "Answer": "D"
                }
              ]
        }   

      }
  })
.filter('optionsFilter', function () {
    return function (item) {
        switch(item){
            case 0:
                return "A";
                break;
            case 1:
                return "B"
                break;
            case 2:
                return "C"
                break;
            case 3:
                return "D"
                break;
            case 4:
                return "E"
                break;
        }
    }
})
