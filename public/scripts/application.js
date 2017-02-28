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

let startDateEl  = document.getElementById('start'),
    endDateEl    = document.getElementById('end'),
    dateSubmit   = document.getElementById('submit-dates'),
    outputEl     = document.getElementById('json-dates'),
    defaultEnd   = new Date('2016', '11', '31'),
    defaultStart = new Date('2016', '0', '1');

startDateEl.value = new DateTile(defaultStart).dateString();
endDateEl.value   = new DateTile(defaultEnd).dateString();
getDateRange();

dateSubmit.addEventListener('click', getDateRange);

function checkForMonthEnd (dates) {
    if (dates[0]) {
        let currentMonth = dates[0].monthName;
    }
    return dates.filter(function(date) {
        return date.monthName === currentMonth;
    });
}

function constructWeeks (dates) {
    let firstDay = dates[0].dow;
    let week = [];
    if (firstDay > 0) {
        let weekPad = new Array(firstDay).fill(null);
        dates = weekPad.concat(dates);
    }

    for (let i in dates) {
        let date = dates[i];
        let list = date === null ? '<li class="date"></li>' : date.constructTile();
        week.push(list);
    }
    return '<span class="clearfix"><ul>' + week.join('') + '</ul>';
}

function getDateRange() {
    let start = new Date(startDateEl.value),
        end   = new Date(endDateEl.value);

    let daysOfYear = {};
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        let date = new DateTile(new Date(d));
        if (!daysOfYear.hasOwnProperty(date.year)) {
            daysOfYear[date.year] = {};
        }
        if (!daysOfYear[date.year].hasOwnProperty(date.month)) {
            daysOfYear[date.year][date.month] = [];
        }
        daysOfYear[date.year][date.month].push(date);
    }

    let output = '';
    for (let i in daysOfYear) {
        let year = daysOfYear[i];
        for (let j in year) {
            let month = year[j];
            output += constructWeeks(month);
        }
    }

    outputEl.innerHTML = output;
}
