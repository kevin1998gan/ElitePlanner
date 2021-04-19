'use strict';

test('displays overdue count on page load', () => {
    var overdue_count = 0;
    var alldates = ['2021-03-02 18:00:00', '2021-03-02 18:00:00', '2021-02-02 12:00:00', '2021-05-02 15:00:00'];
    var progress = ['100', '30', '25', '34']
    var dateTime = "2021-03-02 18:01:00";
    var i = 0;
    for (i = 0; i < alldates.length; i++) {
        if (Date.parse(alldates[i]) < Date.parse(dateTime) && progress[i] < 100) {
            overdue_count++;
        }
    }

    expect(overdue_count).toBe(2);
});

test('displays overdue count on page load and get incomplete count', () => {
    var overdue_count = 0;
    var alldates = ['2021-03-02 18:00:00', '2021-03-02 18:00:00', '2021-02-02 12:00:00', '2021-05-02 15:00:00'];
    var progress = ['100', '30', '25', '34']
    var dateTime = "2021-03-02 18:01:00";
    var incomplete_count = 0;
    var count = 0;
    var i = 0;
    for (i = 0; i < alldates.length; i++) {
        if (Date.parse(alldates[i]) < Date.parse(dateTime) && progress[i] < 100) {
            overdue_count++;
        }
    }

    for (i = 0; i < progress.length; i++) {
        if (progress[i] < 100) {
            incomplete_count++;
        }
    }

    expect(overdue_count).toBe(2);
    expect(incomplete_count-overdue_count).toBe(1);
});