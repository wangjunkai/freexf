;(function () {
  'use strict';

  angular.module('freexf')
  //配置api路径
    .constant('ENV', {
      '_timeout': 15000,
      '_base': '/MFreeXFapi/student',
      '_api': {
        __GetIndexGather: 'GetIndexGather',
        __courselistpage: 'courselistpage',   //课程列表
        __mycourse: 'GetMyCourses',
        __coursedate: 'courseData',    //课程详情
        __GetCategory: 'GetCategory',     //一二级分类
        __searchcourse: 'searchcourse',//搜索课程
        __recommendcourse: 'recommendcourse',//推荐课程（暂无页面）
        __feedback: "feedback", //意见反馈
        __aboutus: 'aboutus', //关于我们
        __faq: 'MobileFaq',
        __myfavorite: 'myfavorite',  //我的收藏课程
        __addfavorite: 'addfavorite',    //收藏
        __delfavorite: 'delfavorite',    //取消收藏
        __getuserinformation: 'getuserinformation', //获取个人信息
        __orderList: 'orderList',//我的订单
        __delorder: 'delorder',//取消订单
        __AddOrder: 'AddOrder',//添加订单
        __orderpay: 'orderpay',//支付地址
        __addorderaddress: 'addorderaddress',//提交地址
        __myAccountCrouse: 'myAccountCrouse',  //账户中心
        __UpdateNewValue: 'UpdateNewValue',//修改个人信息
        __addflower: 'addflower',
        __removeflower: 'removeflower',
        __GetspecialAllList: 'GetspecialAllList',//暑期推广
        __GetCourseDetail: 'GetCourseDetail',    //课程简介
        __GetCourseOutline: 'GetCourseOutline',  //课程大纲
        __GetvideoUrl: 'GetvideoUrl',
        __GetCategory_v01: 'GetCategory_v01',    //新一二级分类
        __UpdateAPES: 'UpdateAPES',
        __RealTimeUpdate: 'RealTimeUpdate',
        __MobileFaq: 'MobileFaq'
      }
    })
    //修改RestAngular配置
    .factory('freexfRestAngular', function ($rootScope, $state, $timeout, $Loading, localStorageService, Restangular, ENV, AUTH) {
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
          //($rootScope.xhr--) - 1 || $Loading.hide();d
          if (elem && angular.isObject(elem) && elem.SignStatus && elem.SignStatus !== 'True') {
            if (AUTH.FREEXFUSER.data.userLg && AUTH.FREEXFUSER.data.rememberPw) {
              AUTH.toLogin().then(function (req) {
                AUTH.FREEXFUSER.data.Sign = req.response.data['Sign'];
                AUTH.FREEXFUSER.data.rowId = req.response.data['rowId'];
                localStorageService.set(AUTH.FREEXFUSER.name, AUTH.FREEXFUSER.data);
                $state.reload();
              });
            }
            else if (AUTH.FREEXFUSER.data.userLg && !AUTH.FREEXFUSER.data.rememberPw) {
              AUTH.FREEXFUSER.data.userLg = false;
              localStorageService.set(AUTH.FREEXFUSER.name, AUTH.FREEXFUSER.data);
              $state.go('login');
            }
          }
          return {'response': response};
        });
        //错误拦截器
        RestangularConfigurer.addErrorInterceptor(function (response, deferred, responseHandler) {
          $rootScope.xhr--;
          var timeoutTpl = '<ion-spinner icon="bubbles"></ion-spinner><div class="font">数据请求超时,请重试!</div>',
            errorTpl = '<ion-spinner icon="bubbles"></ion-spinner><div class="font">请求错误,请重试!</div>';
          var msg = '';
          switch (response.status) {
            case 0:
            case 502:
              $Loading.show({template: timeoutTpl});
              msg = '加载超时..';
              break;
            case 404:
              $Loading.show({template: errorTpl});
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
        postModel: function (params) {
          return this.restangular.all(this.route).post(params);
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
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__GetIndexGather, base)
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
    .factory('MyCourseRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function MyCourseRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__mycourse)
      }

      baseRestAngular.extend(MyCourseRepository);
      return function (api) {
        return new MyCourseRepository(api);
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
    .factory('MobileFaq', function (ENV, freexfRestAngular, baseRestAngular) {
      function MobileFaq(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__faq)
      }

      baseRestAngular.extend(MobileFaq);
      return function (api) {
        return new MobileFaq(api);
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
    })
    //收藏课程
    .factory('AddMyFavoriteRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function AddMyFavoriteRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__addfavorite)
      }

      baseRestAngular.extend(AddMyFavoriteRepository);
      return function (api) {
        return new AddMyFavoriteRepository(api);
      }
    })
    //取消收藏
    .factory('DelMyFavoriteRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function DelMyFavoriteRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__delfavorite)
      }

      baseRestAngular.extend(DelMyFavoriteRepository);
      return function (api) {
        return new DelMyFavoriteRepository(api);
      }
    })
    //我的收藏课程
    .factory('GetMyFavoriteRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function GetMyFavoriteRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__myfavorite)
      }

      baseRestAngular.extend(GetMyFavoriteRepository);
      return function (api) {
        return new GetMyFavoriteRepository(api);
      }
    })
    //获取个人信息
    .factory('getuserinf', function (ENV, freexfRestAngular, baseRestAngular) {
      function getuserinf(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__getuserinformation)
      }

      baseRestAngular.extend(getuserinf);
      return function (api) {
        return new getuserinf(api);
      }
    })
    //修改个人信息
    .factory('UpdateUserValue', function (ENV, freexfRestAngular, baseRestAngular) {
      function UpdateUserValue(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__UpdateNewValue)
      }

      baseRestAngular.extend(UpdateUserValue);
      return function (api) {
        return new UpdateUserValue(api);
      }
    })
    //我的订单
    .factory('OrderList', function (ENV, freexfRestAngular, baseRestAngular) {
      function OrderList(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__orderList)
      }

      baseRestAngular.extend(OrderList);
      return function (api) {
        return new OrderList(api);
      }
    })
    //取消订单
    .factory('DelOrder', function (ENV, freexfRestAngular, baseRestAngular) {
      function DelOrder(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__delorder)
      }

      baseRestAngular.extend(DelOrder);
      return function (api) {
        return new DelOrder(api);
      }
    })
    //支付地址
    .factory('PayAddress', function (ENV, freexfRestAngular, baseRestAngular) {
      function PayAddress(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__orderpay)
      }

      baseRestAngular.extend(PayAddress);
      return function (api) {
        return new PayAddress(api);
      }
    })
    //提交支付地址
    .factory('AddOrderAddress', function (ENV, freexfRestAngular, baseRestAngular) {
      function AddOrderAddress(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__addorderaddress)
      }

      baseRestAngular.extend(AddOrderAddress);
      return function (api) {
        return new AddOrderAddress(api);
      }
    })
    //课程信息
    .factory('AddOrderFun', function (ENV, freexfRestAngular, baseRestAngular) {
      function AddOrderFun(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__AddOrder)
      }

      baseRestAngular.extend(AddOrderFun);
      return function (api) {
        return new AddOrderFun(api);
      }
    })
    //账户中心
    .factory('MyAccountCrouseRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function MyAccountCrouseRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__myAccountCrouse)
      }

      baseRestAngular.extend(MyAccountCrouseRepository);
      return function (api) {
        return new MyAccountCrouseRepository(api);
      }
    })
    //献花
    .factory('AddFlower', function (ENV, freexfRestAngular, baseRestAngular) {
      function AddFlower(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__addflower)
      }

      baseRestAngular.extend(AddFlower);
      return function (api) {
        return new AddFlower(api);
      }
    })
    //暑期推广课程
    .factory('GetspecialAllListRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function GetspecialAllListRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__GetspecialAllList)
      }

      baseRestAngular.extend(GetspecialAllListRepository);
      return function (api) {
        return new GetspecialAllListRepository(api);
      }
    })
    //取消献花
    .factory('RemoveFlower', function (ENV, freexfRestAngular, baseRestAngular) {
      function RemoveFlower(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__removeflower)
      }

      baseRestAngular.extend(RemoveFlower);
      return function (api) {
        return new RemoveFlower(api);
      }
    })
    //课程简介
    .factory('GetCourseDetailRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function GetCourseDetailRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__GetCourseDetail)
      }

      baseRestAngular.extend(GetCourseDetailRepository);
      return function (api) {
        return new GetCourseDetailRepository(api);
      }
    })
    //课程大纲
    .factory('GetCourseOutlineRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function GetCourseOutlineRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__GetCourseOutline)
      }

      baseRestAngular.extend(GetCourseOutlineRepository);
      return function (api) {
        return new GetCourseOutlineRepository(api);
      }
    })
    //获取视频路径
    .factory('GetvideoUrlRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function GetvideoUrlRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__GetvideoUrl)
      }

      baseRestAngular.extend(GetvideoUrlRepository);
      return function (api) {
        return new GetvideoUrlRepository(api);
      }
    })
    //新一二级分类
    .factory('NewGetCategoryRepository', function (ENV, freexfRestAngular, baseRestAngular) {
      function NewGetCategoryRepository(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__GetCategory_v01)
      }

      baseRestAngular.extend(NewGetCategoryRepository);
      return function (api) {
        return new NewGetCategoryRepository(api);
      }
    })
    //APES
    .factory('UpdateAPES', function (ENV, freexfRestAngular, baseRestAngular) {
      function UpdateAPES(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__UpdateAPES)
      }

      baseRestAngular.extend(UpdateAPES);
      return function (api) {
        return new UpdateAPES(api);
      }
    })
    //支付验证
    .factory('RealTimeUpdate', function (ENV, freexfRestAngular, baseRestAngular) {
      function RealTimeUpdate(api) {
        baseRestAngular.call(this, freexfRestAngular, api ? api : ENV._api.__RealTimeUpdate)
      }

      baseRestAngular.extend(RealTimeUpdate);
      return function (api) {
        return new RealTimeUpdate(api);
      }
    });

})();
