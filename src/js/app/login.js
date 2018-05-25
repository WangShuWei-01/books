require(['jquery', 'storage'], function($, storage) {
    $('#sub-btn').on('click', function() {
        var username = $('#user').val();
        var pwd = $('#pwd').val();
        var tip;

        if (!$.trim(username)) {
            tip = '用户名为空';
        } else if (!$.trim(pwd)) {
            tip = '密码为空';
        }

        if (tip) {
            $('.tip').html(tip)
        } else {
            sub()
        }

        function sub() {
            $.ajax({
                url: '/login',
                dataType: 'json',
                type: 'post',
                data: {
                    username: username,
                    pwd: pwd
                },
                success: function(res) {
                    storage.set('username', username)
                    history.go(-1);
                },
                error: function(error) {
                    console.warn(error)
                }
            })
        }
    })
})