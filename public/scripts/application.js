'use strict';

const _monthNames = [
"January", "February", "March", "April", "May", "June", "July",
"August", "September", "October", "November", "December"
];

const _dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function DateTile(date) {
    this.date  = date;
    this.day   = date.getDate();
    this.dow   = date.getDay();
    this.month = date.getMonth();
    this.year  = date.getFullYear();
}

DateTile.prototype = {

    get monthName () {
        return _monthNames[this.month];
    },

    dateString: function (delimiter) {
        delimiter = delimiter || '/';
        return [this.month + 1, this.day, this.year].join(delimiter);
    },

    constructTile: function () {
        let inner = '<div class="month">' + this.monthName + '</div>' +
                    '<div class="day">' + this.day + '</div>' +
                    '<div class="year">' + this.year + '</div>';

        return '<li class="date '+ this.monthName.toLowerCase() +'">' + inner + '</li>'
    }
}

var startDateEl  = document.getElementById('start'),
    endDateEl    = document.getElementById('end'),
    dateSubmit   = document.getElementById('submit-dates'),
    outputEl     = document.getElementById('json-dates'),
    defaultEnd   = new Date('2016', '11', '31'),
    defaultStart = new Date('2016', '0', '1');

startDateEl.value = new DateTile(defaultStart).dateString();
endDateEl.value   = new DateTile(defaultEnd).dateString();
getDateRange();

dateSubmit.addEventListener('click', getDateRange);

function constructWeek (dates) {
    var week = [];
    for (let i in dates) {
        let date = dates[i];
        if (date === null) {
            week.push('<li class="date"></li>')
        } else {
            week.push(date.constructTile());
        }
    }
    return '<ul>' + week.join('') + '</ul>';
}

function getDateRange() {
    let start = new Date(startDateEl.value),
        end   = new Date(endDateEl.value);

    let daysOfYear = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        daysOfYear.push(new DateTile(new Date(d)));
    }

    let firstDay = daysOfYear[0].dow;
    if (firstDay > 0) {
        let weekPad = new Array(firstDay).fill(null);
        daysOfYear = weekPad.concat(daysOfYear);
    }

    let weeksOfYear = [];
    while (daysOfYear.length > 0) {
        weeksOfYear.push(constructWeek(daysOfYear.splice(0,7)));
    }
    outputEl.innerHTML = weeksOfYear.join(' ');
}
