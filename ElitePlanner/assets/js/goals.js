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
        $("#points").text(session_variables.points);
        $('#tblGoals').off("click").on('click', 'tbody tr', function (e) { // table row onclick
            $("#tblGoals tbody tr").removeClass('row_selected');
            $(this).addClass('row_selected');
            var selected = $("#tblGoals tbody tr").closest(".row_selected");
            var data = window["dt_tblGoals"].row(selected).data();
            effortName = data.effort_name;
            grade = data.effort_grade;
            if (grade == 1) {
                finalGrade = "A+";
            } else if (grade == 2) {
                finalGrade = "A";
            } else if (grade == 3) {
                finalGrade = "A-";
            } else if (grade == 4) {
                finalGrade = "B+";
            } else if (grade == 5) {
                finalGrade = "B";
            } else if (grade == 6) {
                finalGrade = "B-";
            } else if (grade == 7) {
                finalGrade = "C+";
            } else if (grade == 8) {
                finalGrade = "C-";
            }
            creditHour = data.credit_hour;
            $("#edit_task").val(effortName);
            $("#edit_grade").val(finalGrade);
            $("#edit_creditHour").val(creditHour);

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

        $('#end_date').change(function() {
            $("#date_warning").removeClass("d-none");
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
                        url: 'assets/heroku/saveGoals.php',
                        data: {
                            goalName: goal_name,
                            start: start_date,
                            end: end_date,
                            id: session_variables.id
                        },
                        type: 'POST',
                    }).done(function () {
                        $('#createModal').modal('toggle');
                        $('#noGoals').addClass('d-none');
                        $('#goals').removeClass('d-none');
                        that.loadPage(session_variables);
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

        //Form Validation
        $('#addtask').off('keyup keypress').on('keyup keypress', function (e) {
            var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";
            var task_name = $('#addtask').val();
            if (task_name.match(regex)) {
                $('#add_task_warning').css('color', 'green');
            } else {
                $('#add_task_warning').css('color', 'red');
            }
        });

        $('#edit_task').off('keyup keypress').on('keyup keypress', function (e) {
            var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";
            var task_name = $('#edit_task').val();
            if (task_name.match(regex)) {
                $('#edit_task_warning').css('color', 'green');
            } else {
                $('#edit_task_warning').css('color', 'red');
            }
        });

        $('#creditHour').off('keyup keypress').on('keyup keypress', function (e) {
            var credit_hour = $('#creditHour').val();
            if (credit_hour.match(/^\d*(\.\d{0,2})?$/)) {
                $('#hour_task_warning').css('color', 'green');
            } else {
                $('#hour_task_warning').css('color', 'red');
            }
        });

        $('#edit_creditHour').off('keyup keypress').on('keyup keypress', function (e) {
            var credit_hour = $('#edit_creditHour').val();
            if (credit_hour.match(/^\d*(\.\d{0,2})?$/)) {
                $('#edit_hour_task_warning').css('color', 'green');
            } else {
                $('#edit_hour_task_warning').css('color', 'red');
            }
        });


        $('#onAdd').off("click").on("click", function () {
            var input = document.getElementById("addtask");
            var task_name = $('#addtask').val();
            var message = "";
            var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";

            var hours_input = document.getElementById("creditHour");
            var credit_hour = $('#creditHour').val();
            var hour_message = "";

            if (task_name === "") {
                message = "Please fill this up!"
            } else if (!task_name.match(regex)) {
                message = "Please use only letters and numbers"
            } else if (credit_hour == "") {
                hour_message = "Please fill this up!"
            } else {
                addEffort = $('#addtask').val();
                addGrade = $('#grade').val();
                var finalGrade = 0;
                if (addGrade == "A+") {
                    finalGrade = 1;
                } else if (addGrade == "A") {
                    finalGrade = 2;
                } else if (addGrade == "A-") {
                    finalGrade = 3;
                } else if (addGrade == "B+") {
                    finalGrade = 4;
                } else if (addGrade == "B") {
                    finalGrade = 5;
                } else if (addGrade == "B-") {
                    finalGrade = 6;
                } else if (addGrade == "C+") {
                    finalGrade = 7;
                } else if (addGrade == "C-") {
                    finalGrade = 8;
                }


                addHour = $('#creditHour').val();
                $.ajax({
                    url: 'assets/heroku/getGoals.php',
                    data: {
                        id: session_variables.id
                    },
                    type: 'POST',
                }).done(function (resp) {
                    rs = JSON.parse(resp);
                    $.ajax({
                        url: 'assets/heroku/addEffort.php',
                        data: {
                            id: rs.goal_id,
                            effort: addEffort,
                            grade: finalGrade,
                            credit_hour: addHour,
                        },
                        type: 'POST',
                    }).done(function () {
                        $('#addModal').modal('toggle');
                        $("#editClicked").removeClass("d-none");
                        $("#doneClicked").addClass("d-none");
                        that.loadPage(session_variables);
                    });
                });
            }

            input.setCustomValidity(message);
            hours_input.setCustomValidity(hour_message);

        });

        $('#onSave').off("click").on("click", function () {
            var input = document.getElementById("edit_task");
            var task_name = $('#edit_task').val();
            var message = "";
            var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";

            var hours_input = document.getElementById("edit_creditHour");
            var credit_hour = $('#edit_creditHour').val();
            var hour_message = "";

            var selected = $("#tblGoals tbody tr").closest(".row_selected");
            var data = window["dt_tblGoals"].row(selected).data();

            if (task_name === "") {
                message = "Please fill this up!"
            } else if (!task_name.match(regex)) {
                message = "Please use only letters and numbers"
            } else if (credit_hour == "") {
                hour_message = "Please fill this up!"
            } else {
                editEffort = $('#edit_task').val();
                editGrade = $('#edit_grade').val();
                var finalGrade = 0;
                if (editGrade == "A+") {
                    finalGrade = 1;
                } else if (editGrade == "A") {
                    finalGrade = 2;
                } else if (editGrade == "A-") {
                    finalGrade = 3;
                } else if (editGrade == "B+") {
                    finalGrade = 4;
                } else if (editGrade == "B") {
                    finalGrade = 5;
                } else if (editGrade == "B-") {
                    finalGrade = 6;
                } else if (editGrade == "C+") {
                    finalGrade = 7;
                } else if (editGrade == "C-") {
                    finalGrade = 8;
                }


                editHour = $('#edit_creditHour').val();

                $.ajax({
                    url: 'assets/heroku/updateEffort.php',
                    data: {
                        id: data.effort_id,
                        effort: editEffort,
                        grade: finalGrade,
                        credit_hour: editHour,
                    },
                    type: 'POST',
                }).done(function () {
                    $('#editModal').modal('toggle');
                    $("#editClicked").removeClass("d-none");
                    $("#doneClicked").addClass("d-none");
                    that.loadPage(session_variables);
                });

            }

            input.setCustomValidity(message);
            hours_input.setCustomValidity(hour_message);

        });

        $('#onDelete').off("click").on("click", function () { //delete action
            var selected = $("#tblGoals tbody tr").closest(".row_selected");
            var data = window["dt_tblGoals"].row(selected).data();
            effort_id = data.effort_id;
            $.ajax({
                url: 'assets/heroku/deleteEffort.php',
                data: {
                    id: effort_id
                },
                type: 'POST',
            }).done(function () {
                $("#editClicked").removeClass("d-none");
                $("#doneClicked").addClass("d-none");
                that.loadPage(session_variables);

            });
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
            url: 'assets/heroku/getMinMax.php',
            data: {
                id: session_variables.id
            },
            type: 'POST',
        }).done(function (resp) {
            rs = JSON.parse(resp);
            today = new Date(today);
            min = new Date(rs.minstart);
            max = new Date(rs.maxend);

            if (today >= min && today <= max) {
                $("#goals").removeClass("d-none");
                $("#noGoals").addClass("d-none");
                $("#note").text("* Please note that you will only be able to compare after the goal end date set.");
            } else {
                $("#goals").addClass("d-none");
                $("#noGoals").removeClass("d-none");
            }

            $.ajax({
                url: 'assets/heroku/getGoals.php',
                data: {
                    id: session_variables.id
                },
                type: 'POST',
            }).done(function (resp) {
                rs = JSON.parse(resp);
                $("#mainName").text(rs.goal_name);
                $("#achievedBy").text(rs.goal_enddate);
                today = new Date(today);
                endDate = new Date(rs.goal_enddate);
                var days = today.getTime() - endDate.getTime();
                var dayDifference = days / (1000 * 3600 * 24);

                if (dayDifference >= 0 && dayDifference <= 21 && rs.status == 0) {
                    $("#goals").removeClass("d-none");
                    $("#noGoals").addClass("d-none");
                    $("#compareClicked").removeClass("disabled");
                    $('#compareClicked').prop('disabled', false);
                    $("#editClicked").addClass("disabled");
                    $('#editClicked').prop('disabled', true);
                    $('#create').addClass("d-none");
                    $("#note").text("* Please compare your current results to planned results");
                } else if (dayDifference > 21 && rs.status == 0 && session_variables.spend == 1) {
                    $("#goals").removeClass("d-none");
                    $("#noGoals").addClass("d-none");
                    $("#compareClicked").removeClass("disabled");
                    $('#compareClicked').prop('disabled', false);
                    $("#editClicked").addClass("disabled");
                    $('#editClicked').prop('disabled', true);
                    $('#create').addClass("d-none");
                    $('#spendClicked').prop('disabled', false);
                    $("#spendClicked").addClass("disabled");
                    $('#spendClicked').addClass("d-none");
                    $("#note").text("* You may compare now");

                } else if (dayDifference > 21 && rs.status == 0) {
                    $("#goals").removeClass("d-none");
                    $("#noGoals").addClass("d-none");
                    $("#compareClicked").addClass("disabled");
                    $('#compareClicked').prop('disabled', true);
                    $("#editClicked").addClass("disabled");
                    $('#editClicked').prop('disabled', true);
                    $('#create').addClass("d-none");
                    $('#spendClicked').prop('disabled', false);
                    $("#spendClicked").removeClass("disabled");
                    $('#spendClicked').removeClass("d-none");
                    $("#note").text("* Oops! Looks like you took too long to compare your goals");

                }

                $.ajax({
                    url: 'assets/heroku/getUserEfforts.php',
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
                            { title: "Subject Name", data: "effort_name" }, //0
                            { title: "Grade", data: null }, //1
                            { title: "Credit Hours", data: "credit_hour", class: "text-center" }, //2  
                            { title: "Action", data: null, class: "text-center" }, //3
                            { title: "Action", data: "effort_id" } //4
                        ],
                        "lengthMenu": [[5, 15, 50, -1], [5, 15, 50, "All"]],
                        "columnDefs": [
                            {
                                "visible": false,
                                "targets": [3, 4]
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

                                    return '<button id = "edit" class = "btn btn-primary edit" style = "padding: 5px" data-toggle="modal" data-target="#editModal">Edit</button><button class = "btn btn-danger delete" style = "margin-left: 5px;padding: 5px" data-toggle="modal" data-target="#deleteModal">Delete</button>'

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

                    var gpa = totalGradePoint / totalHours;

                    $("#gpa").text(gpa.toFixed(4));
                    $("#comparegpa").text(gpa.toFixed(4));

                    var grade = "A+";
                    for (i = 0; i < ds.length; i++) {

                        if (ds[i].effort_grade == 1) {
                            grade = "A+"
                        } else if (ds[i].effort_grade == 2) {
                            grade = "A"
                        } else if (ds[i].effort_grade == 3) {
                            grade = "A-"
                        } else if (ds[i].effort_grade == 4) {
                            grade = "B+"
                        } else if (ds[i].effort_grade == 5) {
                            grade = "B"
                        } else if (ds[i].effort_grade == 6) {
                            grade = "B-"
                        } else if (ds[i].effort_grade == 7) {
                            grade = "C+"
                        } else if (ds[i].effort_grade == 8) {
                            grade = "C"
                        }


                        $("#compareTable tbody").append(
                            "<tr>" +
                            "<td>" + ds[i].effort_name + "</td>" +
                            "<td>" + grade + "</td>" +
                            "<td>" + ds[i].credit_hour + "</td>" +
                            "<td>" + "<select name='type' class='mb-2 form-control-sm select_actual'id='actualGrade'>" +
                            "<option value='4.0000' selected>A+</option>" +
                            "<option value='4.0000'>A</option>" +
                            "<option value='3.6700'>A-</option>" +
                            "<option value='3.3300'>B+</option>" +
                            "<option value='3.0000'>B</option>" +
                            "<option value='2.6700'>B-</option>" +
                            "<option value='2.3300'>C+</option>" +
                            "<option value='2.0000'>C</option>" +
                            "<option value='0'>F</option>" +
                            "</select> </td>" +
                            "</tr>");
                    }

                    var compare = document.getElementById("compareTable");
                    var i, s = null, tr, td;
                    subject = [];
                    grade = [];
                    credit = [];

                    for (i = 0; i < compare.rows.length; i++) {
                        if (compare.rows[i].cells.length > 0) {
                            subject.push(compare.rows[i].cells[0].innerText);

                        }
                    }
                    for (i = 0; i < compare.rows.length; i++) {
                        if (compare.rows[i].cells.length > 1) {
                            grade.push(compare.rows[i].cells[1].innerText);

                        }
                    }
                    for (i = 0; i < compare.rows.length; i++) {
                        if (compare.rows[i].cells.length > 2) {
                            credit.push(compare.rows[i].cells[2].innerText);

                        }
                    }

                    subject.shift();
                    grade.shift();
                    credit.shift();

                    calActualGPA();

                    $(".select_actual").change(function () {
                        calActualGPA();
                    });

                    function calActualGPA() {
                        actual = [];
                        var allSelect = document.getElementsByClassName("select_actual");

                        for (i = 0; i < allSelect.length; i++) {
                            actual.push(allSelect[i].value);
                        }

                        var totalActualGradePoint = 0;
                        for (i = 0; i < credit.length; i++) {
                            actual_grade_point = credit[i] * actual[i];
                            totalActualGradePoint = totalActualGradePoint + actual_grade_point;
                        }
                        var actual_gpa = totalActualGradePoint / totalHours;

                        $('#actualgpa').text(actual_gpa.toFixed(4));
                    }


                    $('#onSubmit').off("click").on("click", function () { //submit action
                        var actualGPA = $("#actualgpa").text();
                        var targetGPA = $("#comparegpa").text();

                        $.ajax({
                            url: 'assets/heroku/updateGoals.php',
                            data: {
                                id: rs.goal_id,
                                target: targetGPA,
                                actual: actualGPA
                            },
                            type: 'POST',
                        }).done(function () {
                            if (actualGPA >= targetGPA) {
                                $.ajax({
                                    url: 'assets/heroku/goalsAchievedPoints.php',
                                    data: {
                                        id: session_variables.id,
                                        points: 100,
                                    },
                                    type: 'POST',
                                }).done(function () {
                                    $.ajax({
                                        url: 'assets/php/updateCoinSession.php',
                                        data: {
                                            in_coins: 0,
                                            in_points: 100
                                        },
                                        type: 'POST',
                                    }).done(function (resp) {
                                        ds = JSON.parse(resp);
                                        $("#points").text(ds.points);
                                        $('#goalsAchievedModal').modal('toggle');

                                    });

                                });
                            }else{
                                $.ajax({
                                    url: 'assets/heroku/goalsAchievedPoints.php',
                                    data: {
                                        id: session_variables.id,
                                        points: 30,
                                    },
                                    type: 'POST',
                                }).done(function () {
                                    $.ajax({
                                        url: 'assets/php/updateCoinSession.php',
                                        data: {
                                            in_coins: 0,
                                            in_points: 30
                                        },
                                        type: 'POST',
                                    }).done(function (resp) {
                                        ds = JSON.parse(resp);
                                        $("#points").text(ds.points);
                                        $('#goalsFinishModal').modal('toggle');

                                    });

                                });
                            }
                            $("#goals").addClass("d-none");
                            $("#noGoals").removeClass("d-none");

                        });

                    });

                    $('#deleteGoal').off("click").on("click", function () { //delete action
                        $.ajax({
                            url: 'assets/heroku/deleteGoal.php',
                            data: {
                                id: rs.goal_id
                            },
                            type: 'POST',
                        }).done(function () {
                            $("#goals").addClass("d-none");
                            $("#noGoals").removeClass("d-none");

                        });
                    });

                    $('#spendClicked').off("click").on("click", function () {
                        points = $("#points").text();
                        if (points >= 50) {
                            $('#spendModal').modal('toggle');
                        } else {
                            $('#ModalNoPoints').modal('toggle');
                        }
                    });

                    $('#onYes').off("click").on("click", function () { //Spend action
                        $.ajax({
                            url: 'assets/php/addSpendSession.php',
                            data: {
                                spend: 1
                            },
                            type: 'POST',
                        }).done(function () {
                            deductPoints = -50;
                            $.ajax({
                                url: 'assets/heroku/coinPurchase.php',
                                data: {
                                    id: session_variables.id,
                                    in_points: deductPoints,
                                    in_coins: 0,
                                },
                                type: 'POST',
                            }).done(function () {
                                $.ajax({
                                    url: 'assets/php/updateCoinSession.php',
                                    data: {
                                        in_points: deductPoints,
                                        in_coins: 0,

                                    },
                                    type: 'POST',
                                }).done(function (resp) {
                                    ds = JSON.parse(resp);
                                    $("#points").text(ds.points);
                                    $("#compareClicked").removeClass("disabled");
                                    $('#compareClicked').prop('disabled', false);
                                    $('#spendClicked').addClass('d-none');
                                    $("#note").text("* You may compare now");
                                });


                            });


                        });
                    });

                });
            });

        });








    }
};



$(function () {
    new goals();
});