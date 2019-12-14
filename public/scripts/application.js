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

function zeroPad(num) {
  return `0${num}`.slice(-2);
}

function dateString({ month, day, year }) {
  return [year, zeroPad(month + 1), zeroPad(day)].join("-");
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
    <div class="month ${firstDay.monthName.toLowerCase()}" id="${firstDay.monthName.toLowerCase()}-${
    firstDay.year
  }">
        <div class="month--name">${firstDay.monthName} ${firstDay.year}</div>
        <div class="month--header">${WEEK_DAY_ELEMENTS}</div>
        <div class="month--grid">${buildMonthGrid(dates)}</div>
    </div>`;
}

function getDateRange() {
  const start = new Date(startEl.value.split("-"));
  const end = new Date(endEl.value.split("-"));
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

  const output = {
    grid: "",
    list: ""
  };

  Object.keys(daysOfYear).reduce((el, year) => {
    for (let j in daysOfYear[year]) {
      let month = daysOfYear[year][j];
      el.grid += buildMonth(month);
      const monthName = MONTH_NAMES[j];
      el.list += `<div class='${monthName.toLowerCase()} list'>
        <a href='#${monthName.toLowerCase()}-${year}'>${monthName} ${year}</a>
      </div>`;
    }
    return el;
  }, output);

  countEl.textContent = `Day Count: ${countDays}`;
  dateListEl.innerHTML = output.list;
  calendarEl.innerHTML = output.grid;
}

const dateSubmit = document.getElementById("dates-form");
const { start: startEl, end: endEl } = dateSubmit;

const countEl = document.getElementById("date-count");
const dateListEl = document.getElementById("date-list");
const calendarEl = document.getElementById("json-dates");

const defaultEnd = new Date();
const defaultStart = new Date(defaultEnd.getFullYear(), 0);

startEl.value = dateString(dateTile(defaultStart));
endEl.value = dateString(dateTile(defaultEnd));

dateSubmit.addEventListener("submit", e => {
  e.preventDefault();
  getDateRange();
});

getDateRange();
