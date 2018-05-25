require(['jquery', 'render', 'renderHeader', 'getReq', 'text!bookTb'], function($, render, renderHeader, getReq, bookTb) {
    $('body').append(bookTb);
    var fiction_id = getReq().fiction_id
    $.ajax({
        url: '/api/detail',
        dataType: 'json',
        data: {
            fiction_id: fiction_id
        },
        success: function(res) {
            renderDetail(res);
        },
        error: function(error) {
            console.warn(error)
        }
    })

    function renderDetail(res) {
        renderHeader({ title: res.item.title })
        render(res.item, $('#detail-template'), $('#detail'))
        render(res.item, $('#tag-template'), $('.type-tags'))
        var related = {
            data: res.related
        }
        render(related, $('#t-b-tpl'), $('#other-list'))
        render(res.item, $('#copyright-template'), $('.copyright'))
        $('.content').show();
        $('#start-btn').on('click', function() {
            window.location.href = '../../page/artical.html?fiction_id=' + fiction_id;
        })
    }
})