import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const datetimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const timer = document.querySelector(".timer");

// Функція для перевірки, чи обрана дата в майбутньому
function isFutureDate(selectedDates) {
  const selectedDate = selectedDates[0];
  const currentDate = new Date();

  return selectedDate > currentDate;
}

// Налаштування календаря flatpickr
flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: function (selectedDates) {
    if (!isFutureDate(selectedDates)) {
      Notiflix.Report.failure(
        "Ooops...",
        "Please choose a date in the future.",
        "Okay"
      );
      startButton.disabled = true;
    } else {
      Notiflix.Report.success(
        "Congratulation!",
        "Click on Start to begin the countdown.",
        "Okay"
      );
      startButton.disabled = false;
    }
  },
});

let countdownInterval;

// Функція для розрахунку залишкового часу
function calculateTimeRemaining(endTime) {
  const currentTime = new Date();
  const timeDifference = endTime - currentTime;

  if (timeDifference <= 0) {
    clearInterval(countdownInterval);
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const seconds = Math.floor((timeDifference / 1000) % 60);
  const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds };
}

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

// Функція для оновлення інтерфейсу таймера
function updateTimerDisplay(endTime) {
  const timeRemaining = calculateTimeRemaining(endTime);

  timer.querySelector("[data-days]").textContent = addLeadingZero(
    timeRemaining.days
  );
  timer.querySelector("[data-hours]").textContent = addLeadingZero(
    timeRemaining.hours
  );
  timer.querySelector("[data-minutes]").textContent = addLeadingZero(
    timeRemaining.minutes
  );
  timer.querySelector("[data-seconds]").textContent = addLeadingZero(
    timeRemaining.seconds
  );
}

// Обробник події для кнопки "Start"
startButton.addEventListener("click", function () {
  const selectedDate = new Date(datetimePicker.value);
  const endTime = selectedDate.getTime();

  countdownInterval = setInterval(function () {
    updateTimerDisplay(endTime);
  }, 1000);

  startButton.disabled = true;
  datetimePicker.disabled = true;
});

// Ініціалізація бібліотеки Notiflix
Notiflix.Init({ useGoogleFont: false });
