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
  "December",
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const WEEK_DAY_ELEMENTS = DAY_NAMES.map(
  (day) => `<div class="month--header-day">${day}</div>`
).join("");

const observerEl = document.getElementById("json-dates");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const { isIntersecting } = entry;
      entry.target.classList.toggle("not-intersecting", !isIntersecting);
    });
  },
  { root: observerEl, threshold: 0.2 }
);

function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return dateString({ month, year, day });
}

function zeroPad(num) {
  return `0${num}`.slice(-2);
}

function dateString({ month, day, year }) {
  return [year, zeroPad(month + 1), zeroPad(day)].join("-");
}

class Month {
  constructor(month, year) {
    const date = new Date(year, month);
    this.dow = date.getDay();
    this.month = month;
    this.year = year;
    this.dayCount = new Date(year, month + 1, 0).getDate();
    this.monthName = MONTH_NAMES[date.getMonth()];
  }

  render(startDate, endDate) {
    let days = [];
    for (let i = 1; i <= this.dayCount; i++) {
      const isOutOfRange = i < startDate || i > endDate;
      days.push(
        `<div class='week--tile'>
          <div class="flip${isOutOfRange ? " fade" : ""}" data-date='${zeroPad(
          this.year
        )}${zeroPad(this.month + 1)}${zeroPad(i)}'>
            <div class='front'>${i}</div>
            <div class='back'></div>
          </div>
        </div>`
      );
    }
    if (this.dow > 0) {
      const weekPad = new Array(this.dow).fill(
        '<div class="week--tile none"></div>'
      );
      days = weekPad.concat(days);
    }

    return `
    <div class="month ${this.monthName.toLowerCase()}" id="${this.monthName.toLowerCase()}-${
      this.year
    }">
      <div class="month--name">${this.monthName} ${this.year}</div>
      <div class="month--header">${WEEK_DAY_ELEMENTS}</div>
      <div class="month--grid">${days.join("")}</div>
    </div>`;
  }
}

class Calendar {
  constructor() {
    const dateSubmit = document.getElementById("dates-form");
    const { start, end } = dateSubmit;

    this.startEl = start;
    this.endEl = end;
    this.countEl = document.getElementById("date-count");
    this.dateListEl = document.getElementById("date-list");
    this.calendarEl = document.getElementById("json-dates");

    const defaultEnd = new Date();
    const defaultStart = new Date(defaultEnd.getFullYear() - 1, 0);

    this.startEl.value = formatDate(defaultStart);
    this.endEl.value = formatDate(defaultEnd);

    dateSubmit.addEventListener("submit", (e) => {
      e.preventDefault();
      this.getDateRange();
    });

    this.getDateRange();
  }

  getDateValues() {
    const [startYear, startMonth, startDay] = this.startEl.value.split("-");
    const [endYear, endMonth, endDay] = this.endEl.value.split("-");
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    return { start, end };
  }

  dayRange(start, end, month) {
    const range = { start: 1, end: month.dayCount };
    if (
      month.year === start.getFullYear() &&
      month.month === start.getMonth()
    ) {
      range.start = start.getDate();
    }
    if (month.year === end.getFullYear() && month.month === end.getMonth()) {
      range.end = end.getDate();
    }
    return range;
  }

  getDateRange() {
    const { start, end } = this.getDateValues();
    const months = [];
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    for (let year = startYear; year <= endYear; year++) {
      const monthStart = year === startYear ? startMonth : 0;
      const monthEnd = year === endYear ? endMonth : 11;

      for (let month = monthStart; month <= monthEnd; month++) {
        if (year >= endYear && month > endMonth) {
          break;
        }
        const tile = new Month(month, year);
        months.push(tile);
      }
    }

    this.renderCalendar(months);
  }

  addRotateListener() {
    const flips = document.querySelectorAll(".flip");
    flips.forEach((el) => {
      el.addEventListener("click", (event) => {
        const tile = event.currentTarget;
        const rotated = document.querySelector(".rotate");
        if (rotated) {
          rotated.classList.remove("rotate");
        }
        if (tile === rotated) {
          return;
        }
        const date = tile.dataset.date;
        const backTile = tile.querySelector(".back");

        if (!backTile.querySelector("a")) {
          const apodLink = document.createElement("a");
          apodLink.setAttribute("target", "_blank");
          apodLink.setAttribute("rel", "noopener noreferrer");
          apodLink.setAttribute(
            "href",
            `https://apod.nasa.gov/apod/ap${date}.html`
          );
          const apodImage = document.createElement("img");
          apodImage.setAttribute(
            "src",
            `https://apod.nasa.gov/apod/calendar/S_${date}.jpg`
          );
          apodLink.appendChild(apodImage);
          backTile.appendChild(apodLink);
        }
        tile.classList.add("rotate");
      });
    });
  }

  renderCalendar(months) {
    const { start, end } = this.getDateValues();
    let countDays = 0;
    const output = {
      grid: "",
      list: "",
    };

    let finishDay = 0;
    months.reduce((el, month) => {
      const { start: startDay, end: endDay } = this.dayRange(start, end, month);
      const { year, monthName } = month;
      const renderedMonth = month.render(startDay, endDay);
      el.grid += renderedMonth;
      el.list += `<div class='${monthName.toLowerCase()} list'>
    <a href='#${monthName.toLowerCase()}-${year}'>${monthName} ${year}</a>
    </div>`;

      countDays += month.dayCount;
      finishDay = month.dayCount - endDay;
      return el;
    }, output);

    this.countEl.textContent = `Day Count: ${
      countDays - (start.getDate() - 1 + finishDay)
    }`;
    this.dateListEl.innerHTML = output.list;
    this.calendarEl.innerHTML = output.grid;
    this.calendarEl.querySelectorAll(".month").forEach((m) => {
      observer.observe(m);
    });
    this.addRotateListener();
  }
}

new Calendar();
