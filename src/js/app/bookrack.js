require(['jquery', 'render'], function($, render) {
    $.ajax({
        url: '/api/bookrack',
        dataType: 'json',
        success: function(res) {
            console.log(res);
            render(res, $("#bookrack"), $(".shelf-list"));
        },
        error: function(error) {
            console.warn(error)
        }
    })
})