define(['jquery', 'render', 'text!header'], function($, render, header) {
    function renderHeader(data) {
        $('body').append(header);
        render(data, $('#header-tpl'), $('.render-header'));
        $('.icon-back').on('click', function() {
            history.go(-1);
        })
    }
    return renderHeader
})