;(function () {
  'use strict';

  angular.module('freexf')
    //配置api路径
    .constant('ENV', {
      '_timeout': 10000,
      '_base': '/MFreeXFapi/student',
      '_api': {
        __GetIndexGather: 'GetIndexGather',
        __GetIndexGather2: 'GetIndexGather2'
      }
    })
    //修改RestAngular配置
    .factory('freexfRestAngular', function ($rootScope, $timeout, $ionicLoading, Restangular, ENV) {
      return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(ENV._base);
        RestangularConfigurer.setDefaultHttpFields({timeout: ENV._timeout});
        //请求拦截器
        RestangularConfigurer.addFullRequestInterceptor(function (elem, option, what, url, title, params) {
          ($rootScope.xhr && ($rootScope.xhr++)) || ($rootScope.xhr = 1);

          return elem;
        });
        //响应拦截器
        RestangularConfigurer.addResponseInterceptor(function (elem, option, what, url, response, deferred) {
          ($rootScope.xhr--) - 1 || $ionicLoading.hide();

          return {'response': response};
        });
        //错误拦截器
        RestangularConfigurer.addErrorInterceptor(function (response, deferred, responseHandler) {
          $rootScope.xhr--;
          var timeoutTpl = '<ion-spinner icon="bubbles"></ion-spinner><div class="font">数据请求超时,请重试!</div>',
            errorTpl = '<ion-spinner icon="bubbles"></ion-spinner><div class="font">请求错误,请重试!</div>';
          var msg = '';
          var ionicLoadingFunction = function (tpl, hide) {
            $timeout(function () {
              $ionicLoading.show({template: tpl});
              !!hide && $timeout(function () {
                $ionicLoading.hide();
              }, 5000)
            }, 1000);
          };
          switch (response.status) {
            case 0:
            case 502:
              ionicLoadingFunction(timeoutTpl, true);
              msg = '加载超时..';
              break;
            case 404:
              ionicLoadingFunction(errorTpl, true);
              break;
            default:
              break;
          }

          console.warn((typeof response.data === 'string' || response.data === null)
            ? (response.data === null ? msg : response.data)
            : response.data.Message + '\n' + response.data.MessageDetail);
        });
      })
    })
    //添加模块基类
    .factory('baseRestAngular', function (freexfRestAngular) {
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
      baseRestAngular.prototype = $.extend(Object.create(freexfRestAngular), baseRestAngular.prototype);

      baseRestAngular.extend = function (repository) {
        repository.prototype = $.extend(Object.create(baseRestAngular.prototype), repository.prototype);
        repository.prototype.constructor = repository;
      };

      return baseRestAngular;
    })
    //首页
    .factory('HomeRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function HomeRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__GetIndexGather)
      }

      HomeRepository.prototype = {
        getModelById: function (id, params) {
          return this.restangular.one(this.route, id).get(params);
        }
      };
      baseRestAngular.extend(HomeRepository);

      return function (api) {
        return new HomeRepository(api);
      }
    })
    //账户认证
    .factory('authRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function authRepository() {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__GetIndexGather)
      }

      baseRestAngular.extend(authRepository);
      return function (api) {
        return new authRepository(api);
      }
    });
})();
