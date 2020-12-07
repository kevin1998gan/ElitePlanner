index = function () {
    this.init();
};

index.prototype = {
    init: function () {
        this.initEvents();
        this.loadTasks();
    },

    initEvents: function () {
        $('#tblTasks').off("click").on('click', 'tbody tr', function (e) { // table row onclick
            $("#tblTasks tbody tr").removeClass('row_selected');
            $(this).addClass('row_selected');
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
    },

    loadTasks: function () {
        $.ajax({
            url: 'assets/php/getTasks.php',
            data: {
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
                columns: [
                    { title: "No.", data: null }, //0
                    { title: "Task ID", data: "Tasks_Id" }, //1
                    { title: "Task Name", data: "Task_name" }, //2
                    { title: "Student Id", data: "Student_Id" }, //3
                    { title: "Date Created", data: "Date_created" }, //4
                    { title: "Due Date", data: "Due_date" }, //5
                    { title: "Progression", data: "Progression" }, //6
                    { title: "Action", data: null } //7
                ],
                "lengthMenu": [[5, 15, 50, -1], [5, 15, 50, "All"]],
                "columnDefs": [
                    {
                        "visible": false,
                        "targets": [1, 3, 6]
                    },
                    {
                        'targets': [0, 1, 3, 4, 5, 6, 7],
                        'searchable': false
                    },
                    {
                        'targets': 7,
                        'className': 'text-center',
                        'render': function (data, type, row, meta) {

                            return '<button"><i class="fa fa-eye"></i></button>'
                        }
                    },

                ],
                "lengthChange": false,
                "searching": true,
                "bFilter": false,
                "dom": 't<"class = float-right"p>',
                "language": { "emptyTable": "No data available" },
                "scrollX": true,
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

        });


    }

};

$(function () {
    new index();
});