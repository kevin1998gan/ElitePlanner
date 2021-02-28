register = function () {
    this.init();
};

register.prototype = {
    init: function () {
        this.initEvents();
    },


    initEvents: function () {
        var that = this;

        $('#FirstName').off('keyup keypress').on('keyup keypress', function (e) {
            var regex = "^[A-Za-z]+$";
            var first_name = $('#FirstName').val();
            if (first_name.match(regex)) {
                $('#firstName_warning').css('color', 'green');
            } else {
                $('#firstName_warning').css('color', 'red');
            }
        });

        $('#LastName').off('keyup keypress').on('keyup keypress', function (e) {
            var regex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
            var last_name = $('#LastName').val();
            if (last_name.match(regex)) {
                $('#lastName_warning').css('color', 'green');
            } else {
                $('#lastName_warning').css('color', 'red');
            }
        });

        $('#InputEmail').off('keyup keypress').on('keyup keypress', function (e) {
            var regex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
            var email = $('#InputEmail').val();
            if (email.match(regex)) {
                $('#email_warning').css('color', 'green');
            } else {
                $('#email_warning').css('color', 'red');
            }

            $.ajax({
                url: 'assets/heroku/checkEmail.php',
                data: {
                    in_email: email
                },
                type: 'POST',
            }).done(function (resp) {
                ds = JSON.parse(resp);
                if (ds.checkemail == 0) {
                    $('#emailAvai_warning').addClass("d-none");
                } else {
                    $('#emailAvai_warning').removeClass("d-none");
                }

            });

        });

        $('#PasswordInput').off('keyup keypress').on('keyup keypress', function (e) {
            var password = $('#PasswordInput').val();
            if (password.length >= 8) {
                $('#password_warning').css('color', 'green');
            } else {
                $('#password_warning').css('color', 'red');
            }
        });

        $('#RepeatPasswordInput').off('keyup keypress').on('keyup keypress', function (e) {
            var password = $('#PasswordInput').val();
            var rpassword = $('#RepeatPasswordInput').val();
            if (password === rpassword) {
                $('#rpassword_warning').css('color', 'green');
            } else {
                $('#rpassword_warning').css('color', 'red');
            }
        });

        $('#onRegister').off("click").on("click", function () {
            var fname_input = document.getElementById("FirstName");
            var lname_input = document.getElementById("LastName");
            var email_input = document.getElementById("InputEmail");
            var password_input = document.getElementById("PasswordInput");
            var rpassword_input = document.getElementById("RepeatPasswordInput");
            var fname = $('#FirstName').val();
            var lname = $('#LastName').val();
            var email = $('#InputEmail').val();
            var password = $('#PasswordInput').val();
            var rpassword = $('#RepeatPasswordInput').val();
            var fname_message = "";
            var lname_message = "";
            var email_message = "";
            var password_message = "";
            var rpassword_message = "";
            var name_regex = "^[A-Za-z]+$";
            var lname_regex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
            var email_regex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
            var check = document.getElementById("emailAvai_warning").className
            if (fname === "") {
                fname_message = "Please fill this up!"
            } else if (!fname.match(name_regex)) {
                fname_message = "Please use only letters"
            } else if (lname === "") {
                lname_message = "Please fill this up!"
            } else if (!lname.match(lname_regex)) {
                lname_message = "Please use only letters"
            } else if (email === "") {
                email_message = "Please fill this up!"
            } else if (!email.match(email_regex)) {
                email_message = "Please use correct email format"
            } else if (check === "") {
                email_message = "Email already in use"
            } else if (password === "") {
                password_message = "Please fill this up!"
            } else if (password.length < 8) {
                password_message = "Please make sure password is longer than 8 characters"
            } else if (rpassword === "") {
                rpassword_message = "Please fill this up!"
            } else if (rpassword != password) {
                rpassword_message = "Please make sure that both password match"
            } else {
                $("#loader").removeClass('d-none');
                $("#container").addClass('d-none');
                $.ajax({
                    url: 'assets/heroku/register.php',
                    data: {
                        in_fname: fname,
                        in_lname: lname,
                        in_email: email,
                        in_password: password
                    },
                    type: 'POST',
                }).done(function () {
                    window.location.href = "welcome.html";
                });
            }

            fname_input.setCustomValidity(fname_message);
            lname_input.setCustomValidity(lname_message);
            email_input.setCustomValidity(email_message);
            password_input.setCustomValidity(password_message);
            rpassword_input.setCustomValidity(rpassword_message);
        });



    }
};

$(function () {
    new register();
});