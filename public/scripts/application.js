'use strict';

var startDateEl  = document.getElementById('start'),
    endDateEl    = document.getElementById('end'),
    dateSubmit   = document.getElementById('submit-dates'),
    outputEl     = document.getElementById('json-dates'),
    defaultEnd   = new Date(),
    defaultStart = new Date(defaultEnd.getFullYear(), '0', '1');

startDateEl.value = getDateString(defaultStart);
endDateEl.value   = getDateString(defaultEnd);

dateSubmit.addEventListener('click', getDateRange);

function getDateString(date, delimiter) {
    date      = date || new Date();
    delimiter = delimiter || '/';

    var day   = date.getDate(),
        month = date.getMonth() + 1,
        year  = date.getFullYear();

    return [month, day, year].join(delimiter);
}

function getDateRange() {
    var start = new Date(startDateEl.value),
        end   = new Date(endDateEl.value);

    var daysOfYear = [];
    for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
        daysOfYear.push('<p class="date">' + getDateString(new Date(d)) + '</p>');
    }
    outputEl.innerHTML = daysOfYear.join(' ');
}
