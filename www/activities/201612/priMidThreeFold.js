'use strict';

angular.module('freexf')
  .controller('priMidThreeFold_ctrl', function ($scope, $rootScope, $injector, $state, $ionicLoading, $ionicModal, $fxModal, AUTH, ENV, DispatchRepository) {
      $scope.userData = AUTH.FREEXFUSER.data;
      $rootScope.$on('auth:update', function (event, auth) {
          $scope.userData = auth;
      });

      $(function () {
          $('.sync').height($('.sync').width() * 1.4);
          $('.knowledge').height($('.knowledge').width() * 1.4);
          $('.expansion').height($('.expansion').width() * 1.4);
          $('.system-content').height($('.knowledge').width() * 1.4);

          //登陆注册modal
          $fxModal.init($scope).then(function (modal) {
              $scope.modal = modal;
          });
          //登录弹框
          $scope.loginDialog = function () {
              $state.otherGo('login', function () {
                  $scope.modal.openModal('login');
              }, null);
          }
          //注册弹框
          $scope.registerDialog = function () {
              $state.otherGo('register', function () {
                  $scope.modal.openModal('register');
              }, null);
          }

          //禁止浏览器默认滑动事件
          var system = $('.system')[0];
          document.body.system = function (event) {
              event.preventDefault();
          }

          //右滑 
          $scope.onSwipeRight = function () {
              var height = $('.left').width() * 1.4;
              $('.sysitem').each(function () {
                  var $this = $(this);
                  $this.height(height);
                  var index = $this.attr('index') * 1 + 1;
                  if (index == 2) {
                      index = -1;
                      $this.removeClass('right').addClass('middle');
                      $this.parent().animate({
                          left: 0,
                      }, 500, function () {
                          $(this).find('.sysitem').removeClass('middle').addClass('left')//.height($(this).width() * 1.4);
                          $(this).removeClass('right-box').addClass('left-box');
                      });
                  }
                  else if (index == 1) {
                      $this.parent().addClass('down');
                      $this.removeClass('middle')
                      $this.parent().animate({
                          left: '65%',
                          width: '35%',
                      }, 500, function () {
                          $(this).find('.sysitem').addClass('right')//.height($(this).width() * 1.4);
                          $(this).removeClass('middle-box').removeClass('down').addClass('right-box');
                      });
                  }
                  else {
                      $this.removeClass('left').addClass('middle');
                      $this.parent().addClass('showup');
                      $this.parent().animate({
                          left: '30%',
                          width: '40%',
                      }, 500, function () {
                          $(this).find('.sysitem').height($(this).width() * 1.4);
                          $(this).removeClass('showup').removeClass('left-box').addClass('middle-box');
                      });
                  }
                  $this.attr('index', index);
              })
          }

          //左滑 
          $scope.onSwipeLeft = function () {
              var height = $('.left').width() * 1.4;
              $('.sysitem').each(function () {
                  var $this = $(this);
                  $this.height(height);
                  var index = $this.attr('index') * 1 - 1;
                  if (index == -2) {
                      index = 1;
                      $this.removeClass('left').addClass('middle');
                      $this.parent().animate({
                          left: '65%',
                      }, 500, function () {
                          $(this).find('.sysitem').removeClass('middle').addClass('right')//.height($(this).width() * 1.4);
                          $(this).removeClass('left-box').addClass('right-box');
                      });
                  }
                  else if (index == -1) {
                      $this.parent().addClass('down');
                      $this.removeClass('middle')
                      $this.parent().animate({
                          left: 0,
                          width: '35%',
                      }, 500, function () {
                          $(this).find('.sysitem').addClass('left')//.height($(this).width() * 1.4);
                          $(this).removeClass('middle-box').removeClass('down').addClass('left-box');
                      });
                  }
                  else {
                      $this.removeClass('right').addClass('middle');
                      $this.parent().addClass('showup');
                      $this.parent().animate({
                          left: '30%',
                          width: '40%',
                      }, 500, function () {
                          $(this).find('.sysitem').height($(this).width() * 1.4);
                          $(this).removeClass('showup').removeClass('right-box').addClass('middle-box');
                      });
                  }
                  $this.attr('index', index);
              })
          }
      })

      //教师
      var teacherurl = '/entrace/Dispatch.aspx?EndClientType=PC&FunctionName=Student.%E6%95%99%E5%B8%88%E5%88%97%E8%A1%A8&JsonPara=%7B%22Second%22:%22%E4%B8%AD%E5%B0%8F%E5%AD%A6%22%7D&Version=1';
      $.ajax({
          type: 'POST',
          cache: 'false',
          url: teacherurl,
          dataType: "json",
          success: function (data) {
              showTeacher(data)
          }
      });

      function showTeacher(data) {
          var teaCon = $('.teacher-content');
          var teaConWidth = teaCon.width();
          var sigboxWidth = (teaConWidth - 24) / 4;

          $(data).each(function (i) {
              var sigbox = $('<div class="sigbox" id="teacher' + i + '"></div>').appendTo(teaCon);
              var pic = $('<div class="pic"></div>').appendTo(sigbox);
              var teaImg = $('<img src="' + this.Image + '" />').appendTo(pic);
              var teaSpan = $('<span></span>').text(this.Name + '老师').appendTo(sigbox);
              sigbox.width(sigboxWidth);
              teaImg.width(sigboxWidth * 0.9).height(sigboxWidth * 0.9);
          })
      }
  });