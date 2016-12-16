$(function () {
    $('.spanish').css('font-size', $('body').width() / 35);
    var returnHeight = $('.return .text').height();
    $('.process-text .text').each(function () {
        $(this).height(returnHeight);
    })

    $('.system-content').each(function () {
        var textHeight = $(this).find('.system-text').outerHeight();
        $(this).find('.img').height(textHeight);
        $(this).find('.img').css('line-height', textHeight + 'px');
    })

    $('.course-img-left').each(function () {
        var imgWidth = $(this).find('.course-img').width();
        $(this).find('.course-msg').height(imgWidth);
    })

    var teacherurl = '/entrace/Dispatch.aspx?EndClientType=PC&FunctionName=Student.%E6%95%99%E5%B8%88%E5%88%97%E8%A1%A8&JsonPara=%7B%22Second%22:%22%e5%a4%9a%e8%af%ad%e7%a7%8d%2f%e8%a5%bf%e7%8f%ad%e7%89%99%e8%af%ad%22%7D&Version=1';
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
        var sigboxWidth = (teaConWidth - 25) / 3;

        $(data).each(function (i) {
            var sigbox = $('<div class="sigbox" id="teacher' + i + '"></div>').appendTo($('.teacher-content'));
            var pic = $('<div class="pic"></div>').appendTo(sigbox);
            var teaImg = $('<img src="' + this.Image + '" />').appendTo(pic);
            var teaSpan = $('<span></span>').text(this.Name).appendTo(sigbox);
            sigbox.css({ 'width': sigboxWidth + 'px' });
            teaImg.css({ 'width': sigboxWidth * 0.9 + 'px', 'height': sigboxWidth * 0.9 + 'px' });
        })
    }
})