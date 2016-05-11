'use strict';

define(['ionic'], function () {

  angular.module('freexf.member',['ionic'])
    .config(function ($stateProvider) {
      //模块路由
      $stateProvider
        .state('tab.member', {
          url: '/member',
          views: {
            'member': {
              templateUrl: 'modules/member/member.html',
              controller: 'member_ctrl'
            }
          }
        })
    })

    .controller('member_ctrl', function ($scope) {

    })

});
