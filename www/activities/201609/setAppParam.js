function getParam(search) {
  var search = search.indexOf('?') >= 0 ? search.slice(1) : search;
  var sary = search.split('&');
  var newsearch = {};
  for (var i = 0; i < sary.length; i++) {
    var newsary = sary[i].split('=');
    newsearch[newsary[0]] = newsary.length > 1 ? newsary[1] : null;
  }
  return newsearch;
}

var isapp = 'app' in getParam(location.search);


function $ToDetailState() {
  function toState() {
    this.app = this.getParam.call(this);
    this.map = {
      coursedetail: this.app ? 'course' : 'coursedetail',
      courseplate: this.app ? 'course_list' : 'courseplate',
      telephone: this.app ? 'tele' : 'telephone',
      register: this.app ? 'register' : 'register',
      Category1: 'Category1',
      Category2: 'Category2',
      Category3: 'Category3',
      Category4: 'Category4'
    };
    this.go = this.connect.call(this);
  }

  toState.prototype = {
    getParam: function () {
      return 'app' in getParam(location.search) ? getParam(location.search)['app'] : null
    },
    _GON: Object.getOwnPropertyNames,
    initParam: function (state, data) {
      var newdata = {};
      var obj = {
        coursedetail: function (data) {
          return this.app ? data[this._GON(data)[0]] : encodeURIComponent(data[this._GON(data)[0]]) + '&';
        },
        telephone: function (data) {
          return data[this._GON(data)[0]]
        },
        //app搜索列表参数处理
        courseplate: function () {
          var type = [], param = [], Category = 'Category', QuanBu = this.app ? '全部' : null;
          for (var i = 1; i <= 4; i++) {
            if (Category + i in data) {
              param.push(data[Category + i])
            } else {
              param.push(QuanBu);
            }
          }
          return this.app ? param.join('-') : encodeURIComponent(param.join('&'));
        }
      };
      if(this.app){
        if (state && data) {
          newdata = {type: this.map[state], param: obj[state].call(this, data)};
        } else {
          newdata = {type: state, param: null};
        }
        newdata = JSON.stringify(newdata)
      }else{
        newdata = obj[state].call(this, data);
      }

      return newdata;
    },
    goState: function (state, data) {
      if (state && state == 'telephone') {
          location.href = "tel:400-686-5511";
        return;
      }
      location.href = '/mobile/www/index.aspx#/' + state + (data ? ('/' + this.initParam(state, data)) : '');
    },
    goApp: function (state, data) {
      var newdata = this.initParam(state, data);
      try {
        if (this.app.toString() === '1') {
          Android.onSubmit(newdata);
        } else {
          window.webkit.messageHandlers.onSubmit.postMessage(newdata);
        }
      } catch (e) {
      }

    },
    connect: function () {
      if (!this.app) {
        return this.goState.bind(this);
      } else {
        return this.goApp.bind(this);
      }
    }
  };
  var a = new toState();
  return {
    go: a.go
  }
}

var appObj = $ToDetailState();

function goDetail(id) {
  appObj.go('coursedetail', {courseId: id});
}
function goList(param) {
  appObj.go('courseplate', param);
}
function goregister() {
  appObj.go('register');
}
function gotele() {
    appObj.go('telephone', { telephone: '400-686-5511' });
}
