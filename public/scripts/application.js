"use strict";

const monthNames = [
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

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

class DateTile {
  constructor(date) {
    this.day = date.getDate();
    this.dow = date.getDay();
    this.month = date.getMonth();
    this.year = date.getFullYear();
  }

  get monthName() {
    return monthNames[this.month];
  }

  dateString = delimiter => {
    delimiter = delimiter || "/";
    return [this.month + 1, this.day, this.year].join(delimiter);
  };

  buildTile = () =>
    `<li class="week--tile"><div class="week--tile-day">${this.day}</div></li>`;
}

function chunkWeeks(dates) {
  let weeks = [];
  let weekCount = Math.ceil(dates.length / 7);
  for (var i = 0; i < weekCount; i++) {
    let weekIdx = i * 7;
    let days = dates.slice(weekIdx, weekIdx + 7);
    weeks.push(days);
  }
  return weeks;
}

function buildWeeks(dates) {
  return chunkWeeks(dates)
    .reduce((pMonth, cMonth, i) => {
      let weekHtml = cMonth.reduce((pDate, cDate) => {
        return (pDate +=
          cDate === null
            ? '<li class="week--tile none"></li>'
            : cDate.buildTile());
      }, "");

      pMonth.push(`<ul class="week week-${i}">${weekHtml}</ul>`);
      return pMonth;
    }, [])
    .join("");
}

function buildMonth(dates) {
  let firstDay = dates[0];
  if (firstDay.dow > 0) {
    let weekPad = new Array(firstDay.dow).fill(null);
    dates = weekPad.concat(dates);
  }

  let header = dayNames
    .map(day => {
      return `<div class="month--header-day">${day}</div>`;
    })
    .join("");

  return `
    <div class="month ${firstDay.monthName.toLowerCase()}">
        <div class="month--name">${firstDay.monthName} ${firstDay.year}</div>
        <div class="month--header">${header}</div>
        ${buildWeeks(dates)}
    </div>`;
}

function getDateRange() {
  const start = new Date(startDateEl.value);
  const end = new Date(endDateEl.value);
  let countDays = 0;

  const daysOfYear = {};
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    let tile = new DateTile(new Date(date));

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

let startDateEl = document.getElementById("start"),
  endDateEl = document.getElementById("end"),
  dateSubmit = document.getElementById("submit-dates"),
  countEl = document.getElementById("date-count"),
  outputEl = document.getElementById("json-dates"),
  defaultEnd = new Date(),
  defaultStart = new Date(
    defaultEnd.getFullYear() - 1,
    defaultEnd.getMonth(),
    "1"
  );

startDateEl.value = new DateTile(defaultStart).dateString();
endDateEl.value = new DateTile(defaultEnd).dateString();
dateSubmit.addEventListener("click", getDateRange);
getDateRange();
