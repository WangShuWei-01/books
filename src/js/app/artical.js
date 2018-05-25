require(['jquery', 'render', 'storage', 'getReq', 'base64', 'jsonp'], function($, render, storage, getReq, base64, jsonp) {
    var _articalcon = $('.artical-con');

    var fiction_id = getReq().fiction_id;

    var islight = true;
    var nightBg = '#0f1410';
    var chooseBg = storage.get('bg') || '#f7eee5';
    var chapter_id = storage.get('chapter_id') || 1;

    $('.cur-chapter').html(chapter_id);

    if (storage.get('tag') && storage.get('tag') != '夜间') {
        islight = false;
    }

    if (islight) {
        _articalcon.css('background', chooseBg);
        $('.set-bg-btns li[bg-color=' + chooseBg + ']').addClass('active').siblings().removeClass('active');

    } else {
        _articalcon.css('background', nightBg);
        $('.set-bg-btns li[bg-color=' + chooseBg + ']').addClass('active').siblings().removeClass('active');
    }

    _articalcon.show();

    $.ajax({
        url: '/api/chapter',
        dataType: 'json',
        data: {
            fiction_id: fiction_id
        },
        success: function(res) {
            $('.total-chapter').html(res.item.toc.length)
        },
        error: function(error) {
            console.warn(error)
        }
    })

    getArtical()

    function getArtical() {
        $('.artical-con').scrollTop(0);
        $.ajax({
            url: '/api/artical',
            dataType: 'json',
            data: {
                fiction_id: fiction_id,
                chapter_id: chapter_id
            },
            success: function(res) {
                jsonp({
                    url: res.url,
                    callback: 'duokan_fiction_chapter',
                    cache: true,
                    success: function(data) {
                        var articalcon = JSON.parse($.base64.atob(data, true));
                        render(articalcon, $('#artical'), $('.artical-con'), true)
                    }
                })
            },
            error: function(error) {
                console.warn(error)
            }
        })
    }


    $('.pre-btn').on('click', function() {
        if (chapter_id > 1) {
            chapter_id -= 1;
            $('.cur-chapter').html(chapter_id);
            getArtical();
            storage.set('chapter_id', chapter_id)
        } else {
            alert('到头了')
        }
    })

    $('.next-btn').on('click', function() {
        if (chapter_id < 5) {
            chapter_id += 1;
            $('.cur-chapter').html(chapter_id);
            getArtical();
            storage.set('chapter_id', chapter_id)
        } else {
            alert('到尾了')
        }
    })

    _articalcon.on('click', function() {
        $('.set-wrap').show();
    })

    $('.mask').on('click', function() {
        $('.set-wrap').hide();
        $('.set-panel').hide();
        $('.size').removeClass('active');
    })

    $('.icon-circle-back').on('click', function() {
        history.go(-1);
    })

    $('.chapter-btn').on('click', function() {
        window.location.href = '../../page/chapter-list.html?fiction_id=' + fiction_id + '&chapter_id=' + chapter_id;
    })

    $('.size').on('click', function() {
        $('.set-panel').toggle();
        $(this).toggleClass('active');
    })

    $('.day').on('click', function() {
        $(this).toggleClass('light');

        if (islight) {
            $(this).find('dd').text('白天');
            _articalcon.css('background', nightBg);
        } else {
            $(this).find('dd').text('夜间');
            _articalcon.css('background', chooseBg);
        }
        islight = !islight;
        var tag = islight ? '夜间' : '白天';
        storage.set('tag', tag)
    })

    var initSize = storage.get('fz') || 14;
    var maxSize = 28;
    var minSize = 12;
    $('.artical-con p').css('font-size', initSize / 37.5 + 'rem');

    $('.large-btn').on('click', function() {
        if (initSize < maxSize) {
            initSize += 2;
            storage.set('fz', initSize)
        }
        $('.artical-con p').css('font-size', initSize / 37.5 + 'rem');
    })

    $('.small-btn').on('click', function() {
        if (initSize > minSize) {
            initSize -= 2;
            storage.set('fz', initSize)
        }
        $('.artical-con p').css('font-size', initSize / 37.5 + 'rem');
    })

    $(".set-bg-btns").on('click', 'li', function() {
        $(this).addClass('active').siblings().removeClass('active');
        chooseBg = $(this).attr('bg-color');
        storage.set('bg', chooseBg)
        if (islight) {
            _articalcon.css('background', chooseBg);
        }
    })
})