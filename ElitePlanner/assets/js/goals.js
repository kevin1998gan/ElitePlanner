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
        this.loadPage(session_variables);
    },
    initEvents: function (session_variables) {
        var that = this;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        today = yyyy + '-' + mm + '-' + dd;
        $("#start_date").val(today);
        elem = document.getElementById("end_date")
        elem.setAttribute("min", today);

        $("#userName").text(session_variables.fname + " " + session_variables.lname);

        $('#tblGoals').off("click").on('click', 'tbody tr', function (e) { // table row onclick
            $("#tblGoals tbody tr").removeClass('row_selected');
            $(this).addClass('row_selected');
            var selected = $("#tblGoals tbody tr").closest(".row_selected");
            var data = window["dt_tblGoals"].row(selected).data();

        });

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

        $('#editClicked').on('click', function () {

            // Get the column API object
            var column = window['dt_tblGoals'].column(3);
            $("#editClicked").addClass("d-none");
            $("#doneClicked").removeClass("d-none");
            // Toggle the visibility
            column.visible(!column.visible());

        });

        $('#doneClicked').on('click', function () {

            // Get the column API object
            var column = window['dt_tblGoals'].column(3);
            $("#editClicked").removeClass("d-none");
            $("#doneClicked").addClass("d-none");
            // Toggle the visibility
            column.visible(!column.visible());

        });


    },

    loadPage: function (session_variables) {
        var that = this;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        today = yyyy + '-' + mm + '-' + dd;

        $.ajax({
            url: 'assets/php/getMinMax.php',
            data: {
                id: session_variables.id
            },
            type: 'POST',
        }).done(function (resp) {
            rs = JSON.parse(resp);
            today = new Date(today);
            min = new Date(rs.minStart);
            max = new Date(rs.maxEnd);
            if (today >= min && today <= max) {
                $("#goals").removeClass("d-none");
                $("#noGoals").addClass("d-none");
            } else {
                $("#goals").addClass("d-none");
                $("#noGoals").removeClass("d-none");
            }


        });


        $.ajax({
            url: 'assets/php/getGoals.php',
            data: {
                id: session_variables.id
            },
            type: 'POST',
        }).done(function (resp) {
            rs = JSON.parse(resp);
            $("#mainName").text(rs.goal_name);

            $.ajax({
                url: 'assets/php/getUserEfforts.php',
                data: {
                    id: rs.goal_id,
                },
                type: 'POST'
            }).always(function (resp) {
                ds = JSON.parse(resp);
                try {
                    window['dt_tblGoals'].destroy();
                    $('#tblGoals').empty();
                } catch (e) {
                }

                window['dt_tblGoals'] = $('#tblGoals').DataTable({
                    data: ds,
                    "autoWidth": false,
                    columns: [
                        { title: "Effort Name", data: "effort_name" }, //0
                        { title: "Grade", data: null }, //1
                        { title: "Credit Hours", data: "credit_hour", class: "text-center" }, //2  
                        { title: "Action", data: null, class: "text-center" } //3
                    ],
                    "lengthMenu": [[5, 15, 50, -1], [5, 15, 50, "All"]],
                    "columnDefs": [
                        {
                            "visible": false,
                            "targets": [3]
                        },

                        {
                            'targets': 1,
                            'className': 'text-center',
                            'render': function (data, type, row, meta) {
                                if (data.effort_grade == 1) {
                                    return "<p'>A+</p>"
                                } else if (data.effort_grade == 2) {
                                    return "<p'>A</p>"
                                } else if (data.effort_grade == 3) {
                                    return "<p'>A-</p>"
                                } else if (data.effort_grade == 4) {
                                    return "<p'>B+</p>"
                                } else if (data.effort_grade == 5) {
                                    return "<p'>B</p>"
                                } else if (data.effort_grade == 6) {
                                    return "<p'>B-</p>"
                                } else if (data.effort_grade == 7) {
                                    return "<p'>C+</p>"
                                } else if (data.effort_grade == 8) {
                                    return "<p'>C</p>"
                                } else if (data.effort_grade == 9) {
                                    return "<p'>F</p>"
                                }

                            }
                        },
                        {
                            'targets': 3,
                            'className': 'text-center',
                            'render': function (data, type, row, meta) {

                                return '<button class = "btn btn-primary edit" style = "padding: 5px" data-toggle="modal" data-target="#editModal">Edit</button><button class = "btn btn-danger delete" style = "margin-left: 5px;padding: 5px" data-toggle="modal" data-target="#deleteModal">Delete</button>'

                            }
                        },

                    ],
                    "lengthChange": false,
                    "searching": true,
                    "bFilter": false,
                    "paging": false,
                    "dom": 't<"class = float-right"p>',
                    "language": { "emptyTable": "No data available" },
                    "initComplete": function () {
                    }
                });

                var info = window["dt_tblGoals"].column(1).data();
                var allgrade = [];
                var allhours = [];
                var totalHours = 0;
                var totalGradePoint = 0;
                for (i = 0; i < info.length; i++) {
                    grade = info[i].effort_grade;
                    if (grade == 1) {
                        point = 4.0000;
                    } else if (grade == 2) {
                        point = 4.0000;
                    } else if (grade == 3) {
                        point = 3.6700;
                    } else if (grade == 4) {
                        point = 3.3300;
                    } else if (grade == 5) {
                        point = 3.0000;
                    } else if (grade == 6) {
                        point = 2.6700;
                    } else if (grade == 7) {
                        point = 2.3300;
                    } else if (grade == 8) {
                        point = 2.0000;
                    } else if (grade == 9) {
                        point = 0;
                    }

                    allgrade.push(point);
                }

                for (i = 0; i < info.length; i++) {
                    hour = parseFloat(info[i].credit_hour);
                    allhours.push(hour);
                    totalHours = totalHours + hour;
                }

                for (i = 0; i < info.length; i++) {
                    grade_point = allgrade[i] * allhours[i];
                    totalGradePoint = totalGradePoint + grade_point;
                }

                var gpa = totalGradePoint/totalHours;

                console.log(gpa.toFixed(4));

            });
        });





    }
};



$(function () {
    new goals();
});