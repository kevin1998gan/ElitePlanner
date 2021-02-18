profile = function () {
    this.init();
};

profile.prototype = {
    init: function () {
        var rs = '';
        $.ajax({
            url: 'assets/php/getSession.php',
            data: {
            },
            async: false,
            type: 'GET',
            success: function (text) {
                if (text == "[]") {
                    alert("Please login first");
                    window.location.href = "login.html";
                } else {
                    rs = text;
                }
            }

        })
        session_variables = JSON.parse(rs);
        this.initEvents(session_variables);
        this.coinsPurchase(session_variables);
    },


    initEvents: function (session_variables) {
        $("#userName").text(session_variables.fname + " " + session_variables.lname);
        $("#points").text(session_variables.points);
        $("#first_name").attr("placeholder", session_variables.fname);
        $("#last_name").attr("placeholder", session_variables.lname);
        $("#coinNo").text(session_variables.coins);

        $('#first_name').off('keyup keypress').on('keyup keypress', function (e) {
            var regex = "^[A-Za-z]+$";
            var first_name = $('#first_name').val();
            if (first_name.match(regex)) {
                $('#firstName_warning').css('color', 'green');
            } else {
                $('#firstName_warning').css('color', 'red');
            }
        });

        $('#last_name').off('keyup keypress').on('keyup keypress', function (e) {
            var regex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
            var last_name = $('#last_name').val();
            if (last_name.match(regex)) {
                $('#lastName_warning').css('color', 'green');
            } else {
                $('#lastName_warning').css('color', 'red');
            }
        });

        $('#onSave').off("click").on("click", function () {
            var fname_input = document.getElementById("first_name");
            var lname_input = document.getElementById("last_name");
            var fname = $('#first_name').val();
            var lname = $('#last_name').val();
            var fname_message = "";
            var lname_message = "";
            var name_regex = "^[A-Za-z]+$";
            var lname_regex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
            if (fname === "") {
                fname_message = "Please fill this up!"
            } else if (!fname.match(name_regex)) {
                fname_message = "Please use only letters"
            } else if (lname === "") {
                lname_message = "Please fill this up!"
            } else if (!lname.match(lname_regex)) {
                lname_message = "Please use only letters"
            } else {

                $.ajax({
                    url: 'assets/php/updateUser.php',
                    data: {
                        id: session_variables.id,
                        in_fname: fname,
                        in_lname: lname,

                    },
                    type: 'POST',
                }).done(function () {
                    $.ajax({
                        url: 'assets/php/updateUserSession.php',
                        data: {
                            in_fname: fname,
                            in_lname: lname,

                        },
                        type: 'POST',
                    }).done(function () {
                        ds = JSON.parse(resp);
                        $("#userName").text(session_variables.fname + " " + session_variables.lname);
                        $("#points").text(session_variables.points);
                        $("#first_name").attr("placeholder", session_variables.fname);
                        $("#last_name").attr("placeholder", session_variables.lname);
                    });
                });
            }

            fname_input.setCustomValidity(fname_message);
            lname_input.setCustomValidity(lname_message);

        });


    },

    coinsPurchase: function (session_variables) {
        points = session_variables.points;

        $('#buy1coin').off("click").on("click", function () {
            if(points>=100){
                $('#1coinModal').modal('toggle');
            }else{
                $('#ModalNoPoints').modal('toggle');
            }
        });

        $('#buy5coin').off("click").on("click", function () {
            if(points>=450){
                $('#5coinModal').modal('toggle');
            }else{
                $('#ModalNoPoints').modal('toggle');
            }
        });

        $('#onYes1coin').off("click").on("click", function () {
            deductPoints = -100;
            $.ajax({
                url: 'assets/php/coinPurchase.php',
                data: {
                    id: session_variables.id,
                    in_points: deductPoints,
                    in_coins: 1,

                },
                type: 'POST',
            }).done(function () {
                
            });
        });

    }

};

$(function () {
    new profile();
});