goals = function () {
    this.init();
};

goals.prototype = {
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
    },
    initEvents: function (session_variables) {
        var that = this;
        $("#userName").text(session_variables.fname + " " + session_variables.lname);
        $('#goalName').off('keyup keypress').on('keyup keypress', function (e) {
            var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";
            var task_name = $('#goalName').val();
            if (task_name.match(regex)) {
                $('#goal_warning').css('color', 'green');
            } else {
                $('#goal_warning').css('color', 'red');
            }
        });



        $('#onCreate').off("click").on("click", function () { //add pressed
            var goal_name = $('#goalName').val();
            var start_date = $("#start_date").val();
            var end_date = $("#end_date").val();
            $("#ntg_warning").addClass("d-none");
            $("#startntg_warning").addClass("d-none");
            $("#endntg_warning").addClass("d-none");
            var message = "";
            var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";
            if (goal_name === "") {
                $("#ntg_warning").removeClass("d-none");
            } else if (!goal_name.match(regex)) {
                message = "Please use only letters and numbers"
            } else if (start_date === "") {
                $("#startntg_warning").removeClass("d-none");
            } else if (end_date === "") {
                $("#endntg_warning").removeClass("d-none");
            } else if ($("#start_date").val() !== null && $("#end_date").val() !== null) {
                start_date = $("#start_date").val();
                end_date = $("#end_date").val();

                date1 = new Date(start_date);
                date2 = new Date(end_date);

                var days = date2.getTime() - date1.getTime();
                var dayDifference = days / (1000 * 3600 * 24);
                if (dayDifference < 49) {
                    $("#date_warning").removeClass("d-none");
                } else {
                    $.ajax({
                        url: 'assets/php/saveGoals.php',
                        data: {
                            goalName: goal_name,
                            start: start_date,
                            end: end_date,
                            id: session_variables.id
                        },
                        type: 'POST',
                    }).done(function () {
                        $('#createModal').modal('toggle');


                    });

                }
            }


        });

    }
};



$(function () {
    new goals();
});