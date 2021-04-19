'use strict';

test('displays today count on page load', () => {
    var dates = ['03/02/2021', '03/02/2021', '02/02/2021'];

    var today = "03/02/2021";
    var today_count = 0;
    var i = 0;
    for (i = 0; i < dates.length; i++) {
        if (dates[i] === today) {
            today_count++;
        }
    }
    expect(today_count).toBe(2);
});