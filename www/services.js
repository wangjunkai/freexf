;(function () {
  'use strict';

  angular.module('freexf')
    //配置api路径
    .constant('ENV', {
      '_base': '/MFreeXFapi/student',
      '_api': {
        __GetIndexGather: 'GetIndexGather'
      }
    })
    //修改RestAngular配置
    .factory('freexfRestAngular', function (Restangular, ENV) {
      return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(ENV._base);
        RestangularConfigurer.addFullRequestInterceptor(function (elem, option, what, url, title, params) {
          debugger
          return elem;
        });
        RestangularConfigurer.addResponseInterceptor(function (elem, option, what, url, response, deferred) {
          debugger
          return elem;
        });
        RestangularConfigurer.addErrorInterceptor(function (response, deferred, responseHandler) {
          console.warn(response.data.Message + '\n' + response.data.MessageDetail);
          if (response.status === 404) {}
        });
      })
    })
    //添加模块基类
    .factory('baseRestAngular', function () {
      function baseRestAngular(restangular, route) {
        this.restangular = restangular;
        this.route = route;
      }

      baseRestAngular.prototype = {
        getList: function (params) {
          return this.restangular.all(this.route).getList(params).$object;
        },
        getModel: function (params) {
          return this.restangular.one(this.route).get(params);
        },
        update: function (updatedResource) {
          return updatedResource.put().$object;
        },
        create: function (newResource) {
          return this.restangular.all(this.route).post(newResource);
        },
        remove: function (object) {
          return this.restangular.one(this.route, object.id).remove();
        }
      };
      baseRestAngular.extend = function (repository) {
        repository.prototype = $.extend(Object.create(baseRestAngular.prototype), repository.prototype);
        repository.prototype.constructor = repository;
      };

      return baseRestAngular;
    })
    //首页
    .factory('HomeRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function HomeRepository() {
        baseRestAngular.call(this, freexfRestAngular, ENV._api.__GetIndexGather)
      }

      HomeRepository.prototype = {
        getModelById: function (id, params) {
          return this.restangular.one(this.route, id).get(params);
        }
      };
      baseRestAngular.extend(HomeRepository);
      return new HomeRepository();
    })
    //账户认证
    .factory('authRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function authRepository() {
        baseRestAngular.call(this, freexfRestAngular, ENV._api.__GetIndexGather)
      }

      baseRestAngular.extend(authRepository);
      return new authRepository();
    });
})();
