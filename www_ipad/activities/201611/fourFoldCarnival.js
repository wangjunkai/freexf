'use strict';

angular.module('freexf')
  .controller('fourFoldCarnival_ctrl', function ($scope, $state,$frModal) {
    $scope.zhongxiaoxue = [
      {key: '1', value: '7a0ce779f4194cc2ae136d26ad7af9b5'},
      {key: '2', value: '084284722c9649e99467376746016d89'},
      {key: '3', value: '536e5e67b81442879a448ec6c9dd4658'},
      {key: '4', value: '50fd0fe57c5841de8158a349fd6e6e63'},
      {key: '5', value: '77485d75eae846b682705897af56ed9b'},
      {key: '6', value: '5583846da22c497dba607254c38746e7'}
    ];
    $scope.duoyuzhong = [
      {key: '7', value: '9b80691974e544abaffcdc77b75a7f4b'},
      {key: '8', value: '72b04609c88e474a8d20a6ccf9e78341'},
      {key: '9', value: 'e7144e6af52a41e4af6ff52a2c421073'},
      {key: '10', value: '7957f8e089e94d1281db0980b89fcffb'},
      {key: '11', value: 'dc11d8c0b80c48bba1b9382801ede9ea'},
      {key: '12', value: '4b45418d06fa4a57bd1888935483071a'}
    ];
    $scope.yingyu = [
      {key: '13', value: '3f9b0819eae74664a333f7e7b5a8b17f'},
      {key: '14', value: 'b369caf1653a492b9e90494900d4bacd'},
      {key: '15', value: 'c0bf3ed733f548b7a6e8a480ce325214'},
      {key: '16', value: 'bb6f6a6e96b64de0b4fee24e341ceb39'}
    ];
    $scope.kuaiji = [
      {key: '17', value: 'efbae01348724a539b876080826416ac'},
      {key: '18', value: '0ec52858dcc242f491594d6cf72ad061'},
      {key: '19', value: '7d49475ba62e402cbdae3386b5450050'},
      {key: '20', value: '378322b500964be0b1828f2d407e8ea3'}
    ];

    //传递：courseId 课程ID
    var modal_ary = {
      coursedetail: {
        scope: $scope,
        ctrlUrl: 'modules/course/coursedetail',
        tempUrl: 'modules/course/coursedetail.html'
      }
    };
    $scope.goDetail = function (name, data, back) {
      $frModal.openModal($scope, name, modal_ary, data, back);
    };
    $scope.goPlate = function(obj){
      $state.go('courseplate',obj);
    };
    $scope.goregister = function(){
      $state.go('register');
    }
  });
