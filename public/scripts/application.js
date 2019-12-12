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

class DateTile {
  constructor(date = new Date()) {
    this.day = date.getDate();
    this.dow = date.getDay();
    this.month = date.getMonth();
    this.year = date.getFullYear();
  }

  get monthName() {
    return MONTH_NAMES[this.month];
  }

  dateString = delimiter => {
    delimiter = delimiter || "/";
    return [this.month + 1, this.day, this.year].join(delimiter);
  };

  buildTile = () => `<div class="week--tile">${this.day}</div>`;
}

function buildMonthGrid(dates) {
  return dates
    .map(day =>
      day === null ? '<div class="week--tile none"></div>' : day.buildTile()
    )
    .join("");
}

function buildMonth(dates) {
  let firstDay = dates[0];
  if (firstDay.dow > 0) {
    let weekPad = new Array(firstDay.dow).fill(null);
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
    const tile = new DateTile(new Date(date));

    if (!daysOfYear.hasOwnProperty(tile.year)) {
      daysOfYear[tile.year] = {};
    }

    if (!daysOfYear[tile.year].hasOwnProperty(tile.month)) {
      daysOfYear[tile.year][tile.month] = [];
    }

    daysOfYear[tile.year][tile.month].push(tile);
    countDays++;
  }

  let output = Object.keys(daysOfYear).reduce((output, year) => {
    for (let j in daysOfYear[year]) {
      let month = daysOfYear[year][j];
      output += buildMonth(month);
    }
    return output;
  }, "");

  countEl.textContent = "Day Count: " + countDays;
  outputEl.innerHTML = output;
}

const startDateEl = document.getElementById("start");
const endDateEl = document.getElementById("end");
const dateSubmit = document.getElementById("submit-dates");
const countEl = document.getElementById("date-count");
const outputEl = document.getElementById("json-dates");
const defaultEnd = new Date();
const defaultStart = new Date(
  defaultEnd.getFullYear() - 1,
  defaultEnd.getMonth(),
  "1"
);

startDateEl.value = new DateTile(defaultStart).dateString();
endDateEl.value = new DateTile().dateString();
dateSubmit.addEventListener("click", getDateRange);
getDateRange();
