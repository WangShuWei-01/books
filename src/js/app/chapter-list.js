require(['jquery', 'render', 'renderHeader', 'getReq', 'bscroll'], function($, render, header, getReq, bscroll) {
    header({ title: '目录' });

    var fiction_id = getReq().fiction_id;
    var chapter_id = getReq().chapter_id;

    $.ajax({
        url: '/api/chapter',
        dataType: 'json',
        data: {
            fiction_id: fiction_id
        },
        success: function(res) {
            console.log(res);
            render(res.item.toc, $('#chapter-template'), $('.chapter-list'));
            var scroll = new bscroll('.chapter-wrap');
            var target;
            if (chapter_id) {
                target = chapter_id;
            } else {
                target = res.item.toc.length - 1;
                console.log(target)
            }
            scroll.scrollToElement($('.chapter-list li').eq(target)[0]);
            $('.chapter-list li').eq(target).addClass('active');
        },
        error: function(error) {
            console.warn(error)
        }
    })
})