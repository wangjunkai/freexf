'use strict';

angular.module('freexf')

  .factory('Home', function ($resource, ENV) {
    var home = $resource(ENV.api + 'api/home/:id', null, {
      login: {
        method: 'post',
        url: ENV.api + 'api/home/login',
        isArray: false
      },
      query: {method: 'get', isArray: true},
      update: {method: 'put'}
    });
    var user = $resource(ENV.api + 'api/user/:id', {
      id: '@id'
    }, {
      update: {method: 'put'}
    });
    user.prototype.getName = function () {
      return this.name;
    };
    return {
      home: home,
      user: user
    };
  });
