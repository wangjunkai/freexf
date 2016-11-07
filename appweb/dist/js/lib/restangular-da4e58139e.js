!function(){var e=angular.module("restangular",[]);e.provider("Restangular",function(){var e={};e.init=function(e,t){function r(e,t,r,n){var s={};return _.each(_.keys(n),function(a){var i=n[a];i.params=_.extend({},i.params,e.defaultRequestParams[i.method.toLowerCase()]),_.isEmpty(i.params)&&delete i.params,e.isSafe(i.method)?s[a]=function(){return t(_.extend(i,{url:r}))}:s[a]=function(e){return t(_.extend(i,{url:r,data:e}))}}),s}e.configuration=t;var n=["get","head","options","trace","getlist"];t.isSafe=function(e){return _.includes(n,e.toLowerCase())};var s=/^https?:\/\//i;t.isAbsoluteUrl=function(e){return _.isUndefined(t.absoluteUrl)||_.isNull(t.absoluteUrl)?e&&s.test(e):t.absoluteUrl},t.absoluteUrl=_.isUndefined(t.absoluteUrl)?!0:t.absoluteUrl,e.setSelfLinkAbsoluteUrl=function(e){t.absoluteUrl=e},t.baseUrl=_.isUndefined(t.baseUrl)?"":t.baseUrl,e.setBaseUrl=function(e){return t.baseUrl=/\/$/.test(e)?e.substring(0,e.length-1):e,this},t.extraFields=t.extraFields||[],e.setExtraFields=function(e){return t.extraFields=e,this},t.defaultHttpFields=t.defaultHttpFields||{},e.setDefaultHttpFields=function(e){return t.defaultHttpFields=e,this},t.withHttpValues=function(e,r){return _.defaults(r,e,t.defaultHttpFields)},t.encodeIds=_.isUndefined(t.encodeIds)?!0:t.encodeIds,e.setEncodeIds=function(e){t.encodeIds=e},t.defaultRequestParams=t.defaultRequestParams||{get:{},post:{},put:{},remove:{},common:{}},e.setDefaultRequestParams=function(e,r){var n=[],s=r||e;return _.isUndefined(r)?n.push("common"):_.isArray(e)?n=e:n.push(e),_.each(n,function(e){t.defaultRequestParams[e]=s}),this},e.requestParams=t.defaultRequestParams,t.defaultHeaders=t.defaultHeaders||{},e.setDefaultHeaders=function(r){return t.defaultHeaders=r,e.defaultHeaders=t.defaultHeaders,this},e.defaultHeaders=t.defaultHeaders,t.methodOverriders=t.methodOverriders||[],e.setMethodOverriders=function(e){var r=_.extend([],e);return t.isOverridenMethod("delete",r)&&r.push("remove"),t.methodOverriders=r,this},t.jsonp=_.isUndefined(t.jsonp)?!1:t.jsonp,e.setJsonp=function(e){t.jsonp=e},t.isOverridenMethod=function(e,r){var n=r||t.methodOverriders;return!_.isUndefined(_.find(n,function(t){return t.toLowerCase()===e.toLowerCase()}))},t.urlCreator=t.urlCreator||"path",e.setUrlCreator=function(e){if(!_.has(t.urlCreatorFactory,e))throw new Error("URL Path selected isn't valid");return t.urlCreator=e,this},t.restangularFields=t.restangularFields||{id:"id",route:"route",parentResource:"parentResource",restangularCollection:"restangularCollection",cannonicalId:"__cannonicalId",etag:"restangularEtag",selfLink:"href",get:"get",getList:"getList",put:"put",post:"post",remove:"remove",head:"head",trace:"trace",options:"options",patch:"patch",getRestangularUrl:"getRestangularUrl",getRequestedUrl:"getRequestedUrl",putElement:"putElement",addRestangularMethod:"addRestangularMethod",getParentList:"getParentList",clone:"clone",ids:"ids",httpConfig:"_$httpConfig",reqParams:"reqParams",one:"one",all:"all",several:"several",oneUrl:"oneUrl",allUrl:"allUrl",customPUT:"customPUT",customPOST:"customPOST",customDELETE:"customDELETE",customGET:"customGET",customGETLIST:"customGETLIST",customOperation:"customOperation",doPUT:"doPUT",doPOST:"doPOST",doDELETE:"doDELETE",doGET:"doGET",doGETLIST:"doGETLIST",fromServer:"fromServer",withConfig:"withConfig",withHttpConfig:"withHttpConfig",singleOne:"singleOne",plain:"plain",save:"save",restangularized:"restangularized"},e.setRestangularFields=function(e){return t.restangularFields=_.extend(t.restangularFields,e),this},t.isRestangularized=function(e){return!!e[t.restangularFields.restangularized]},t.setFieldToElem=function(e,t,r){var n=e.split("."),s=t;return _.each(_.initial(n),function(e){s[e]={},s=s[e]}),s[_.last(n)]=r,this},t.getFieldFromElem=function(e,t){var r=e.split("."),n=t;return _.each(r,function(e){n&&(n=n[e])}),angular.copy(n)},t.setIdToElem=function(e,r){return t.setFieldToElem(t.restangularFields.id,e,r),this},t.getIdFromElem=function(e){return t.getFieldFromElem(t.restangularFields.id,e)},t.isValidId=function(e){return""!==e&&!_.isUndefined(e)&&!_.isNull(e)},t.setUrlToElem=function(e,r){return t.setFieldToElem(t.restangularFields.selfLink,e,r),this},t.getUrlFromElem=function(e){return t.getFieldFromElem(t.restangularFields.selfLink,e)},t.useCannonicalId=_.isUndefined(t.useCannonicalId)?!1:t.useCannonicalId,e.setUseCannonicalId=function(e){return t.useCannonicalId=e,this},t.getCannonicalIdFromElem=function(e){var r=e[t.restangularFields.cannonicalId],n=t.isValidId(r)?r:t.getIdFromElem(e);return n},t.responseInterceptors=t.responseInterceptors||[],t.defaultResponseInterceptor=function(e){return e},t.responseExtractor=function(e,r,n,s,a,i){var o=angular.copy(t.responseInterceptors);o.push(t.defaultResponseInterceptor);var l=e;return _.each(o,function(e){l=e(l,r,n,s,a,i)}),l},e.addResponseInterceptor=function(e){return t.responseInterceptors.push(e),this},t.errorInterceptors=t.errorInterceptors||[],e.addErrorInterceptor=function(e){return t.errorInterceptors.push(e),this},e.setResponseInterceptor=e.addResponseInterceptor,e.setResponseExtractor=e.addResponseInterceptor,e.setErrorInterceptor=e.addErrorInterceptor,t.requestInterceptors=t.requestInterceptors||[],t.defaultInterceptor=function(e,t,r,n,s,a,i){return{element:e,headers:s,params:a,httpConfig:i}},t.fullRequestInterceptor=function(e,r,n,s,a,i,o){var l=angular.copy(t.requestInterceptors),u=t.defaultInterceptor(e,r,n,s,a,i,o);return _.reduce(l,function(e,t){return _.extend(e,t(e.element,r,n,s,e.headers,e.params,e.httpConfig))},u)},e.addRequestInterceptor=function(e){return t.requestInterceptors.push(function(t,r,n,s,a,i,o){return{headers:a,params:i,element:e(t,r,n,s),httpConfig:o}}),this},e.setRequestInterceptor=e.addRequestInterceptor,e.addFullRequestInterceptor=function(e){return t.requestInterceptors.push(e),this},e.setFullRequestInterceptor=e.addFullRequestInterceptor,t.onBeforeElemRestangularized=t.onBeforeElemRestangularized||function(e){return e},e.setOnBeforeElemRestangularized=function(e){return t.onBeforeElemRestangularized=e,this},e.setRestangularizePromiseInterceptor=function(e){return t.restangularizePromiseInterceptor=e,this},t.onElemRestangularized=t.onElemRestangularized||function(e){return e},e.setOnElemRestangularized=function(e){return t.onElemRestangularized=e,this},t.shouldSaveParent=t.shouldSaveParent||function(){return!0},e.setParentless=function(e){return _.isArray(e)?t.shouldSaveParent=function(t){return!_.includes(e,t)}:_.isBoolean(e)&&(t.shouldSaveParent=function(){return!e}),this},t.suffix=_.isUndefined(t.suffix)?null:t.suffix,e.setRequestSuffix=function(e){return t.suffix=e,this},t.transformers=t.transformers||{},e.addElementTransformer=function(r,n,s){var a=null,i=null;2===arguments.length?i=n:(i=s,a=n);var o=t.transformers[r];return o||(o=t.transformers[r]=[]),o.push(function(e,t){return _.isNull(a)||e===a?i(t):t}),e},e.extendCollection=function(t,r){return e.addElementTransformer(t,!0,r)},e.extendModel=function(t,r){return e.addElementTransformer(t,!1,r)},t.transformElem=function(e,r,n,s,a){if(!a&&!t.transformLocalElements&&!e[t.restangularFields.fromServer])return e;var i=t.transformers[n],o=e;return i&&_.each(i,function(e){o=e(r,o)}),t.onElemRestangularized(o,r,n,s)},t.transformLocalElements=_.isUndefined(t.transformLocalElements)?!1:t.transformLocalElements,e.setTransformOnlyServerElements=function(e){t.transformLocalElements=!e},t.fullResponse=_.isUndefined(t.fullResponse)?!1:t.fullResponse,e.setFullResponse=function(e){return t.fullResponse=e,this},t.urlCreatorFactory={};var a=function(){};a.prototype.setConfig=function(e){return this.config=e,this},a.prototype.parentsArray=function(e){for(var t=[];e;)t.push(e),e=e[this.config.restangularFields.parentResource];return t.reverse()},a.prototype.resource=function(e,n,s,a,i,o,l,u){var d=_.defaults(i||{},this.config.defaultRequestParams.common),c=_.defaults(a||{},this.config.defaultHeaders);l&&(t.isSafe(u)?c["If-None-Match"]=l:c["If-Match"]=l);var f=this.base(e);if(o){var g="";/\/$/.test(f)||(g+="/"),g+=o,f+=g}return this.config.suffix&&-1===f.indexOf(this.config.suffix,f.length-this.config.suffix.length)&&!this.config.getUrlFromElem(e)&&(f+=this.config.suffix),e[this.config.restangularFields.httpConfig]=void 0,r(this.config,n,f,{getList:this.config.withHttpValues(s,{method:"GET",params:d,headers:c}),get:this.config.withHttpValues(s,{method:"GET",params:d,headers:c}),jsonp:this.config.withHttpValues(s,{method:"jsonp",params:d,headers:c}),put:this.config.withHttpValues(s,{method:"PUT",params:d,headers:c}),post:this.config.withHttpValues(s,{method:"POST",params:d,headers:c}),remove:this.config.withHttpValues(s,{method:"DELETE",params:d,headers:c}),head:this.config.withHttpValues(s,{method:"HEAD",params:d,headers:c}),trace:this.config.withHttpValues(s,{method:"TRACE",params:d,headers:c}),options:this.config.withHttpValues(s,{method:"OPTIONS",params:d,headers:c}),patch:this.config.withHttpValues(s,{method:"PATCH",params:d,headers:c})})};var i=function(){};i.prototype=new a,i.prototype.normalizeUrl=function(e){var t=/(http[s]?:\/\/)?(.*)?/.exec(e);return t[2]=t[2].replace(/[\\\/]+/g,"/"),"undefined"!=typeof t[1]?t[1]+t[2]:t[2]},i.prototype.base=function(e){var r=this;return _.reduce(this.parentsArray(e),function(e,n){var s,a=r.config.getUrlFromElem(n);if(a){if(r.config.isAbsoluteUrl(a))return a;s=a}else if(s=n[r.config.restangularFields.route],n[r.config.restangularFields.restangularCollection]){var i=n[r.config.restangularFields.ids];i&&(s+="/"+i.join(","))}else{var o;o=r.config.useCannonicalId?r.config.getCannonicalIdFromElem(n):r.config.getIdFromElem(n),t.isValidId(o)&&!n.singleOne&&(s+="/"+(r.config.encodeIds?encodeURIComponent(o):o))}return e=e.replace(/\/$/,"")+"/"+s,r.normalizeUrl(e)},this.config.baseUrl)},i.prototype.fetchUrl=function(e,t){var r=this.base(e);return t&&(r+="/"+t),r},i.prototype.fetchRequestedUrl=function(e,r){function n(e){var t=[];for(var r in e)e.hasOwnProperty(r)&&t.push(r);return t.sort()}function s(e,t,r){for(var s=n(e),a=0;a<s.length;a++)t.call(r,e[s[a]],s[a]);return s}function a(e,t){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,t?"%20":"+")}var i=this.fetchUrl(e,r),o=e[t.restangularFields.reqParams];if(!o)return i+(this.config.suffix||"");var l=[];return s(o,function(e,t){null!==e&&void 0!==e&&(angular.isArray(e)||(e=[e]),angular.forEach(e,function(e){angular.isObject(e)&&(e=angular.toJson(e)),l.push(a(t)+"="+a(e))}))}),i+(this.config.suffix||"")+(-1===i.indexOf("?")?"?":"&")+l.join("&")},t.urlCreatorFactory.path=i};var t={};e.init(this,t),this.$get=["$http","$q",function(r,n){function s(t){function a(e,r,n,s,a){if(r[t.restangularFields.route]=n,r[t.restangularFields.getRestangularUrl]=_.bind(M.fetchUrl,M,r),r[t.restangularFields.getRequestedUrl]=_.bind(M.fetchRequestedUrl,M,r),r[t.restangularFields.addRestangularMethod]=_.bind(A,r),r[t.restangularFields.clone]=_.bind(v,r,r),r[t.restangularFields.reqParams]=_.isEmpty(s)?null:s,r[t.restangularFields.withHttpConfig]=_.bind(T,r),r[t.restangularFields.plain]=_.bind(h,r,r),r[t.restangularFields.restangularized]=!0,r[t.restangularFields.one]=_.bind(i,r,r),r[t.restangularFields.all]=_.bind(o,r,r),r[t.restangularFields.several]=_.bind(l,r,r),r[t.restangularFields.oneUrl]=_.bind(u,r,r),r[t.restangularFields.allUrl]=_.bind(d,r,r),r[t.restangularFields.fromServer]=!!a,e&&t.shouldSaveParent(n)){var c=t.getIdFromElem(e),f=t.getUrlFromElem(e),g=_.union(_.values(_.pick(t.restangularFields,["route","singleOne","parentResource"])),t.extraFields),p=_.pick(e,g);t.isValidId(c)&&t.setIdToElem(p,c,n),t.isValidId(f)&&t.setUrlToElem(p,f,n),r[t.restangularFields.parentResource]=p}else r[t.restangularFields.parentResource]=null;return r}function i(e,r,n,s){var a;if(_.isNumber(r)||_.isNumber(e))throw a="You're creating a Restangular entity with the number ",a+="instead of the route or the parent. For example, you can't call .one(12).",new Error(a);if(_.isUndefined(r))throw a="You're creating a Restangular entity either without the path. ",a+="For example you can't call .one(). Please check if your arguments are valid.",new Error(a);var i={};return t.setIdToElem(i,n,r),t.setFieldToElem(t.restangularFields.singleOne,i,s),F(e,i,r,!1)}function o(e,t){return E(e,[],t,!1)}function l(e,r){var n=[];return n[t.restangularFields.ids]=Array.prototype.splice.call(arguments,2),E(e,n,r,!1)}function u(e,r,n){if(!r)throw new Error("Route is mandatory when creating new Restangular objects.");var s={};return t.setUrlToElem(s,n,r),F(e,s,r,!1)}function d(e,r,n){if(!r)throw new Error("Route is mandatory when creating new Restangular objects.");var s={};return t.setUrlToElem(s,n,r),E(e,s,r,!1)}function c(e,r,n){return e.call=_.bind(f,e),e.get=_.bind(g,e),e[t.restangularFields.restangularCollection]=r,r&&(e.push=_.bind(f,e,"push")),e.$object=n,t.restangularizePromiseInterceptor&&t.restangularizePromiseInterceptor(e),e}function f(e){var r=n.defer(),s=arguments,a={};return this.then(function(t){var n=Array.prototype.slice.call(s,1),i=t[e];i.apply(t,n),a=t,r.resolve(t)}),c(r.promise,this[t.restangularFields.restangularCollection],a)}function g(e){var r=n.defer(),s={};return this.then(function(t){s=t[e],r.resolve(s)}),c(r.promise,this[t.restangularFields.restangularCollection],s)}function p(e,r,n,s){return _.extend(s,n),t.fullResponse?e.resolve(_.extend(r,{data:n})):void e.resolve(n)}function h(e){if(_.isArray(e)){var r=[];return _.each(e,function(e){r.push(t.isRestangularized(e)?h(e):e)}),r}return _.omit(e,_.values(_.omit(t.restangularFields,"id")))}function m(e){e[t.restangularFields.customOperation]=_.bind(j,e),_.each(["put","post","get","delete"],function(t){_.each(["do","custom"],function(r){var n,s="delete"===t?"remove":t,a=r+t.toUpperCase();n="put"!==s&&"post"!==s?j:function(e,t,r,n,s){return _.bind(j,this)(e,r,n,s,t)},e[a]=_.bind(n,e,s)})}),e[t.restangularFields.customGETLIST]=_.bind(C,e),e[t.restangularFields.doGETLIST]=e[t.restangularFields.customGETLIST]}function v(e,r){var n=angular.copy(e,r);return F(n[t.restangularFields.parentResource],n,n[t.restangularFields.route],!0)}function F(e,r,n,s,i,o){var l=t.onBeforeElemRestangularized(r,!1,n),u=a(e,l,n,o,s);return t.useCannonicalId&&(u[t.restangularFields.cannonicalId]=t.getIdFromElem(u)),i&&(u[t.restangularFields.getParentList]=function(){return i}),u[t.restangularFields.restangularCollection]=!1,u[t.restangularFields.get]=_.bind(L,u),u[t.restangularFields.getList]=_.bind(C,u),u[t.restangularFields.put]=_.bind(x,u),u[t.restangularFields.post]=_.bind(O,u),u[t.restangularFields.remove]=_.bind(P,u),u[t.restangularFields.head]=_.bind(S,u),u[t.restangularFields.trace]=_.bind(q,u),u[t.restangularFields.options]=_.bind(H,u),u[t.restangularFields.patch]=_.bind(z,u),u[t.restangularFields.save]=_.bind(y,u),m(u),t.transformElem(u,!1,n,D,!0)}function E(e,r,n,s,i){var o=t.onBeforeElemRestangularized(r,!0,n),l=a(e,o,n,i,s);return l[t.restangularFields.restangularCollection]=!0,l[t.restangularFields.post]=_.bind(O,l,null),l[t.restangularFields.remove]=_.bind(P,l),l[t.restangularFields.head]=_.bind(S,l),l[t.restangularFields.trace]=_.bind(q,l),l[t.restangularFields.putElement]=_.bind(R,l),l[t.restangularFields.options]=_.bind(H,l),l[t.restangularFields.patch]=_.bind(z,l),l[t.restangularFields.get]=_.bind(I,l),l[t.restangularFields.getList]=_.bind(C,l,null),m(l),t.transformElem(l,!0,n,D,!0)}function b(e,t,r){var n=E(e,t,r,!1);return _.each(n,function(t){F(e,t,r,!1)}),n}function I(e,t,r){return this.customGET(e.toString(),t,r)}function R(e,r,s){var a=this,i=this[e],o=n.defer(),l=[];return l=t.transformElem(l,!0,i[t.restangularFields.route],D),i.put(r,s).then(function(t){var r=v(a);r[e]=t,l=r,o.resolve(r)},function(e){o.reject(e)}),c(o.promise,!0,l)}function U(e,r,n,s,a,i){var o=t.responseExtractor(e,r,n,s,a,i),l=a.headers("ETag");return o&&l&&(o[t.restangularFields.etag]=l),o}function C(e,s,a){var i=this,o=n.defer(),l="getList",u=M.fetchUrl(this,e),d=e||i[t.restangularFields.route],f=t.fullRequestInterceptor(null,l,d,u,a||{},s||{},this[t.restangularFields.httpConfig]||{}),g=[];g=t.transformElem(g,!0,d,D);var h="getList";t.jsonp&&(h="jsonp");var m=function(r){var n=r.data,s=r.config.params,a=U(n,l,d,u,r,o);if((_.isUndefined(a)||""===a)&&(a=[]),!_.isArray(a))throw new Error("Response for getList SHOULD be an array and not an object or something else");var c=_.map(a,function(r){return i[t.restangularFields.restangularCollection]?F(i[t.restangularFields.parentResource],r,i[t.restangularFields.route],!0,a):F(i,r,e,!0,a)});c=_.extend(a,c),i[t.restangularFields.restangularCollection]?p(o,r,E(i[t.restangularFields.parentResource],c,i[t.restangularFields.route],!0,s),g):p(o,r,E(i,c,e,!0,s),g)};return M.resource(this,r,f.httpConfig,f.headers,f.params,e,this[t.restangularFields.etag],l)[h]().then(m,function(e){304===e.status&&i[t.restangularFields.restangularCollection]?p(o,e,i,g):_.every(t.errorInterceptors,function(t){return t(e,o,m)!==!1})&&o.reject(e)}),c(o.promise,!0,g)}function T(e){return this[t.restangularFields.httpConfig]=e,this}function y(e,r){return this[t.restangularFields.fromServer]?this[t.restangularFields.put](e,r):_.bind(w,this)("post",void 0,e,void 0,r)}function w(e,s,a,i,o){var l=this,u=n.defer(),d=a||{},f=s||this[t.restangularFields.route],g=M.fetchUrl(this,s),m=i||this,v=m[t.restangularFields.etag]||("post"!==e?this[t.restangularFields.etag]:null);_.isObject(m)&&t.isRestangularized(m)&&(m=h(m));var E=t.fullRequestInterceptor(m,e,f,g,o||{},d||{},this[t.restangularFields.httpConfig]||{}),b={};b=t.transformElem(b,!1,f,D);var I=function(r){var n=r.data,s=r.config.params,a=U(n,e,f,g,r,u);if(a){var i;"post"!==e||l[t.restangularFields.restangularCollection]?(i=F(l[t.restangularFields.parentResource],a,l[t.restangularFields.route],!0,null,s),i[t.restangularFields.singleOne]=l[t.restangularFields.singleOne],p(u,r,i,b)):(i=F(l[t.restangularFields.parentResource],a,f,!0,null,s),p(u,r,i,b))}else p(u,r,void 0,b)},R=function(r){304===r.status&&t.isSafe(e)?p(u,r,l,b):_.every(t.errorInterceptors,function(e){return e(r,u,I)!==!1})&&u.reject(r)},C=e,T=_.extend({},E.headers),y=t.isOverridenMethod(e);return y?(C="post",T=_.extend(T,{"X-HTTP-Method-Override":"remove"===e?"DELETE":e.toUpperCase()})):t.jsonp&&"get"===C&&(C="jsonp"),t.isSafe(e)?y?M.resource(this,r,E.httpConfig,T,E.params,s,v,C)[C]({}).then(I,R):M.resource(this,r,E.httpConfig,T,E.params,s,v,C)[C]().then(I,R):M.resource(this,r,E.httpConfig,T,E.params,s,v,C)[C](E.element).then(I,R),c(u.promise,!1,b)}function L(e,t){return _.bind(w,this)("get",void 0,e,void 0,t)}function P(e,t){return _.bind(w,this)("remove",void 0,e,void 0,t)}function x(e,t){return _.bind(w,this)("put",void 0,e,void 0,t)}function O(e,t,r,n){return _.bind(w,this)("post",e,r,t,n)}function S(e,t){return _.bind(w,this)("head",void 0,e,void 0,t)}function q(e,t){return _.bind(w,this)("trace",void 0,e,void 0,t)}function H(e,t){return _.bind(w,this)("options",void 0,e,void 0,t)}function z(e,t,r){return _.bind(w,this)("patch",void 0,t,e,r)}function j(e,t,r,n,s){return _.bind(w,this)(e,t,r,s,n)}function A(e,r,n,s,a,i){var o;o="getList"===r?_.bind(C,this,n):_.bind(j,this,r,n);var l=function(e,t,r){var n=_.defaults({params:e,headers:t,elem:r},{params:s,headers:a,elem:i});return o(n.params,n.headers,n.elem)};t.isSafe(r)?this[e]=l:this[e]=function(e,t,r){return l(t,r,e)}}function V(r){var n=angular.copy(_.omit(t,"configuration"));return e.init(n,n),r(n),s(n)}function G(e,r){var n=_.values(t.restangularFields),s={},a=(r||D).all(e);s.one=_.bind(i,r||D,r,e),s.post=_.bind(a.post,a),s.getList=_.bind(a.getList,a);for(var o in a)a.hasOwnProperty(o)&&_.isFunction(a[o])&&!_.includes(n,o)&&(s[o]=_.bind(a[o],a));return s}var D={},M=new t.urlCreatorFactory[t.urlCreator];return M.setConfig(t),e.init(D,t),D.copy=_.bind(v,D),D.service=_.bind(G,D),D.withConfig=_.bind(V,D),D.one=_.bind(i,D,null),D.all=_.bind(o,D,null),D.several=_.bind(l,D,null),D.oneUrl=_.bind(u,D,null),D.allUrl=_.bind(d,D,null),D.stripRestangular=_.bind(h,D),D.restangularizeElement=_.bind(F,D),D.restangularizeCollection=_.bind(b,D),D}return s(t)}]})}();
//# sourceMappingURL=map/restangular-da4e58139e.js.map
