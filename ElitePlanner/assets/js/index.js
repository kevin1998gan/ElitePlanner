index = function () {
    this.init();
};

index.prototype = {
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
        this.checkPoints(session_variables);
        this.initEvents(session_variables);
        this.loadTasks(session_variables);
    },

    checkPoints: function (session_variables) {
        last_login = session_variables.login;
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

        today_date = yyyy + '-' + mm + '-' + dd;
        today = new Date(today_date);
        last_login = new Date(last_login);
        var days = today.getTime() - last_login.getTime();
        var dayDifference = days / (1000 * 3600 * 24);
        console.log(dayDifference)
        if (dayDifference >= 1 && dayDifference < 7) {
            $("#rewardModal").modal('toggle');
        } else if (dayDifference >= 7) {
            $("#penaltyModal").modal('toggle');
        }

        $('#rewardModal').on('hidden.bs.modal', function () {
            $.ajax({
                url: 'assets/php/updateLogin.php',
                data: {
                    id: session_variables.id,
                    login: today_date,
                },
                type: 'POST',
            }).done(function () {
                $.ajax({
                    url: 'assets/php/updateSession.php',
                    data: {
                        login: today_date,
                        points: 10
                    },
                    type: 'POST',
                }).done(function (resp) {
                    ds = JSON.parse(resp);
                    $("#points").text(ds.points);

                });

            });
        });

        $('#penaltyModal').on('hidden.bs.modal', function () {
            $.ajax({
                url: 'assets/php/updateLoginPenalty.php',
                data: {
                    id: session_variables.id,
                    login: today_date,
                },
                type: 'POST',
            }).done(function () {
                $.ajax({
                    url: 'assets/php/updateSession.php',
                    data: {
                        login: today_date,
                        points: -50
                    },
                    type: 'POST',
                }).done(function (resp) {
                    ds = JSON.parse(resp);
                    $("#points").text(ds.points);

                });

            });
        });

    },

    initEvents: function (session_variables) {
        var that = this;

        elem = document.getElementById("date")
        var iso = new Date().toISOString();
        var minDate = iso.substring(0, iso.length - 1);
        elem.min = minDate;

        $("#userName").text(session_variables.fname + " " + session_variables.lname);
        $("#points").text(session_variables.points);

        $('#tblTasks').off("click").on('click', 'tbody tr', function (e) { // table row onclick
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            $("#tblTasks tbody tr").removeClass('row_selected');
            $(this).addClass('row_selected');
            var selected = $("#tblTasks tbody tr").closest(".row_selected");
            var data = window["dt_tblTasks"].row(selected).data();
            task_name = data.Task_name;
            progress = data.Progression;
            type = data.type;
            if (type === "Exam") {
                $("#progressCard").addClass("d-none");
            } else {
                $("#progressCard").removeClass("d-none");
            }

            //countdown timer
            dateTime = data.Due_date;
            var date = dateTime.split(" ");
            mmddyy = date[0].split("-");
            due_date = mmddyy[1] + '/' + mmddyy[2] + '/' + mmddyy[0];

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = mm + '/' + dd + '/' + yyyy;
            // Set the date we're counting down to
            var countDownDate = new Date(data.Due_date).getTime();

            // Update the count down every 1 second
            var x = setInterval(function () {

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Display the result in the element 
                document.getElementById("days").innerHTML = days + ": " + hours + ": "
                    + minutes + ": " + seconds;
                // If task is overdue
                if (distance < 0) {
                    clearInterval(x);
                    document.getElementById("days").innerHTML = "Overdue";
                }
            }, 100);

            //get number of tasks with same due date
            var alldates = window['dt_tblTasks'].column(5).data();
            var i;
            var dates = [];
            for (i = 0; i < alldates.length; i++) {
                var theDate = alldates[i].split(" ");
                mmddyy = theDate[0].split("-");
                format_due_date = mmddyy[1] + '/' + mmddyy[2] + '/' + mmddyy[0];
                dates.push(format_due_date);
            }
            var due_date_count = 0;
            for (i = 0; i < dates.length; i++) {
                if (dates[i] === due_date) {
                    due_date_count++;
                }
            }

            $('#task_name').text(task_name);
            $('#task_name1').text(task_name);
            $('#progress').text(progress + '%');
            $('#value').text(progress + '%');
            $('#myRange').val(progress);
            $('#due_date').text(date[0]);
            $('#due_date_no').text(due_date_count);
            $('#task').val(task_name);
            $('#type').val(type);
            $("#date").val(date[0] + "T" + date[1]);


            $('#tblTasks').on('click', 'tbody tr', function (e) {
                clearInterval(x);
            });

            $('#progressModal').on('hidden.bs.modal', function () {
                clearInterval(x);
            });

            //reset pressed
            $('#reset').off("click").on("click", function () {
                clearInterval(x);
                that.loadTasks(session_variables);
            });

            $('#onDelete').off("click").on("click", function () { //delete action
                var selected = $("#tblTasks tbody tr").closest(".row_selected");
                var data = window["dt_tblTasks"].row(selected).data();
                task_id = data.Tasks_Id;
                $.ajax({
                    url: 'assets/php/deleteTask.php',
                    data: {
                        id: task_id
                    },
                    type: 'POST',
                }).done(function () {
                    that.loadTasks(session_variables);

                });
            });

            $('#onSave').off("click").on("click", function () {
                var input = document.getElementById("task");
                var task_name = $('#task').val();
                var message = "";
                var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";
                if (task_name === "") {
                    message = "Please fill this up!"
                } else if (!task_name.match(regex)) {
                    message = "Please use only letters and numbers"
                } else {
                    var selected = $("#tblTasks tbody tr").closest(".row_selected");
                    var data = window["dt_tblTasks"].row(selected).data();
                    task_id = data.Tasks_Id;
                    editedTask = $('#task').val();
                    editedType = $('#type').val();
                    editedDate = $("#date").val();
                    var newEditedDate = editedDate.split("T");
                    var in_due = newEditedDate[0] + " " + newEditedDate[1];

                    $.ajax({
                        url: 'assets/php/editTask.php',
                        data: {
                            id: task_id,
                            task_name: editedTask,
                            type: editedType,
                            due_date: in_due
                        },
                        type: 'POST',
                    }).done(function () {
                        $('#editModal').modal('toggle');
                        that.loadTasks(session_variables);
                    });
                }

                input.setCustomValidity(message);

            });

        });

        $('#reset').off("click").on("click", function () {
            that.loadTasks(session_variables);
        });

        $('#divRecPerPage_Index').off("click").on("click", function () { //define no. of rows to load per page
            if ($('#txtRecPerPage_Index').val() != undefined && $('#txtRecPerPage_Index').val() != null && $('#txtRecPerPage_Index').val() != '') {
                var val = $('#txtRecPerPage_Index').val();
                if (parseInt(val) != 0) {
                    window['dt_tblTasks'].page.len(val).draw();
                }
            }
        });

        $('#txtRecPerPage_Index').off('keyup keypress').on('keyup keypress', function (e) {
            if (e.keyCode == 13) {  //define no. of rows to load per page (button Enter)
                if ($('#txtRecPerPage_Index').val() != undefined && $('#txtRecPerPage_Index').val() != null && $('#txtRecPerPage_Index').val() != '') {
                    var val = $('#txtRecPerPage_Index').val();
                    if (parseInt(val) != 0) {
                        window['dt_tblTasks'].page.len(val).draw();
                    }
                }
            }
        });



        //Task Progression 
        $('#progressOnClick').off("click").on("click", function () {
            if (window['dt_tblTasks'].rows('.row_selected').any()) {
                var selected = $("#tblTasks tbody tr").closest(".row_selected");
                var data = window["dt_tblTasks"].row(selected).data();
                task_name = data.Task_name;
                $('#progression').text(task_name);
            } else {
                $('#progression').text("Please Select a task first. ");
            }
        });

        //Form Validation
        $('#task').off('keyup keypress').on('keyup keypress', function (e) {
            var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";
            var task_name = $('#task').val();
            if (task_name.match(regex)) {
                $('#task_warning').css('color', 'green');
            } else {
                $('#task_warning').css('color', 'red');
            }
        });




        $('#progressModal').on('hidden.bs.modal', function () {
            if (window['dt_tblTasks'].rows('.row_selected').any()) {
                var selected = $("#tblTasks tbody tr").closest(".row_selected");
                var data = window["dt_tblTasks"].row(selected).data();
                var task_id = data.Tasks_Id;
                var newValue = $('#value').text();
                var pro_value = newValue.split("%");
                $.ajax({
                    url: 'assets/php/editProgress.php',
                    data: {
                        id: task_id,
                        progression: pro_value[0]
                    },
                    type: 'POST',
                }).done(function () {
                    if (newValue == "100%") {
                        that.loadTasks(session_variables);

                    } else {
                        that.loadTasks(session_variables);

                    }


                });
            } else {
                $('#progression').text("Please Select a task first. ");
            }
        })



        //Due Today Clicked
        $('#dueToday').off("click").on("click", function () {
            if ($('#taskToday').text() > 0) {
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                today = yyyy + '-' + mm + '-' + dd;
                window['dt_tblTasks'].search(today).draw();
            }
        });

        //Due sameDay Clicked
        $('#sameDay').off("click").on("click", function () {
            if ($('#due_date_no').text() > 0) {
                var selected = $("#tblTasks tbody tr").closest(".row_selected");
                var data = window["dt_tblTasks"].row(selected).data();
                var due_date = data.Due_date;
                var dateToMatch = due_date.split(" ");
                window['dt_tblTasks'].search(dateToMatch[0]).draw();

            }
        });

    },

    loadTasks: function (session_variables) {
        $('#progressCard').addClass('d-none');
        $('#task_name').text("");
        $('#task_name1').text("");
        $('#progress').text("");
        $('#value').text("");
        $('#myRange').val("");
        $('#due_date').text("");
        $('#due_date_no').text("");
        $('#days').text("");
        $.ajax({
            url: 'assets/php/getTasks.php',
            data: {
                id: session_variables.id
            },
            type: 'POST'
        }).always(function (resp) {
            rs = JSON.parse(resp);

            try {
                window['dt_tblTasks'].destroy();
                $('#tblTasks').empty();
            } catch (e) {
            }

            window['dt_tblTasks'] = $('#tblTasks').DataTable({
                data: rs,
                "autoWidth": false,
                columns: [
                    { title: "No.", data: null, width: "50px" }, //0
                    { title: "Task ID", data: "Tasks_Id" }, //1   
                    { title: "Name", data: "Task_name" }, //2
                    { title: "Type", data: "type" }, //3
                    { title: "Student Id", data: "user_id" }, //4
                    { title: "Due Date", data: "Due_date" }, //5
                    { title: "Progression", data: "Progression" }, //6
                    { title: "Action", data: null } //7
                ],
                "lengthMenu": [[5, 15, 50, -1], [5, 15, 50, "All"]],
                "columnDefs": [
                    {
                        "visible": false,
                        "targets": [1, 4, 6]
                    },
                    {
                        'targets': [0, 1, 4, 6, 7],
                        'searchable': false
                    },
                    {
                        'targets': 7,
                        'className': 'text-center',
                        'render': function (data, type, row, meta) {

                            return '<button class = "btn btn-primary edit" style = "padding: 5px" data-toggle="modal" data-target="#editModal">Edit</button><button class = "btn btn-danger delete" style = "margin-left: 5px;padding: 5px" data-toggle="modal" data-target="#deleteModal">Delete</button>'

                        }
                    },
                    { targets: [2], class: "wrap" }

                ],
                "lengthChange": false,
                "searching": true,
                "bFilter": false,
                "dom": 't<"class = float-right"p>',
                "language": { "emptyTable": "No data available" },
                "initComplete": function () {
                }
            });

            $('#txtTasks').keyup(function () {
                window['dt_tblTasks'].search($(this).val()).draw();
            });

            window['dt_tblTasks'].on('order.dt search.dt', function () {
                window['dt_tblTasks'].column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();



            $('#divRecPerPage_Index').removeClass("d-none");

            //split all dates and time 
            var alldates = window['dt_tblTasks'].column(5).data();
            var i;
            var dates = [];
            for (i = 0; i < alldates.length; i++) {
                var theDate = alldates[i].split(" ");
                mmddyy = theDate[0].split("-");
                due_date = mmddyy[1] + '/' + mmddyy[2] + '/' + mmddyy[0];
                dates.push(due_date);
            }

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = mm + '/' + dd + '/' + yyyy;
            var today_count = 0;
            for (i = 0; i < dates.length; i++) {
                if (dates[i] === today) {
                    today_count++;
                }
            }

            $('#taskToday').text(today_count);

        });


    }

};

$(function () {
    new index();
});