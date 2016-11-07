$(function () {


  function anonymousFn(data,tp) {
    var dataStr = function () {
      return tp.replace(/({{)(.*)(}})/g, function (match, $1, $2, $3) {
        var _$2 = $2.split('|');
        if (_$2.length > 1) {
          return dataStr[_$2[1].trim()].call(null, dataStr.eval(_$2[0]));
        }
        return dataStr.eval($2);
      });
    };
    dataStr.eval = function(a){
      return eval(a.trim());
    };
    dataStr.discount = function (a) {
      try {
        return parseInt(a) / 2
      }
      catch (e) {
        return a;
      }
    };
    return (new Function(
      'data',
      'dataStr',
      "return dataStr()"
    ))(data, dataStr)
  }

  function eachData(datas, table,tp) {
    var docf = $(document.createDocumentFragment());
    $.each(datas, function (key, data) {
      var str = anonymousFn.call(null, data,tp);
      docf.append($(str));
    });
    table.append(docf)
  }

  var content = [
    {
      table: $($.find('.taocan.list .freexf-home-table')),
      tp: $($.find('.discount-template')).html(),
      keys: [
        "25520hjskqn10", "25505rjskqn05", "25525hjskqn10", "25525rjskqn05", "25530rjskqn05", "25530hjskqn10"
      ].join(',')
    },
    {
      table: $($.find('.tongbu.list .freexf-home-table')),
      tp: $($.find('.common-template')).html(),
      keys: [
        "20520hjyw4s15", "20520rjyw4s05", "20525rjyw5s05", "20525hjyw5s10", "20530hjyw6s20", "20530rjyw6s15"
      ].join(',')
    },
    {
      table: $($.find('.tuozhan.list .freexf-home-table')),
      tp: $($.find('.common-template')).html(),
      keys: [
        "20545ywzsrj05", "21045sxzs15", "22555rjgeskw30", "22555hjgeskw40"
      ].join(',')
    }
  ];

  function getCourseList(keys, func) {
    var courseList = '/Entrace/Dispatch.aspx?FunctionName=Activity.GetCourse&Version=1&EndClientType=H5&Key=""&JsonPara={"CourseNum":"' + keys + '"}';

    $.ajax({
      type: 'Get',
      cache: 'false',
      url: courseList,
      dataType: "json",
      success: function (data) {
        func.call(null, data);
      }
    });
  }

  for (var i = 0; i < content.length; i++) {
    var con = content[i];
    (function (con) {
      getCourseList.call(null, con.keys, function (data) {
        eachData.call(null, data, con.table,con.tp);
      })
    })(con);
  }
});
