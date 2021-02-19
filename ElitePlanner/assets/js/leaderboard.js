leaderboard = function () {
    this.init();
};

leaderboard.prototype = {
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
        this.loadLeaderboard(session_variables);
    },

    initEvents: function (session_variables) {
        $("#userName").text(session_variables.fname + " " + session_variables.lname);
        $("#points").text(session_variables.points);
        $("#coinNo").text(session_variables.coins);
    },

    loadLeaderboard: function (session_variables) {
        $.ajax({
            url: 'assets/php/getLeaderboards.php',
            data: {

            },
            type: 'POST'
        }).always(function (resp) {
            rs = JSON.parse(resp);
            try {
                window['dt_tblLeaderboards'].destroy();
                $('#tblLeaderboards').empty();
            } catch (e) {
            }

            window['dt_tblLeaderboards'] = $('#tblLeaderboards').DataTable({
                data: rs,
                "autoWidth": false,
                columns: [
                    { title: "#.", data: null, width: "50px"}, //0
                    { title: "Name", data: null }, //1   
                    { title: "Coins", data: null }, //2
                    { title: "id", data: "user_id" }, //3
                ],
                "lengthMenu": [[5, 15, 50, -1], [5, 15, 50, "All"]],
                "columnDefs": [
                    {
                        "visible": false,
                        "targets": [3]
                    },
                    {
                        "orderable": false,
                        "targets": [0, 1, 2, 3]
                    },
                    {
                        'targets': 1,
                        'className': 'text-center',
                        'render': function (data, type, row, meta) {
                           if (data.user_id == session_variables.id){
                               return "<p class = 'font-weight-bold mb-0'><kbd>You</kbd> </p>";
                           }else{
                            return data.fname + " " + data.lname;
                           }

                        }
                    },

                    {
                        'targets': 2,
                        'className': 'text-center',
                        'render': function (data, type, row, meta) {
                           return data.coins + "<img src = 'assets/img/coin_icon.png' />";

                        }
                    },

                ],
                "lengthChange": false,
                "searching": true,
                "bPaginate": false,
                "bFilter": false,
                "dom": 't<"class = float-right"p>',
                "language": { "emptyTable": "No data available" },
                "initComplete": function () {
                }
            });

            window['dt_tblLeaderboards'].on('order.dt search.dt', function () {
                window['dt_tblLeaderboards'].column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();

        });
    }

};

$(function () {
    new leaderboard();
});