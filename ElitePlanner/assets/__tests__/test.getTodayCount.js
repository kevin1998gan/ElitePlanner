'use strict';

test('displays today count on page load', () => {
    var dates = ['03/02/2021', '03/02/2021', '02/02/2021'];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    var today_count = 0;
    var i = 0;
    for (i = 0; i < dates.length; i++) {
        if (dates[i] === today) {
            today_count++;
        }
    }
    expect(today_count).toBe(2);
});