//require配制主要js，并启动路由。
//定义主要js路径

'use strict';
autoChange();

//CND路径
var pathsFreexf = {
	//配置js路径
	paths: {
		ionic: 'http://css.freexf.com/h5/bundle/freexf-b4a1e2feed.bundle' //webapp前端框架
			/*    oclazyload: 'http://css.freexf.com/h5/oclazyload/dist/ocLazyLoad',//按需加载
			    imglazyload: 'http://css.freexf.com/h5/ionic-image-lazy-load/ionic-image-lazy-load',//图片懒加载
			    restAngular: 'http://css.freexf.com/h5/restangular/dist/restangular.min',//ajax
			    angularSanitize: 'http://css.freexf.com/h5/ionic/js/angular/angular-sanitize.min',
			    localStorage: 'http://css.freexf.com/h5/angular-local-storage/dist/angular-local-storage.min',//
			    jq: 'http://css.freexf.com/h5/jquery/dist/jquery.min',
			    lodash: 'http://css.freexf.com/h5/lodash/dist/lodash.min',//
			    qrcode: 'http://css.freexf.com/h5/qrcode/jquery.qrcode.min',
			    base64: 'http://css.freexf.com/h5/base64/base64'*/

	},
	shim: {
		//注入服务至ionic
		/*    'oclazyload': ['ionic'],
		    'imglazyload': ['ionic'],
		    'restAngular': ['ionic'],
		    'angularSanitize': ['ionic'],
		    'localStorage': ['ionic'],*/
		'services': ['ionic', 'app']
			/*    'qrcode': ['ionic'],
			    'base64': ['ionic']*/
	}
};

//本地路径
var paths = {
	//配置js路径
	paths: {
		ionic: 'dist/js/lib/concat/freexf-b4a1e2feed.bundle' //webapp前端框架
			/*   oclazyload: 'lib/oclazyload/dist/ocLazyLoad',//按需加载
			 imglazyload: 'lib/ionic-image-lazy-load/ionic-image-lazy-load',//图片懒加载
			 restAngular: 'lib/restangular/dist/restangular.min',//ajax
			 angularSanitize: 'lib/ionic/js/angular/angular-sanitize.min',
			 localStorage: 'lib/angular-local-storage/dist/angular-local-storage.min',//
			 jq: 'lib/jquery/dist/jquery.min',
			 lodash: 'lib/lodash/dist/lodash.min',//
			 qrcode: 'lib/qrcode/jquery.qrcode.min',
			 base64: 'lib/base64/base64'*/

	},
	shim: {
		'services': ['ionic', 'app']
	}
};

require.config(pathsFreexf);

require([
	'ionic',
	'app',
	'services'
], function() {
	tuiGuang();
	testViewport();
	totop(window);
	ionic.Platform.ready(function() {
		//启动angular模块
		angular.bootstrap(document, ['freexf']);
	});
	$(function() {
		$('body').on('click', '.button-clear.freexf-consult', function() {
			$('.udeskfun').eq(0).trigger("click");
		})
	})
});

function tuiGuang() {
	if(typeof(window.location.href.split('?s=')[1]) != 'undefined') {
		var tuiGuangId = window.location.href.split('?s=')[1];
		var tuiGuangId = tuiGuangId.split('ends')[0];
		setCookie("tuiGuangId", tuiGuangId, 1, "/")
	};
};

function getCookieValue(name) {
	var name = escape(name);
	var allcookies = document.cookie;
	name += "=";
	var pos = allcookies.indexOf(name);
	if(pos != -1) {
		var start = pos + name.length;
		var end = allcookies.indexOf(";", start);
		if(end == -1) end = allcookies.length;
		var value = allcookies.substring(start, end);
		return unescape(value);
	} else return "";
}

function setCookie(name, value, hours, path) {
	var name = escape(name);
	var value = escape(value);
	var expires = new Date();
	expires.setTime(expires.getTime() + hours * 3600000 * 24);
	path = path == "" ? "" : ";path=" + path;
	expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
	document.cookie = name + "=" + value + expires + path;
};

function deleteCookie(name, path) {
	var name = escape(name);
	var expires = new Date(0);
	path = path == "" ? "" : ";path=" + path;
	document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
};
function connectWebViewJavascriptBridge(callback) {
			if(window.WebViewJavascriptBridge) {
				callback(WebViewJavascriptBridge)

			} else {
				document.addEventListener(
					'WebViewJavascriptBridgeReady',
					function() {
						callback(WebViewJavascriptBridge)
					},
					false

				);
			}
		}


function autoChange() {
	//手机端自动跳转
	var phoneVideo = function() {
			if(navigator.userAgent.match(/(iPhone|iPod|webOS|Android)/i)) {
				return 'mb';
			} else if(navigator.userAgent.match(/(iPad)/i)) {
				return 'ipad';
			} else {
				return 'pc';
			}
		}
		//url对应    =
	var mobileurlIDarr = ['/home', '/courseplate/%E8%8B%B1%E8%AF%AD&',
		'/courseplate/%E4%B8%AD%E5%B0%8F%E5%AD%A6&', '/courseplate/%E5%A4%9A%E8%AF%AD%E7%A7%8D&', '/courseplate/%E4%BC%9A%E8%AE%A1%E8%81%8C%E4%B8%9A&', '/courseplate/%E8%80%83%E7%A0%94&', '/courseplate/%E5%85%B4%E8%B6%A3&', '/member',
		'/mycourse', '/course', '/myorder', '/mycollection', '/modifypassword'
	]

	var ipadUrlArr = ['/home', '/courseplate/%E8%8B%B1%E8%AF%AD&',
		'/courseplate/%E4%B8%AD%E5%B0%8F%E5%AD%A6&', '/courseplate/%E5%A4%9A%E8%AF%AD%E7%A7%8D&', '/courseplate/%E4%BC%9A%E8%AE%A1%E8%81%8C%E4%B8%9A&', '/courseplate/%E8%80%83%E7%A0%94&', '/courseplate/%E5%85%B4%E8%B6%A3&', '/myaccount',
		'/myaccount/mycourse', '/course', '/myaccount/myorder', '/myaccount/mycollection', ''
	]

	var ipadchangeurl = function(ipadurl) {
			if(phoneVideo() == 'ipad') {
				if(domainname != 'm.freexf.com') {
					window.location.href = "http://" + domainname + "/mobile/www_ipad/index.aspx#" + ipadurl
				} else {
					window.location.href = "http://" + "m.freexf.com" + "/mobile/www_ipad/index.aspx#" + ipadurl
				}

			}
		}
		//初始化url变量
	var nowurl = window.location.href;
	var mobileurlID = nowurl.split('#')[1];
	var goalsplit = nowurl.replace("http://", "");
	var goalurl = goalsplit.substr(goalsplit.indexOf("/"), goalsplit.length);
	var domainname = goalsplit.substr(0, goalsplit.indexOf("/"));
	if(mobileurlID == undefined) {
		mobileurlID = '/home';
	}
	if(nowurl.indexOf('/coursedetail/') > -1) {
		var courseurlID = nowurl.slice(nowurl.lastIndexOf('/') + 1, nowurl.lastIndexOf('&'));
		var courseurl = "/courses/detail/index-" + courseurlID
	} else {
		var isGoHome = true;
		for(var i = 0; i < mobileurlIDarr.length; i++) {
			if(mobileurlID == mobileurlIDarr[i]) {
				ipadchangeurl(ipadUrlArr[i]);
				var isGoHome = false;
			}
			if(i == mobileurlIDarr.length - 1 || isGoHome == true) {
				ipadchangeurl(ipadUrlArr[0]);
			}

		}
	}

}

function testViewport() {
	//var mvp = $('meta[name="viewport"]').get(0);
	var docW = document.documentElement.clientWidth;
	//var devicewidth = 'device-width';
	var docWhtml = docW / 375;
	if(docWhtml <= 1 && docWhtml >= 0.85) {
		$('html').css('font-size', docWhtml + 'px')
	} else if(docWhtml <= 0.85) {
		$('html').css('font-size', '0.85px')
	}
	var docWviewport, tvp;
}

function totop(win) {
	var doc = win.document;

	// If there's a hash, or addEventListener is undefined, stop here
	if(win.addEventListener) {
		//scroll to 1
		window.scrollTo(0, 1);
		var scrollTop = 1,
			getScrollTop = function() {
				return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
			},
			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function() {
				if(doc.body) {
					clearInterval(bodycheck);
					scrollTop = getScrollTop();
					win.scrollTo(0, scrollTop === 1 ? 0 : 1);
				}
			}, 15);
		win.addEventListener("load", function() {
			setTimeout(function() {
				//reset to hide addr bar at onload
				win.scrollTo(0, scrollTop === 1 ? 0 : 1);
			}, 0);
		});
	}
}