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
            var selected = $("#tblTasks tbody tr").closest(".row_selected");
            var data = window["dt_tblTasks"].row(selected).data();
            name = data.Task_name;
            progress = data.Progression;
            type = data.type;

            if (type === "Exam"){
                $("#progressCard").addClass("d-none");
            }else{
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

            $('#task_name').text(name);
            $('#task_name1').text(name);
            $('#progress').text(progress + '%');
            $('#value').text(progress + '%');
            $('#myRange').val(progress);
            $('#due_date').text(date[0]);
            $('#due_date_no').text(due_date_count);

            $('#tblTasks').on('click', 'tbody tr', function (e) {
                clearInterval(x);
            });

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
            var selected = $("#tblTasks tbody tr").closest(".row_selected");
            var data = window["dt_tblTasks"].row(selected).data();
            name = data.Task_name;
            $('#progression').text(name);
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
                    { title: "Name", data: "Task_name" }, //2
                    { title: "Type", data: "type" }, //3
                    { title: "Student Id", data: "Student_Id" }, //4
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
                        'targets': [0, 1, 4, 5, 6, 7],
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