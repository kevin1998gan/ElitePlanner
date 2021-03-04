'use strict';

test('displays same date overdue count on page load', () => {
    var due_date = "03/02/2021";
    var alldates = ['2021-03-02 18:00:00', '2021-03-02 15:00:00', '2021-02-02 12:00:00', '2021-05-02 15:00:00'];
    var dates = [];
    var i = 0;
    for (i = 0; i < alldates.length; i++) {
        var theDate = alldates[i].split(" ");
        var mmddyy = theDate[0].split("-");
        var format_due_date = mmddyy[1] + '/' + mmddyy[2] + '/' + mmddyy[0];
        dates.push(format_due_date);
    }
    var due_date_count = 0;
    var j = 0;
    for (j = 0; j < dates.length; j++) {
        if (dates[j] === due_date) {
            due_date_count++;
        }
    }
    expect(due_date_count).toBe(2);
});

test('displays same date overdue count on page load(2)', () => {
    var due_date = "02/02/2021";
    var alldates = ['2021-03-02 18:00:00', '2021-03-02 15:00:00', '2021-02-02 12:00:00', '2021-05-02 15:00:00'];
    var dates = [];
    var i = 0;
    for (i = 0; i < alldates.length; i++) {
        var theDate = alldates[i].split(" ");
        var mmddyy = theDate[0].split("-");
        var format_due_date = mmddyy[1] + '/' + mmddyy[2] + '/' + mmddyy[0];
        dates.push(format_due_date);
    }
    var due_date_count = 0;
    var j = 0;
    for (j = 0; j < dates.length; j++) {
        if (dates[j] === due_date) {
            due_date_count++;
        }
    }
    expect(due_date_count).toBe(1);
});