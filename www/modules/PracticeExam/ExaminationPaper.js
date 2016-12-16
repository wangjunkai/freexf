'use strict';


angular.module('freexf', ['ionic'])
  .controller('ExaminationPaper_ctrl', function ($scope, $rootScope, $injector,$sce, $ionicLoading,$ionicPopup, $timeout, $state, $stateParams, $http, ENV,AUTH,  DispatchRepository) {
      $('head').append('<script src="./lib/echarts/echarts-all.js" async=""></script>');
      $scope.successTip = false;    //提交成功弹框
      $scope.isGroupPaper = false;  //是否是组合题
      $scope.GroupQuestion = "";
      $scope.currentQuestionNum = 1;    //当前题号
      $scope.listNum = 0;   //总题数
      $scope.groupNum = 0; //组合题下标      
      $scope.first = true;
      $scope.last = false;
      $scope.submit = true;
      $scope.userData = AUTH.FREEXFUSER.data;
      $scope.studentId = $scope.userData.userLg ? $scope.userData.rowId : '';
      $scope.PaperCode = $stateParams.paperCode;
      $scope.courseId = $stateParams.courseId;
      $scope.redo = $stateParams.redo == "redo" ? true : false; //是否重做
      $scope.analysis = $stateParams.analysis; //解析
      var answerList = getCookieValue($scope.PaperCode) ? JSON.parse(getCookieValue($scope.PaperCode)) : [];//存放结果选项 
      if ($scope.redo) {
          deleteCookie($scope.PaperCode, "/");
          answerList = [];
      }
      var finishSubject = [];
      var groupListNum = [];
      if ($scope.analysis) {
          parperAnalysis();
      } else {
          getPaper();
      }
      function getPaper(){
          var getUrlData = '/Entrace/Dispatch.aspx?FunctionName=Exam.Paper&Version=1&EndClientType=H5&Key=""&JsonPara={"PaperCode":"' + $scope.PaperCode + '"}';//20160907993/20160907947
          $.ajax({
              url: getUrlData,
              data: {},
              type: "GET",
              dataType: "json",
              success: function (data) {
                  $scope.$apply(function () {
                      $scope.Data = data;
                      $scope.GroupName = $scope.Data.PaperName;
                      $scope.GroupList = $scope.Data.GroupList;
                      $scope.QuestionList = $scope.Data.GroupList[$scope.groupNum].QuestionList;
                      if (answerList.length == 0) {
                          for (var i = 0; i < $scope.GroupList.length; i++) {
                              for (var j = 0; j < $scope.GroupList[i].QuestionList.length; j++) {
                                  var Answer = {
                                      "GroupId": $scope.GroupList[i].QuestionList[j].GroupId,
                                      "QuestionId": $scope.GroupList[i].QuestionList[j].QuestionId,
                                      "Type": $scope.GroupList[i].QuestionList[j].Type + "",
                                      "Answer": ""
                                  };
                                  finishSubject.push(Answer);
                                  answerList.push("");
                              }
                              groupListNum.push($scope.GroupList[i].QuestionList.length);
                          }
                      } else {
                          for (var i = 0; i < $scope.GroupList.length; i++) {
                              for (var j = 0; j < $scope.GroupList[i].QuestionList.length; j++) {
                                  var Answer = {
                                      "GroupId": $scope.GroupList[i].QuestionList[j].GroupId,
                                      "QuestionId": $scope.GroupList[i].QuestionList[j].QuestionId,
                                      "Type": $scope.GroupList[i].QuestionList[j].Type + "",
                                      "Answer": ""
                                  };
                                  finishSubject.push(Answer);
                              }
                              groupListNum.push($scope.GroupList[i].QuestionList.length);
                          }
                          for (var i = 0; i < finishSubject.length; i++) {
                              finishSubject[i].Answer = answerList[i];
                          }
                          getIdx();
                      }
                      $scope.listNum = finishSubject.length;
                      for (var i = 0; i < $scope.listNum; i++) {
                          if (finishSubject[i].Answer == "") {
                              $('.paper-Number').append('<li class="col col-25">' + (i + 1) + '</li>');
                          } else {
                              $('.paper-Number').append('<li class="col col-25 active">' + (i + 1) + '</li>');
                          }
                      };
                      $scope.answerList = {
                          "PaperId": $scope.Data.PaperId,
                          "PaperName": $scope.Data.PaperName,
                          "uuPaperId": $scope.Data.uuPaperId,
                          "StudentId": $scope.studentId,
                          "CourseId": $scope.courseId,
                          "QuestionAnswerList": finishSubject
                      }                  
                      //setCookie($scope.PaperCode, JSON.stringify($scope.answerList), 7, "/");   //写入cookie
                      //getCookieValue($scope.PaperCode);
                      //deleteCookie("answerList", "/")
                  });
              }
          });
      }      
      //单选
      $scope.selectIt = function ($event, idx) {
          if (!$scope.analysis) {
              $($event.target).addClass('active').siblings().removeClass('active');
              var num = idx
              $('.paper-Number li').eq(num - 1).addClass('active');
              var text = $($event.target).html();
              if (text == "是") {
                  text = "on";
              } else if (text == "否") {
                  text = "off";
              }     
              finishSubject[idx - 1].Answer = text;
              answerList[idx - 1] = text;
              setCookie($scope.PaperCode, JSON.stringify(answerList), 7, "/");//写入cookie}
          }
      }
      //多选
      $scope.selectIts = function ($event, idx) {
          if (!$scope.analysis) {
              var text = $($event.target).html();
              var answeArr = finishSubject[idx - 1].Answer.split('');
              if ($($event.target).hasClass('active')) {
                  $($event.target).removeClass('active');
                  answeArr.remove(text);
              } else {
                  $($event.target).addClass('active');
                  answeArr.push(text)
              }
              var num = idx
              $('.paper-Number li').eq(num - 1).addClass('active');
              var temp = answeArr.sort();
              for (var i = 0; i < temp.length; i++) {
                  if (temp[i] == temp[i + 1]) {
                      temp.splice(i, 1);
                  }
              }
              finishSubject[idx - 1].Answer = temp.join('');
              answerList[idx - 1] = temp.join('');
              if (!$scope.analysis) setCookie($scope.PaperCode, JSON.stringify(answerList), 7, "/");//写入cookie
          }
      }
      Array.prototype.indexOf = function (val) {
          for (var i = 0; i < this.length; i++) {
              if (this[i] == val) return i;
          }
          return -1;
      };
      Array.prototype.remove = function (val) {
          var index = this.indexOf(val);
          if (index > -1) {
              this.splice(index, 1);
          }
      };
      //题目序号
      $('.paper-Number').on('click', 'li', function () {
          var text = parseInt($(this).text());
          $scope.$apply(function () {
              $scope.currentQuestionNum = text;
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
              getIdx();
          })
      });      
      //上一题
      $scope.lastQuestion = function () {          
          $scope.last = false;
          $scope.submit = true;
          if ($scope.currentQuestionNum != 1) {
              if ($scope.groupNum > 1) {
                  $scope.currentQuestionNum -= $scope.QuestionList.length;
              } else {
                  $scope.currentQuestionNum--;
              }
              if ($scope.currentQuestionNum == 1) {
                  $scope.first = true;
              }
              getIdx();
          }          
      }      
      //下一题
      $scope.nextQuestion = function () {
          $scope.first = false;
          if ($scope.currentQuestionNum != $scope.listNum) {
              if ($scope.groupNum != 0) {
                  $scope.currentQuestionNum += $scope.QuestionList.length;
              } else {
                  $scope.currentQuestionNum++;
                  if ($scope.currentQuestionNum == $scope.listNum) {
                      $scope.last = true;
                      $scope.submit = false;
                  }
              }
              getIdx();
          }
      }
      function getIdx() {
          var result = groupListNum[0];
          if ($scope.currentQuestionNum <= result) {
              $scope.isGroupPaper = false;
              $scope.groupNum = 0;
              $scope.idx = getResult($scope.currentQuestionNum, "");
          } else {
              for (var i = 1; i < groupListNum.length; i++) {
                  result += groupListNum[i];
                  $scope.groupNum = i;
                  if (i == groupListNum.length - 1) {
                      $scope.first = false;
                      $scope.last = true;
                      $scope.submit = false;
                  }
                  if ($scope.currentQuestionNum <= result) {
                      $scope.isGroupPaper = true;
                      result -= groupListNum[i];
                      $scope.currentQuestionNum = result + 1;
                      $scope.idx = getResult($scope.currentQuestionNum, groupListNum[i]);
                      break;
                  }
              }
          }
          $scope.GroupQuestion =$sce.trustAsHtml($scope.Data.GroupList[$scope.groupNum].GroupQuestion);
          $scope.QuestionList = $scope.Data.GroupList[$scope.groupNum].QuestionList;
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
          deleteCookie($scope.PaperCode, "/");
      }
      //重做
      $scope.reset = function () {
          $scope.successTip = false;
          finishSubject = [];
          deleteCookie($scope.PaperCode, "/");
          answerList = [];
          getPaper();
          $('.paper-Number li').removeClass('active');
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
                        var answerJson = JSON.stringify($scope.answerList);
                        var getdata='FunctionName=Exam.SaveStudentScore&Version=1&EndClientType=H5&Key=""&JsonPara=' + answerJson;
                        var getUrlData = '/Entrace/Dispatch.aspx'
                        $.ajax({
                            url: getUrlData,
                            data: getdata,
                            type: "POST",
                            dataType: "json",
                            success: function (data) {
                                $scope.$apply(function () {                                 
                                    subSuccessTip(100, data)  //交卷成功
                                });
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                $scope.$apply(function () {
                                    resubmitFailed(100);//交卷失败
                                });
                            }
                        });
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
      function submitUnfinishedTip(arr, per) {
          var num = arr.length > 10 ? arr.splice(0, 5).join('、') + "......" : arr.join('、');
          var confirmPopup = $ionicPopup.confirm({
              title: '交卷提示',
              cssClass: 'practiceExam',
              template: '<div class="tip-warning">'
                        + '<span>你还有第' + num + '题没有做，确定交卷吗？</span>'
                        + '</div>',
              buttons: [
                {
                    text: "确定交卷",
                    onTap: function (e) {
                        var answerJson = JSON.stringify($scope.answerList);
                        var getdata = 'FunctionName=Exam.SaveStudentScore&Version=1&EndClientType=H5&Key=""&JsonPara=' + answerJson;
                        var getUrlData = '/Entrace/Dispatch.aspx'
                        $.ajax({
                            url: getUrlData,
                            data: getdata,
                            type: "POST",
                            dataType: "json",
                            success: function (data) {
                                $scope.$apply(function () {
                                    subSuccessTip(per, data)  //交卷成功                                    
                                });
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                resubmitFailed(per);//交卷失败
                            }
                        });
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
      function  resubmitFailed(per) {
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
                        var answerJson = JSON.stringify($scope.answerList);
                        var getdata = 'FunctionName=Exam.SaveStudentScore&Version=1&EndClientType=H5&Key=""&JsonPara=' + answerJson;
                        var getUrlData = '/Entrace/Dispatch.aspx'
                        $.ajax({
                            url: getUrlData,
                            data: getdata,
                            type: "POST",
                            dataType: "json",
                            success: function (data) {
                                $scope.$apply(function () {
                                    subSuccessTip(per, data)  //交卷成功
                                });
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                $scope.$apply(function () {
                                    resubmitFailed(per);//交卷失败
                                });
                            }
                        });
                    }
                }, {
                    text: "取消",
                    onTap: function (e) {
                    }
                }
              ]
          });
      };
      //返回试卷列表
      $scope.goPaperList = function (state, courseId, paperState, ProductName) {
          $state.go(state, { courseId: courseId, paperState: paperState });
          $rootScope.courseName = ProductName;
      }
      //试卷解析
      function parperAnalysis() {
          $scope.analysisiList = [];
          var getUrlData = '/Entrace/Dispatch.aspx?FunctionName=Exam.GetPaperExplaination&Version=1&EndClientType=H5&Key=""&JsonPara={"PaperCode":"' + $scope.PaperCode + '","CourseId":"' + $scope.courseId + '","StudentId":"' + $scope.studentId + '"}';//20160907993/20160907947
          $.ajax({
              url: getUrlData,
              data: {},
              type: "GET",
              dataType: "json",
              success: function (data) {
                  $scope.$apply(function () {
                      $scope.Data = data;
                      $scope.GroupName = $scope.Data.PaperName;
                      $scope.GroupList = $scope.Data.GroupList;
                      $scope.QuestionList = $scope.Data.GroupList[$scope.groupNum].QuestionList;
                      if (finishSubject.length == 0) {
                          for (var i = 0; i < $scope.GroupList.length; i++) {
                              for (var j = 0; j < $scope.GroupList[i].QuestionList.length; j++) {
                                  var Answer = {
                                      "GroupId": $scope.GroupList[i].QuestionList[j].GroupId,
                                      "QuestionId": $scope.GroupList[i].QuestionList[j].QuestionId,
                                      "Type": $scope.GroupList[i].QuestionList[j].Type + "",
                                      "Answer": $scope.GroupList[i].QuestionList[j].StudentAnswer
                                  };
                                  var analysis = {
                                      "Explaination": $scope.GroupList[i].QuestionList[j].Explaination,
                                      "Answer": $scope.GroupList[i].QuestionList[j].Answer
                                  }
                                  finishSubject.push(Answer);
                                  $scope.analysisiList.push(analysis);
                              }
                              groupListNum.push($scope.GroupList[i].QuestionList.length);
                          }
                      }
                      $scope.listNum = finishSubject.length;
                      $('.paper-Number').html("");
                      for (var i = 0; i < $scope.listNum; i++) {
                          if (finishSubject[i].Answer == "") {
                              $('.paper-Number').append('<li class="col col-25">' + (i + 1) + '</li>');
                          } else {
                              $('.paper-Number').append('<li class="col col-25 active">' + (i + 1) + '</li>');
                          }   
                      };
                      getIdx();//绑定用户选择结果
                  });
              }
          });
      }
      //获取结果（单选题组合题单选题）
      function getResult(num,listnum) {
          var idx=[];
          var b;          
          if (listnum != "") {//组合题
              for (var i = 0; i < listnum; i++) {
                  if (finishSubject[num+i - 1] != undefined) {
                      var result = finishSubject[num + i - 1].Answer;
                      var a = result.split('');
                      if (finishSubject[num + i - 1].Type == "2") {//多选题
                          var arr = [];
                          for (var j = 0; j < a.length; j++) {
                              switch (a[j]) {
                                  case "A":
                                      b = 0;
                                      break;
                                  case "B":
                                      b = 1;
                                      break;
                                  case "C":
                                      b = 2;
                                      break;
                                  case "D":
                                      b = 3;
                                      break;
                                  case "E":
                                      b = 4;
                                      break;
                              }
                              arr[b]=b;
                          }
                          idx[i] = arr;
                      } else {
                          switch (result) {
                              case "A":
                              case "on":
                                  idx[i] = 0;
                                  break;
                              case "B":
                              case "off":
                                  idx[i] = 1;
                                  break;
                              case "C":
                                  idx[i] = 2;
                                  break;
                              case "D":
                                  idx[i] = 3;
                                  break;
                              case "E":
                                  idx[i] = 4;
                                  break;
                          }
                      }                           
                  }
              }             
          } else {//非组合题
              if (finishSubject[num - 1] != undefined) {
                  var result = finishSubject[num - 1].Answer;
                  var a = result.split('');
                  if (finishSubject[num - 1].Type =="2") {//多选题
                      for (var j = 0; j < a.length; j++) {
                          switch (a[j]) {
                              case "A":
                                  b = 0;
                                  break;
                              case "B":
                                  b = 1;
                                  break;
                              case "C":
                                  b = 2;
                                  break;
                              case "D":
                                  b = 3;
                                  break;
                              case "E":
                                  b = 4;
                                  break;
                          }
                          idx[b] = b;
                      }
                  } else {
                      switch (result) {
                          case "A":
                          case "on":
                              idx[0] = 0;
                              break;
                          case "B":
                          case "off":
                              idx[0] = 1;
                              break;
                          case "C":
                              idx[0] = 2;
                              break;
                          case "D":
                              idx[0] = 3;
                              break;
                          case "E":
                              idx[0] = 4;
                              break;
                      }
                  }
              }
          }
          return idx;
      }
      //解析跳转
      $scope.goPaper = function () {
          $state.go('ExaminationPaper', { paperCode: $scope.PaperCode, courseId: $scope.courseId, redo: "", analysis: true });
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
.filter('filterTitle', function () {
    return function (item) {
        switch (item) {
            case 1:
                return "单选题";
                break;
            case 2:
                return "多选题"
                break;
            case 3:
                return "判断题"
                break;
        }
    }
})
.filter('fillterAnswer', function () {
    return function (item) {
        switch (item) {
            case "on":
                return "是";
                break;
            case "off":
                return "否";
                break;
            default:
                return item;
                break;
        }
    }
})
.filter('filterQuestion', ['$sce', function ($sce) {
    return function (item) {
        return $sce.trustAsHtml(item);
    };
}]);