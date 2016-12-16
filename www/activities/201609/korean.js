$(function () {
    $('.new_korean').css('font-size', $('body').width() / 38);
    var returnHeight = $('.return .text').height();
    $('.process-text .text').each(function () {
        $(this).height(returnHeight);
    })

    $('.meteyard-content').each(function () {
        var textHeight = $(this).find('.meteyard-text').outerHeight();
        $(this).find('.meteyard-num').height(textHeight);
        $(this).find('.meteyard-num').css('line-height', textHeight + 'px');
    })

    $('.course-img-left').each(function () {
        var imgWidth = $(this).find('.course-img').width();
        $(this).find('.course-msg').height(imgWidth);
    })

    $('.course-img-right').each(function () {
        var imgWidth = $(this).find('.course-img').width();
        $(this).find('.course-msg').height(imgWidth);
    })

    var teacherurl = '/entrace/Dispatch.aspx?EndClientType=PC&FunctionName=Student.%E6%95%99%E5%B8%88%E5%88%97%E8%A1%A8&JsonPara=%7B%22Second%22:%22%e5%a4%9a%e8%af%ad%e7%a7%8d%2f%e9%9f%a9%e8%af%ad%22%7D&Version=1';
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