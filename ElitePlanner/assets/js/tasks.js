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
        var that = this;
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
    },

    loadTasks: function (session_variables) {
        $.ajax({
            url: 'assets/php/getUserTasks.php',
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
                    { title: "Status", data: null }, //7
                    { title: "Action", data: null } //8
                ],
                "lengthMenu": [[5, 15, 50, -1], [5, 15, 50, "All"]],
                "columnDefs": [
                    {
                        "visible": false,
                        "targets": [1, 3, 4, 6]
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
                            var due_date = new Date(data.Due_date).getTime();
                            if (data.Progression >= 100) {
                                return "<p style ='color:green'>Complete</p>"
                            } else if (now > due_date) {
                                return "<p style ='color:red'>Overdue</p>"
                            } else if (data.Progression < 100) {
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

            today = mm + '/' + dd + '/' + yyyy;
            var overdue_count = 0;
            for (i = 0; i < dates.length; i++) {
                if (dates[i] === today) {
                    overdue_count++;
                }
            }

            var progress = window['dt_tblTasks'].column(6).data();
            var incomplete_count =  0;
            for (i = 0; i < progress.length; i++) {
                if (progress[i] < 100) {
                    incomplete_count++;
                }
            }
            $("#overdue_no").text(overdue_count);
            if(incomplete_count == 0){
            $("#total_no").text(incomplete_count);
            }else{
                $("#total_no").text(incomplete_count-overdue_count);
            }
        });

    }

};

$(function () {
    new tasks();
});