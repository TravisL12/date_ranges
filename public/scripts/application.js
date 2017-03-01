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

    buildTile: function () {
        let inner = '<div class="day">' + this.day + '</div>' +
                    '<div class="year">' + this.monthName + ' ' + this.year + '</div>';

        return '<li class="date-tile">' + inner + '</li>'
    }
}

function chunkWeeks(dates) {
    let weeks = [];
    let weekCount = Math.ceil(dates.length / 7);
    for (var i = 0; i < weekCount; i++) {
        let weekIdx = i * 7;
        let days = dates.slice(weekIdx, weekIdx + 7);
        if (days.length) {
            weeks.push(days);
        }
    }
    return weeks;
}

function buildMonth (dates) {
    return chunkWeeks(dates).reduce(function(pMonth, cMonth, i) {
        let weekHtml = cMonth.reduce(function(pDate, cDate) {
            return pDate += cDate === null ? '<li class="date-tile none"></li>' : cDate.buildTile();
        }, '')

        pMonth.push('<ul class="week week-' + i + '">' + weekHtml + '</ul>');
        return pMonth;
    }, []).join('');    
}

function buildWeeks (dates) {
    let firstDay  = dates[0];
    let monthName = firstDay.monthName;
    if (firstDay.dow > 0) {
        let weekPad = new Array(firstDay.dow).fill(null);
        dates = weekPad.concat(dates);
    }

    let month = buildMonth(dates);
    let header = dayNames.map((day) => {
        return '<div>' + day + '</div>';
    }).join('');

    return  '<div class="month ' + monthName.toLowerCase() + '">' +
                '<div class="day-header">' + header + '</div>' + month + 
            '</div>';
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
            output += buildWeeks(month);
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
    defaultStart = new Date(defaultEnd.getFullYear() - 1, defaultEnd.getMonth(), '1');

startDateEl.value = new DateTile(defaultStart).dateString();
endDateEl.value   = new DateTile(defaultEnd).dateString();
dateSubmit.addEventListener('click', getDateRange);
getDateRange();
