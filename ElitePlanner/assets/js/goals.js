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

        $.ajax({
            url: 'assets/php/getGoals.php',
            data: {
                id: session_variables.id,
            },
            type: 'POST',
        }).done(function () {
            
        });

    }
};



$(function () {
    new goals();
});