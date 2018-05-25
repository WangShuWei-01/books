require(['jquery', 'renderHeader', 'storage', 'render', 'text!searchTpl'], function($, renderHeader, storage, render, searchTpl) {
    renderHeader({ isSearch: true });

    var searchHistory = storage.get('history') || [];
    render(searchHistory, $('#tag-tpl'), $('.type-tags'), true)

    $('body').append(searchTpl);

    var _searchList = $('.search-list');

    $('.search-btn').on('click', function() {
        var val = $('.ipt').val();
        $('.type-tags').hide();
        _searchList.show();
        if (!val) {
            _searchList.html('<p>输入内容为空</p>')
        } else {
            search(val);
            var searchHistory = storage.get('history') || [];
            if (searchHistory.indexOf(val) == -1) {
                searchHistory.push(val)
                storage.set("history", searchHistory);
            }
        }
    })

    function search(val) {
        $.ajax({
            url: '/api/search',
            dataType: 'json',
            data: {
                key: val
            },
            success: function(res) {
                if (!res) {
                    _searchList.html('<p>暂无搜索内容</p>');
                } else {
                    _searchList.html('');
                    render(res.items, $('#search-template'), _searchList)
                }
            },
            error: function(error) {
                console.warn(error)
            }
        });
    }

    $('.ipt').on('input', function() {
        var val = $(this).val();

        if (!val) {
            $('.type-tags').show();
            _searchList.hide();
            _searchList.html('');
            var searchHistory = storage.get('history') || [];
            render(searchHistory, $('#tag-tpl'), $('.type-tags'), true)
        }
    })

    $('.type-tags').on('click', 'li', function() {
        var key = $(this).text();
        search(key);
        $('.ipt').val(key);
        $('.type-tags').hide();
        _searchList.show();
    })
})