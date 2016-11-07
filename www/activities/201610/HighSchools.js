$(function () {
    var courseList = '/Entrace/Dispatch.aspx?FunctionName=Activity.GetCourseGroupList&Version=1&EndClientType=H5&Key=%22%22&JsonPara={}';
    $.ajax({
        type: 'Get',
        cache: 'false',
        url: courseList,
        dataType: "json",
        success: function (data) {
            sortCourse(data.CourseList6, '.zhongkao');
            sortCourse(data.CourseList8, '.gaokao');
            showCourse('.zhongkao', '中考');
            showCourse('.gaokao', '高考');
        }
    });

    function showCourse(cobj, ctxt) {
        var $moreCourse1 = $(cobj).find('.course-tab .freexf-col').eq(4);
        var $moreCourse2 = $(cobj).find('.course-tab .freexf-col').eq(5);
        $moreCourse1.hide();
        $moreCourse2.hide();
        $(cobj).find('.list-button.more').click(function () {
            if (this.innerHTML == "点击获取更多" + ctxt + "课程") {
                $(this).html("点击收起");
                $moreCourse1.show();
                $moreCourse2.show();
            } else {
                $(this).html("点击获取更多" + ctxt + "课程");
                $moreCourse1.hide();
                $moreCourse2.hide();
            }
        })
    }
    
    function sortCourse(data, obj) {
        $(obj).find('.freexf-course-table .course-tab').html("");
        for (i = 0; i < data.length; i++) {
            $(obj).find('.freexf-course-table .course-tab').append($('.discount-template').html());
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('a').attr('href', '/mobile/www/index.aspx#/coursedetail/' + data[i].ProductId + '&');
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('img').attr('src', data[i].Image);
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('.ti').html(data[i].ProductName);
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('.xufen').html(data[i].Price);
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('.zhekou').html(data[i].ActivityDiscountToTalFree + '学分');
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('.keshi').html(data[i].Hour);
        }        
    }

    function zxsortCourse(data, obj) {
        $(obj).find('.freexf-course-table .course-tab').html("");
        for (i = 0; i < data.length; i++) {
            $(obj).find('.freexf-course-table .course-tab').append($('.common-template').html());
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('a').attr('href', '/mobile/www/index.aspx#/coursedetail/' + data[i].ProductId + '&');
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('img').attr('src', data[i].Image);
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('.ti').html(data[i].ProductName);
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('.xufen').html(data[i].Price);
            $(obj).find('.freexf-course-table .course-tab .freexf-col').eq(i).find('.keshi').html(data[i].Hour);
        }
    }

    function getCourseList(category) {
        var courseList = '/Entrace/Dispatch.aspx?FunctionName=Student.GetCourseListNew2&Version=1&EndClientType=H5&Key=""&JsonPara={ "Category": "中小学","Second": "","Thirdly": "' + category + '","CoursesTypes": "xueqitongbu","OrderBy": "zonghe","Order": "desc","PageIndex": 0,"PageMax": 6}';
        $.ajax({
            type: 'Get',
            cache: 'false',
            url: courseList,
            dataType: "json",
            success: function (data) {
                zxsortCourse(data, '.termCourse');
                $('.termCourse .list-button.more').attr('href', '/mobile/www/index.aspx#/courseplate/中小学&&' + category + '&学期同步');
                $('.termCourse .list-button.more').html('点击获取更多' + category + '同步课程');
            }
        });
    }
    
    getCourseList('七年级');

    var $div_li = $('.termCourse .course-nav ul li');
    $div_li.click(function () {
        var text = $(this).text();
        $(this).addClass("on").siblings().removeClass("on");
        getCourseList(text);
    });

    var teacherurl = '/entrace/Dispatch.aspx?EndClientType=PC&FunctionName=Student.%E6%95%99%E5%B8%88%E5%88%97%E8%A1%A8&JsonPara=%7B%22Second%22:%22%E4%B8%AD%E5%B0%8F%E5%AD%A6%22%7D&Version=1';
    $.ajax({
        type: 'POST',
        cache: 'false',
        url: teacherurl,
        dataType: "json",
        success: function (data) {
            showTeacher(data)
        }
    });

    function showTeacher(data) {
        var teaCon = $('.teacher-content');
        var teaConWidth = teaCon.css('width').split('px')[0];
        var sigboxWidth = (teaConWidth - 24) / 3.5;

        $(data).each(function (i) {
            var sigbox = $('<div class="sigbox" id="teacher' + i + '"></div>').appendTo($('.teacher-content'));
            var pic = $('<div class="pic"></div>').appendTo(sigbox);
            var teaImg = $('<img src="' + this.Image + '" />').appendTo(pic);
            var teaSpan = $('<span></span>').text(this.Name + '老师').appendTo(sigbox);
            sigbox.css({ 'width': sigboxWidth + 'px' });
            pic.css({ 'width': sigboxWidth * 0.9 + 'px', 'height': sigboxWidth * 0.9 + 'px' });
        })
    }       
});
