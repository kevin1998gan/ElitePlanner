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
        elem = document.getElementById("date")
        var iso = new Date().toISOString();
        var minDate = iso.substring(0, iso.length - 1);
        elem.min = minDate;

        elem2 = document.getElementById("date")
        elem2.min = minDate;

        $("#userName").text(session_variables.fname + " " + session_variables.lname);
        $("#points").text(session_variables.points);
        $.ajax({
            url: 'assets/heroku/getTasks.php',
            data: {
                id: session_variables.id,
            },
            type: 'POST'
        }).always(function (resp) {
            rs = JSON.parse(resp);

            try {
                window['calendar'].destroy();
                $('#calendar').empty();
            } catch (e) {
            }

            window['calendar'] = $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                height: 530,
                navLinks: true, // can click day/week names to navigate views
                editable: false,
                eventLimit: true,
                events: rs,
                eventDataTransform: function (eventData) {
                    var ro = new Object();
                    ro.start = eventData.due_date;
                    ro.title = eventData.task_name;
                    ro.type = eventData.type;
                    ro.id = eventData.tasks_id;
                    ro.sourceObject = eventData;

                    return ro;
                },
                displayEventTime: false,
                selectable: true,
                selectHelper: true,
                eventClick: function (event) { //when event is clicked
                    var date = event.start._i.split(" ");
                    $('#task').prop("disabled", true);
                    $('#type').prop("disabled", true);
                    $('#date').prop("disabled", true);
                    $('#task_warning').addClass('d-none');
                    $('#displayModal').modal('show');
                    $('#task').val(event.title);
                    $('#type').val(event.type);
                    $("#date").val(date[0] + "T" + date[1]);
                    $('#onEditPressed').off("click").on("click", function () { //edit pressed
                        $('#task').prop("disabled", false);
                        $('#date').prop("disabled", false);
                        $('#task_warning').removeClass('d-none');
                        $('#onSavePressed').removeClass('d-none');
                        $('#onCancelPressed').removeClass('d-none');
                    });

                    $('#onCancelPressed').off("click").on("click", function () { //edit pressed
                        $('#task').prop("disabled", true);
                        $('#date').prop("disabled", true);
                        $('#task_warning').removeClass('d-none');
                        $('#onSavePressed').addClass('d-none');
                        $('#onCancelPressed').addClass('d-none');
                        $('#task_warning').addClass('d-none');
                        $('#task').val(event.title);
                        $("#date").val(date[0] + "T" + date[1]);
                    });

                    $('#task').off('keyup keypress').on('keyup keypress', function (e) {
                        var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";
                        var task_name = $('#task').val();
                        if (task_name.match(regex)) {
                            $('#task_warning').css('color', 'green');
                        } else {
                            $('#task_warning').css('color', 'red');
                        }
                    });

                    $('#onSavePressed').off("click").on("click", function () { //edit pressed
                        var input = document.getElementById("task");
                        var task_name = $('#task').val();
                        var message = "";
                        var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";
                        if (task_name === "") {
                            message = "Please fill this up!"
                        } else if (!task_name.match(regex)) {
                            message = "Please use only letters and numbers"
                        } else {
                            task_id = event.id;
                            editedTask = $('#task').val();
                            editedType = $('#type').val();
                            editedDate = $("#date").val();
                            var noMill = newEditedDate[1].split(".");
                            var in_due = newEditedDate[0] + " " + noMill[0];

                            $.ajax({
                                url: 'assets/heroku/editTask.php',
                                data: {
                                    id: task_id,
                                    task_name: editedTask,
                                    type: editedType,
                                    due_date: in_due
                                },
                                type: 'POST',
                            }).done(function () {
                                $('#task').prop("disabled", true);
                                $('#date').prop("disabled", true);
                                $('#task_warning').removeClass('d-none');
                                $('#onSavePressed').addClass('d-none');
                                $('#onCancelPressed').addClass('d-none');
                                $('#task_warning').addClass('d-none');
                                event.title = $('#task').val();
                                event.start = in_due;
                                $('#calendar').fullCalendar('updateEvent', event);


                            });
                            input.setCustomValidity(message);
                        }


                    });

                    $('#displayModal').on('hidden.bs.modal', function () {
                        $('#onSavePressed').addClass('d-none');
                        $('#onCancelPressed').addClass('d-none');
                        $('#task_warning').addClass('d-none');
                    })

                },
                eventMouseover: function (event, jsEvent, view) {
                    $('.fc-title').addClass("pointer");
                },

            });
        });


    },

};

$(function () {
    new calendar();
});