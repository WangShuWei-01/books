require(['jquery', 'render', 'renderHeader', 'getReq', 'text!bookTb', 'storage'], function($, render, renderHeader, getReq, bookTb, storage) {
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
            isLogin();
        })
    }

    function isLogin() {
        var username = storage.get('username') || '';
        if (!username) {
            location.href = '../../page/login.html';
        } else {
            $.ajax({
                url: "/isLogin",
                type: "post",
                dataType: "json",
                data: {
                    username: username
                },
                success: function(res) {
                    console.log(res)
                    if (res.code == 1 && res.result) {
                        window.location.href = '../../page/artical.html?fiction_id=' + fiction_id;
                    } else if ((res.code == 1 && !res.result) || res.code == 2) {
                        location.href = '../../page/login.html';
                    }
                },
                error: function(error) {
                    console.warn(error)
                }
            });
        }
    }
})