"use strict";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const WEEK_DAY_ELEMENTS = DAY_NAMES.map(
  day => `<div class="month--header-day">${day}</div>`
).join("");

function dateString({ month, day, year }) {
  return [month + 1, day, year].join("/");
}

function dateTile(date) {
  return {
    day: date.getDate(),
    dow: date.getDay(),
    month: date.getMonth(),
    year: date.getFullYear(),
    monthName: MONTH_NAMES[date.getMonth()]
  };
}

function buildMonthGrid(dates) {
  return dates
    .map(date =>
      date === null
        ? '<div class="week--tile none"></div>'
        : `<div class="week--tile">${date.day}</div>`
    )
    .join("");
}

function buildMonth(dates) {
  const firstDay = dates[0];
  if (firstDay.dow > 0) {
    const weekPad = new Array(firstDay.dow).fill(null);
    dates = weekPad.concat(dates);
  }

  return `
    <div class="month ${firstDay.monthName.toLowerCase()}">
        <div class="month--name">${firstDay.monthName} ${firstDay.year}</div>
        <div class="month--header">${WEEK_DAY_ELEMENTS}</div>
        <div class="month--grid">${buildMonthGrid(dates)}</div>
    </div>`;
}

function getDateRange() {
  const start = new Date(startDateEl.value);
  const end = new Date(endDateEl.value);
  let countDays = 0;

  const daysOfYear = {};
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const tile = dateTile(date);

    if (!daysOfYear.hasOwnProperty(tile.year)) {
      daysOfYear[tile.year] = {};
    }

    if (!daysOfYear[tile.year].hasOwnProperty(tile.month)) {
      daysOfYear[tile.year][tile.month] = [];
    }

    daysOfYear[tile.year][tile.month].push(tile);
    countDays++;
  }

  countEl.textContent = `Day Count: ${countDays}`;
  calendarEl.innerHTML = Object.keys(daysOfYear).reduce((output, year) => {
    for (let j in daysOfYear[year]) {
      let month = daysOfYear[year][j];
      output += buildMonth(month);
    }
    return output;
  }, "");
}

const startDateEl = document.getElementById("start");
const endDateEl = document.getElementById("end");
const dateSubmit = document.getElementById("submit-dates");
const countEl = document.getElementById("date-count");
const calendarEl = document.getElementById("json-dates");
const defaultEnd = new Date();
const defaultStart = new Date(
  defaultEnd.getFullYear() - 1,
  defaultEnd.getMonth()
);

startDateEl.value = dateString(dateTile(defaultStart));
endDateEl.value = dateString(dateTile(defaultEnd));
dateSubmit.addEventListener("click", getDateRange);
getDateRange();
