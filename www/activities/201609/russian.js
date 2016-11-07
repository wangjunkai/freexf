$(function () {
    var teacherurl = '/entrace/Dispatch.aspx?EndClientType=H5&FunctionName=Student.%E6%95%99%E5%B8%88%E5%88%97%E8%A1%A8&JsonPara=%7B%22Second%22:%22%E5%A4%9A%E8%AF%AD%E7%A7%8D%2F%E4%BF%84%E8%AF%AD%22%7D&Version=1';
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
})
