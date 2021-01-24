calendar = function () {
    this.init();
};

calendar.prototype = {
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
        $("#userName").text(session_variables.fname + " " + session_variables.lname);
        $.ajax({
            url: 'assets/php/getTasks.php',
            data: {
                id: session_variables.id,
            },
            type: 'POST'
        }).always(function (resp) {
            rs = JSON.parse(resp);
            console.log(rs);
            var calendar = $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                height: 550,
                navLinks: true, // can click day/week names to navigate views
                editable: false,
                eventLimit: true,
                events: rs,
                eventDataTransform: function (eventData){
                    var ro = new Object();
                    ro.start = eventData.Due_date;
                    ro.title = eventData.Task_name;
                    ro.type = eventData.type;
                    ro.sourceObject = eventData;
                    return ro;
                },
                displayEventTime: false,
                selectable: true,
                selectHelper: true,
            });
        });

    }
};

$(function () {
    new calendar();
});