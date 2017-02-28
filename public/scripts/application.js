'use strict';

const monthNames = [
"January", "February", "March", "April", "May", "June", "July",
"August", "September", "October", "November", "December"
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function DateTile(date) {
    this.date  = date;
    this.day   = date.getDate();
    this.dow   = date.getDay();
    this.month = date.getMonth();
    this.year  = date.getFullYear();
}

DateTile.prototype = {

    get monthName () {
        return monthNames[this.month];
    },

    dateString: function (delimiter) {
        delimiter = delimiter || '/';
        return [this.month + 1, this.day, this.year].join(delimiter);
    },

    constructTile: function () {
        let inner = '<div class="month">' + this.monthName + '</div>' +
                    '<div class="day">' + this.day + '</div>' +
                    '<div class="year">' + this.year + '</div>';

        return '<li class="date">' + inner + '</li>'
    }
}

function chunkWeeks(dates) {
    let weeks = [];
    for (var i = 0; i < 5; i++) {
        let days = dates.slice(i * 7, 7 + (7*i));
        if (days.length) {
            weeks.push(days);
        }
    }
    return weeks;
}

function constructWeeks (dates) {
    let firstDay = dates[0].dow;
    let monthName = dates[0].monthName.toLowerCase();
    let month = [];
    if (firstDay > 0) {
        let weekPad = new Array(firstDay).fill(null);
        dates = weekPad.concat(dates);
    }

    let weeks = chunkWeeks(dates);

    for (let i in weeks) {
        let singleWeek = weeks[i];
        let weekHtml = '';
        for (let i in singleWeek) {
            let date = singleWeek[i];
            let week = date === null ? '<li class="date none"></li>' : date.constructTile();
            weekHtml += week;
        }
        month.push('<ul class="week-' + i + '">' + weekHtml + '</ul>');
    }

    return '<div class="' + monthName + '">' + month.join('') + '</div>';
}

function getDateRange() {
    let start = new Date(startDateEl.value),
        end   = new Date(endDateEl.value),
        count = 0;

    let daysOfYear = {};
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        count++;
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

    countEl.textContent = 'Day Count: ' + count;
    outputEl.innerHTML = output;
}

let startDateEl  = document.getElementById('start'),
    endDateEl    = document.getElementById('end'),
    dateSubmit   = document.getElementById('submit-dates'),
    countEl      = document.getElementById('date-count'),
    outputEl     = document.getElementById('json-dates'),
    defaultEnd   = new Date(),
    defaultStart = new Date(defaultEnd.getFullYear(), '0', '1');

startDateEl.value = new DateTile(defaultStart).dateString();
endDateEl.value   = new DateTile(defaultEnd).dateString();
dateSubmit.addEventListener('click', getDateRange);
getDateRange();
