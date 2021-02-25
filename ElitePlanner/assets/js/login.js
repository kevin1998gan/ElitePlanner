login = function () {
    this.init();
};

login.prototype = {
    init: function () {
        this.initEvents();
    },

    initEvents: function () {
        var that = this;


        $('#onLogin').off("click").on("click", function () {
            var email_input = document.getElementById("InputEmail");
            var email = $('#InputEmail').val();
            var email_message = "";
            var email_regex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
            var password = $('#InputPassword').val();

            if (email === "") {
                email_message = "Please fill this up!"
            } else if (!email.match(email_regex)) {
                email_message = "Please use correct email format"
            } else {
                $.ajax({
                    url: 'assets/heroku/login.php',
                    data: {
                        in_email: email,
                        in_password: password,

                    },
                    type: 'POST',
                }).done(function (resp) {
                    console.log(resp);
                    ds = JSON.parse(resp);
                    console.log(ds);
                    if (ds == null) {
                        $("#login_warning").removeClass("d-none");
                    } else {
                        $.ajax({
                            url: 'assets/php/loginSession.php',
                            data: {
                                in_id: ds.user_id,
                                in_fname: ds.fname,
                                in_lname: ds.lname,
                                in_points: ds.points,
                                in_login: ds.last_login,
                                in_coin: ds.coins
                            },
                            type: 'POST',
                        }).done(function (resp) {
                            rs = JSON.parse(resp);
                            window.location.href = "index.html";
                        });
                    }
                });
            }

            email_input.setCustomValidity(email_message);
        });
    }
};

$(function () {
    new login();
});