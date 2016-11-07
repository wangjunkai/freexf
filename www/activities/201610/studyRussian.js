$(function () {
    getTeacher("多语种/俄语");
    //var key = ['31505eytk45', '31505eytk40', '31505eytk35', '31505eytk30'];
    getCourse(['31505eytk45', '31505eytk40', '31505eytk35', '31505eytk30']);
    function getCourse(keys) {
        var courseListUrl = '/Entrace/Dispatch.aspx?FunctionName=Activity.GetCourse&Version=1&EndClientType=H5&Key=""&JsonPara={"CourseNum":"' + keys + '"}';
        $.ajax({
            type: 'POST',
            cache: 'false',
            url: courseListUrl,
            dataType: "json",
            success: function (data) {
                var bigBox = $('.list .top');                
                var bightml = '<img src="' + data[0].Image + '" onClick="location.href=\'/mobile/www/index.aspx#/coursedetail/' + data[0].ProductId + '&\'"/>'
                            + '<p>' + data[0].ProductName + '</p>'
                            + '<p><i>' + data[0].Price + '</i>学分<i class="right">' + data[0].Hour + '</i>课时</p>';
                bigBox.html(bightml);
                var smBox = $('.list .bottom');
                var smhtml = "";
                smBox.html("");
                for (var i = 1; i < data.length-1; i++) {
                    smhtml = '<li onClick="location.href=\'/mobile/www/index.aspx#/coursedetail/' + data[i].ProductId + '&\'">'
                            + '<img src="' + data[i].Image + '"/>'
                            + '<p>' + data[i].ProductName + '</p>'
                            + '<p><i>' + data[i].Price + '</i>学分  <i class="right">' + data[i].Hour + '</i>课时</p>'
                            + '</li>';
                    smBox.append(smhtml);
                }
                
            }
        });
    }

    function getTeacher(str) {
        var teacherListUrl = '/Entrace/Dispatch.aspx?FunctionName=Student.%E6%95%99%E5%B8%88%E5%88%97%E8%A1%A8&Version=1&EndClientType=H5&Key=""&JsonPara={"Second":"'+str+'"}';
        $.ajax({
            type: 'POST',
            cache: 'false',
            url: teacherListUrl,
            dataType: "json",
            success: function (data) {
                var teacherList = data;
                var teacherListBox = $('.teacher-list ul');
                var html="";                
                for (var i = 0; i < teacherList.length; i++) {
                    html+='<li>'
                        + '<img src="' + teacherList[i].Image + '"/>'
                        + '<p>' + teacherList[i].Name + '</p>'
                        +'</li>'
                }
                teacherListBox.html(html);
            }
        });
    }
});
