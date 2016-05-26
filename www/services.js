;(function () {
  'use strict';

  angular.module('freexf')
    //配置api路径
    .constant('ENV', {
      '_timeout': 5000,
      '_base': '/MFreeXFapi/student',
      '_api': {
          __GetIndexGather: 'GetIndexGather',
          __courselistpage: 'courselistpage',   //课程列表
          __mycourse: 'mycourse',
          __coursedate: 'courseData',    //课程详情
          __GetCategory: 'GetCategory',
          __searchcourse: 'searchcourse',//搜索课程
          __recommendcourse: 'recommendcourse',//推荐课程（暂无页面）
          __feedback: "feedback", //意见反馈
          __aboutus: 'aboutus' //关于我们
      }
    })
    //修改RestAngular配置
    .factory('freexfRestAngular', function ($rootScope, $timeout, $ionicLoading,$Loading, Restangular, ENV) {
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
          ($rootScope.xhr--) - 1 || $Loading._hide();

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
      function baseRestAngular(restangular, route, base) {
        var newRestAngular = base ? restangular.withConfig(function (Configurer) {
          Configurer.setBaseUrl(base);
        }) : restangular;
        this.restangular = newRestAngular;
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
    .factory('AuthRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function AuthRepository(api, base) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__GetIndexGather,base)
      }

      baseRestAngular.extend(AuthRepository);
      return function (api, base) {
        return new AuthRepository(api, base);
      }
    })
    //课程列表
    .factory('CourseListRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function CourseListRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__courselistpage)
      }

      baseRestAngular.extend(CourseListRepository);
      return function (api) {
        return new CourseListRepository(api);
      }
    })
    //我的课程
    .factory('myCourse', function (ENV, freexfRestAngular, baseRestAngular) {
      function myCourse(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__mycourse)
      }

      baseRestAngular.extend(myCourse);
      return function (api) {
        return new myCourse(api);
      }
    })
    //推荐课程
    .factory('RecommendCourse', function (ENV, freexfRestAngular, baseRestAngular) {
      function RecommendCourse(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__recommendcourse)
      }

      baseRestAngular.extend(RecommendCourse);
      return function (api) {
        return new RecommendCourse(api);
      }
    })
    //课程信息
    .factory('CourseDateRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function CourseDateRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__coursedate)
      }

      baseRestAngular.extend(CourseDateRepository);
      return function (api) {
        return new CourseDateRepository(api);
      }
    })
    //推荐课程
    .factory('RecommendCourse', function (ENV, freexfRestAngular, baseRestAngular) {
      function RecommendCourse(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__recommendcourse)
      }

      baseRestAngular.extend(RecommendCourse);
      return function (api) {
        return new RecommendCourse(api);
      }

    })
    //搜索课程
    .factory('SearchCourse', function (ENV, freexfRestAngular, baseRestAngular) {
      function SearchCourse(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__searchcourse)
      }

      baseRestAngular.extend(SearchCourse);
      return function (api) {
        return new SearchCourse(api);
      }

    })
    //一二级分类
    .factory('GetCategoryRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function GetCategoryRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__GetCategory)
      }

      baseRestAngular.extend(GetCategoryRepository);
      return function (api) {
        return new GetCategoryRepository(api);
      }
    })
    //意见反馈
    .factory('feedBack', function (ENV, freexfRestAngular, baseRestAngular) {
      function feedBack(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__feedback)
      }

    baseRestAngular.extend(feedBack);
    return function (api) {
      return new feedBack(api);
    }
  })
    //关于我们
    .factory('aboutUs', function (ENV, freexfRestAngular, baseRestAngular) {
      function aboutUs(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__aboutus)
      }

      baseRestAngular.extend(aboutUs);
      return function (api) {
        return new aboutUs(api);
      }
    });

})();
