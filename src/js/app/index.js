require(['jquery', 'swiper', 'bscroll', 'render', 'text!bookTb', 'text!bookLr', 'GetSlideDirection'], function($, swiper, bscroll, render, bookTb, bookLr, GetSlideDirection) {
    //初始化最外层swiper
    var citySwiper = new swiper(".city-swiper", {
        on: {
            slideChangeTransitionStart: function() {
                var index = this.activeIndex;
                if (index == 1) {
                    $('.line').addClass('move');
                } else {
                    $('.line').removeClass('move');
                }
                $('.tab-item').eq(index).addClass('active').siblings().removeClass('active');
            },
        },
    })

    //滑动处理  
    var startX, startY;
    document.addEventListener('touchstart', function(ev) {
        startX = ev.touches[0].pageX;
        startY = ev.touches[0].pageY;
    }, false);
    document.addEventListener('touchend', function(ev) {
        var endX, endY;
        endX = ev.changedTouches[0].pageX;
        endY = ev.changedTouches[0].pageY;
        var direction = GetSlideDirection(startX, startY, endX, endY);
        switch (direction) {
            case 3:
                citySwiper.slideTo(1);
                break;
            case 4:
                citySwiper.slideTo(0);
                break;
            default:
        }
    }, false);

    var cityScroll = new bscroll(".city-scroll", {
        probeType: 2,
        click: true
    })

    var _parent = $(".city-scroll>div");

    var htmlFz = $("html").css("fontSize");

    var realSize = parseFloat(htmlFz) * 44 / 37.5;

    //上拉加载的相关参数
    var pageNum = 1, //默认加载第一页
        total, //总页数
        count = 10, //每页数据的条数
        upLoadTip = "上拉加载",
        refreshTip = "下拉刷新",
        rebaseMore = "释放加载更多",
        rebaseRefresh = "释放刷新",
        endTip = "我是有底线的";

    cityScroll.on("scroll", function() {
        if (this.y < this.maxScrollY - realSize) {
            if (pageNum > total) {
                _parent.attr("up", endTip);
            } else {
                _parent.attr("up", rebaseMore)
            }

        } else if (this.y < this.maxScrollY - realSize / 2) {
            if (pageNum > total) {
                _parent.attr("up", endTip);
            } else {
                _parent.attr("up", upLoadTip)
            }
        } else if (this.y > realSize) {
            _parent.attr("down", rebaseRefresh)
        } else if (this.y > realSize / 2 && this.y < realSize) {
            _parent.attr("down", refreshTip)
        }
    })

    cityScroll.on("scrollEnd", function() {
        if (pageNum > total) {
            _parent.attr("up", endTip);
        } else {
            _parent.attr("up", upLoadTip);
        }

        _parent.attr("down", refreshTip);
    })

    cityScroll.on("touchEnd", function() {
        if (_parent.attr("up") === rebaseMore) {
            console.log("上拉加载");
            if (pageNum > total) {
                return false
            } else {
                loadMore(pageNum);
                pageNum++;
            }
        }
        if (_parent.attr("down") === rebaseRefresh) {
            console.log("下拉刷新")
            window.location.reload();
        }
    })

    function loadMore(pageNum) {
        $.ajax({
            url: '/api/recommend',
            dataType: 'json',
            data: {
                pageNum: pageNum,
                count: count
            },
            success: function(res) {
                console.log(res);
                total = res.total / count;
                render(res.items, $("#l-r-tpl"), $("#load-more"));
                cityScroll.refresh();
            },
            error: function(error) {
                console.warn(error)
            }
        })
    }

    $(".tab-item").on("click", function() {
        var index = $(this).index();

        citySwiper.slideTo(index);

        if (index == 1) {
            $(".line").addClass("move");
        } else {
            $(".line").removeClass("move");
        }

        $(this).addClass("active").siblings().removeClass("active");
    })

    //初始化页面
    function initPage() {
        $("body").append(bookTb);
        $("body").append(bookLr);

        //请求数据
        $.ajax({
            url: '/api/index',
            dataType: 'json',
            success: function(res) {
                //轮播图
                var bannerData = res.items[0].data;
                //本周最火
                var hotData = res.items[1].data;
                //重磅推荐
                var recommendData = res.items[2].data.data;
                recommendData[0].isShowNum = true;

                var firstData = [recommendData[0]];
                //渲染轮播图
                render(bannerData, $("#slide-tpl"), $(".banner"));
                //本周最火
                render(hotData, $("#t-b-tpl"), $("#hot"));
                //重磅推荐
                render(firstData, $("#l-r-tpl"), $("#first-item"));
                render(recommendData.slice(1), $("#recommed-list-tpl"), $("#not-first"))

                initBannerSwiper()
            },
            error: function(error) {
                console.warn(error)
            }
        })
    }

    function initBannerSwiper() {
        var bannerSwiper = new swiper(".banner-swiper", {
            autoplay: true,
            loop: true
        })
    }

    $('.switch-shelf').on('click', function() {
        if ($(this).attr('class') == 'switch-shelf') {
            $(this).removeClass('switch-shelf').addClass('switch-shelf-list')
        } else {
            $(this).removeClass('switch-shelf-list').addClass('switch-shelf')
        }
        $('.shelf-list').toggleClass('list-type')
    })

    initPage()
})