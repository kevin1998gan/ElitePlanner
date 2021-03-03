'use strict';

test('displays today count on page load', () => {
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