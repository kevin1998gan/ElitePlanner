pastGoals = function () {
    this.init();
};

pastGoals.prototype = {
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
        this.loadPastGoals(session_variables);

    },
    initEvents: function (session_variables) {
        $('#tblPastGoals').off("click").on('click', 'tbody tr', function (e) { // table row onclick
            $("#tblPastGoals tbody tr").removeClass('row_selected');
            $(this).addClass('row_selected');
            var selected = $("#tblPastGoals tbody tr").closest(".row_selected");
            var data = window["dt_tblPastGoals"].row(selected).data();


            $.ajax({
                url: 'assets/heroku/getUserEfforts.php',
                data: {
                    id: data.goal_id
                },
                type: 'POST',
            }).done(function (resp) {
                ds = JSON.parse(resp);
                try {
                    window['dt_tblPastEfforts'].destroy();
                    $('#tblPastEfforts').empty();
                } catch (e) {
                }

                window['dt_tblPastEfforts'] = $('#tblPastEfforts').DataTable({
                    data: ds,
                    "autoWidth": false,
                    columns: [
                        { title: "Subject Name", data: "effort_name" }, //0
                        { title: "Targeted Grade", data: null }, //1
                        { title: "Credit Hours", data: "credit_hour", class: "text-center" }, //2  

                    ],
                    "lengthMenu": [[5, 15, 50, -1], [5, 15, 50, "All"]],
                    "columnDefs": [
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
                $('#goalTitle').text(data.goal_name);
                $('#pastgpa').text(data.target_gpa);
                $('#pastactualgpa').text(data.actual_gpa);
                $('#pastGoalModal').modal('toggle');
            });
        });
    },
    loadPastGoals: function (session_variables) {
        $.ajax({
            url: 'assets/heroku/getPastGoals.php',
            data: {
                id: session_variables.id
            },
            type: 'POST',
        }).done(function (resp) {
            ds = JSON.parse(resp);
            try {
                window['dt_tblPastGoals'].destroy();
                $('#tblPastGoals').empty();
            } catch (e) {
            }

            window['dt_tblPastGoals'] = $('#tblPastGoals').DataTable({
                data: ds,
                "autoWidth": false,
                columns: [
                    { title: "Goal Name", data: "goal_name" }, //0
                    { title: "Start Date", data: "goal_startdate" }, //1
                    { title: "End Date", data: "goal_enddate" }, //2  
                    { title: "Status", data: null }, //3
                    { title: "Goalid", data: "goal_id" } //4
                ],
                "lengthMenu": [[5, 15, 50, -1], [5, 15, 50, "All"]],
                "columnDefs": [
                    {
                        "visible": false,
                        "targets": [4]
                    },

                    {
                        'targets': 3,
                        'render': function (data, type, row, meta) {
                            if (data.actual_gpa == -1 && data.target_gpa == -1) {
                                return "<p style ='color:red'>Incomplete</p>"
                            }
                            else if (data.actual_gpa < data.target_gpa) {
                                return "<p style ='color:red'>Fail</p>"
                            } else {
                                return "<p style ='color:green'>Success</p>"
                            }

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

        });
    },

};

$(function () {
    new pastGoals();
});