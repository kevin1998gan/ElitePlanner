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
    },

    initEvents: function () {
        $("#userName").text(session_variables.fname + " " + session_variables.lname);
        $("#points").text(session_variables.points);
    }

};

$(function () {
    new profile();
});