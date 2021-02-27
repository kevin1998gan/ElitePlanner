tasks = function () {
    this.init();
};

tasks.prototype = {
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
        this.loadTasks(session_variables);
    },

    initEvents: function (session_variables) {

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

        var that = this;

        elem = document.getElementById("add_date")
        var iso = new Date().toISOString();
        var minDate = iso.substring(0, iso.length - 1);
        elem.min = minDate;

        elem2 = document.getElementById("date")
        elem2.min = minDate;

        $("#points").text(session_variables.points);
        $('#tblTasks').off("click").on('click', 'tbody tr', function (e) { // table row onclick
            $("#tblTasks tbody tr").removeClass('row_selected');
            $(this).addClass('row_selected');
            var selected = $("#tblTasks tbody tr").closest(".row_selected");
            var data = window["dt_tblTasks"].row(selected).data();
            task_name = data.task_name;
            dateTime = data.due_date;
            progress = data.progression;
            var date = dateTime.split(" ");
            $('#task').val(task_name);
            $("#date").val(date[0] + "T" + date[1]);
            $('#value').text(progress + '%');
            $('#myRange').val(progress);
        });

        $('#onAdd').off("click").on("click", function () {
            var input = document.getElementById("addtask");
            var task_name = $('#addtask').val();
            var message = "";
            var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";

            var date_input = document.getElementById("add_date");
            var add_date = $('#add_date').val();
            var date_message = "";
            if (task_name === "") {
                message = "Please fill this up!"
            } else if (!task_name.match(regex)) {
                message = "Please use only letters and numbers"
            } else if (add_date == "") {
                date_message = "Please fill this up!"
            } else {
                addTask = $('#addtask').val();
                addType = $('#add_type').val();
                addDate = $("#add_date").val();
                progress = 0;
                var newAddDate = addDate.split("T");
                var noMill = newAddDate[1].split(".");
                var in_due = newAddDate[0] + " " + noMill[0];
                $.ajax({
                    url: 'assets/heroku/addTask.php',
                    data: {
                        id: session_variables.id,
                        task_name: addTask,
                        type: addType,
                        due_date: in_due,
                        progression: progress
                    },
                    type: 'POST',
                }).done(function () {
                    $('#addModal').modal('toggle');
                    that.loadTasks(session_variables);
                    $('#addtask').val("");
                    $("#add_date").val("");
                });
            }

            input.setCustomValidity(message);
            date_input.setCustomValidity(date_message);

        });

        $("#userName").text(session_variables.fname + " " + session_variables.lname);

        $('#overdue_onClick').off("click").on("click", function () {
            window['dt_tblTasks'].search("Overdue").draw();
        });

        $('#incomplete_onClick').off("click").on("click", function () {
            window['dt_tblTasks'].search("Incomplete").draw();
        });

        $('#reset').off("click").on("click", function () {
            that.loadTasks(session_variables);
        });

        $('#onDelete').off("click").on("click", function () { //delete action
            var selected = $("#tblTasks tbody tr").closest(".row_selected");
            var data = window["dt_tblTasks"].row(selected).data();
            task_id = data.tasks_id;
            $.ajax({
                url: 'assets/heroku/deleteTask.php',
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
                task_id = data.tasks_id;
                editedTask = $('#task').val();
                editedType = $('#type').val();
                editedDate = $("#date").val();
                var newEditedDate = editedDate.split("T");
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
                    $('#editModal').modal('toggle');
                    that.loadTasks(session_variables);
                });

                var newValue = $('#value').text();
                var pro_value = newValue.split("%");
                $.ajax({
                    url: 'assets/heroku/editProgress.php',
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
            }

            input.setCustomValidity(message);

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

        $('#addtask').off('keyup keypress').on('keyup keypress', function (e) {
            var regex = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";
            var task_name = $('#addtask').val();
            if (task_name.match(regex)) {
                $('#add_task_warning').css('color', 'green');
            } else {
                $('#add_task_warning').css('color', 'red');
            }
        });

    },

    loadTasks: function (session_variables) {
        task_type = "Task";
        $.ajax({
            url: 'assets/heroku/getUserTasks.php',
            data: {
                id: session_variables.id,
                type : task_type
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
                    { title: "Task ID", data: "tasks_id" }, //1   
                    { title: "Name", data: "task_name" }, //2
                    { title: "Type", data: "type" }, //3
                    { title: "Student Id", data: "user_id" }, //4
                    { title: "Due Date", data: "due_date" }, //5
                    { title: "Progression(%)", data: "progression" }, //6
                    { title: "Status", data: null }, //7
                    { title: "Action", data: null } //8
                ],
                "lengthMenu": [[5, 15, 50, -1], [5, 15, 50, "All"]],
                "columnDefs": [
                    {
                        "visible": false,
                        "targets": [1, 3, 4]
                    },
                    {
                        'targets': [0, 1, 3, 4, 6, 8],
                        'searchable': false
                    },
                    {
                        'targets': 7,
                        'className': 'text-center',
                        'render': function (data, type, row, meta) {
                            var now = new Date().getTime();
                            var due_date = new Date(data.due_date).getTime();
                            if (data.progression >= 100) {
                                return "<p style ='color:green'>Complete</p>"
                            } else if (now > due_date) {
                                return "<p style ='color:red'>Overdue</p>"
                            } else if (data.progression < 100) {
                                return "<p style ='color:black'>Incomplete</p>"
                            }

                        }
                    },
                    {
                        'targets': 8,
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
            var progress = window['dt_tblTasks'].column(6).data();
            var incomplete_count = 0;

            today = mm + '/' + dd + '/' + yyyy;
            var overdue_count = 0;
            for (i = 0; i < dates.length; i++) {
                if (dates[i] < today && progress[i] < 100) {
                    overdue_count++;
                }
            }


            for (i = 0; i < progress.length; i++) {
                if (progress[i] < 100) {
                    incomplete_count++;
                }
            }
            $("#overdue_no").text(overdue_count);
            if (incomplete_count == 0) {
                $("#total_no").text(incomplete_count);
            } else {
                $("#total_no").text(incomplete_count - overdue_count);
            }
        });

    }

};

$(function () {
    new tasks();
});