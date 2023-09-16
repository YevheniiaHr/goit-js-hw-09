import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';
const input = document.querySelector('#datetime-picker');
const btn = document.querySelector('[data-start]');
const daysSel = document.querySelector('[data-days]');
const hoursSel = document.querySelector('[data-hours]');
const minutesSel = document.querySelector('[data-minutes]');
const secondsSel = document.querySelector('[data-seconds]');

let timeDifference = 0;
let formatDate = null;
let timerId = null;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    differenceDate(selectedDates[0]);
  },
};
btn.disabled = true;

flatpickr('#datetime-picker', options);

btn.addEventListener('click', clickOn);

function clickOn(e) {
  timerId = setInterval(() => {
    btn.disabled = true;
    timeDifference -= 1000;
    if (secondsSel.textContent <= 0 && minutesSel.textContent <= 0) {
      Notiflix.Notify.success('Time end');
      clearInterval(timerId);
    } else {
      formatDate = convertMs(timeDifference);
      renderDate(formatDate);
    }
  }, 1000);
}

function differenceDate(selectedDates) {
  const currentDate = Date.now();
  if (selectedDates < currentDate) {
    btn.disabled = true;
    return Notiflix.Notify.failure('Please choose a date in the future');
  }
  timeDifference = selectedDates - currentDate;
  formatDate = convertMs(timeDifference);
  renderDate(formatDate);
  btn.disabled = false;
}

function renderDate(formatDate) {
  secondsSel.textContent = formatDate.seconds;
  minutesSel.textContent = formatDate.minutes;
  hoursSel.textContent = formatDate.hours;
  daysSel.textContent = formatDate.days;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
  addLeadingZero();
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
