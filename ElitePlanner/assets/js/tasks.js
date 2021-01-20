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
                rs = text;
            }

        })
        session_variables = JSON.parse(rs);
        this.initEvents(session_variables);
        this.loadTasks(session_variables);
    },

    initEvents: function (session_variables) {
        var that = this;
        $("#userName").text(session_variables.fname + " " + session_variables.lname);
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
                        'targets': [0, 1, 4, 6, 8],
                        'searchable': false
                    },
                    {
                        'targets': 7,
                        'className': 'text-center',
                        'render': function (data, type, row, meta) {
                            var now = new Date().getTime();
                            var due_date = new Date(data.Due_date).getTime();
                            if (now > due_date) {
                                return "<p style ='color:red'>Overdue</p>"
                            } else if (data.Progression < 100) {
                                return "<p style ='color:black'>Incomplete</p>";
                            } else if (data.Progression >= 100) {
                                return "<p style ='color:green'>Complete</p>";
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
                "scrollY": "250px",
                scrollCollapse: true,
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
        });

    }

};

$(function () {
    new tasks();
});