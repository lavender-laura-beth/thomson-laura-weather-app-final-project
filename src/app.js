let now = new Date();
let h4 = document.querySelector("#date-and-time");

let days = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
let day = days[now.getDay()];
let date = now.getDate();

let months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sept",
  "oct",
  "nov",
  "dec",
];

let month = months[now.getMonth()];

let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

h4.innerHTML = `${day}, ${month} ${date} | ${hours}:${minutes} `;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  weekDays.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col-2 text-center">
          <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
          <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
          />
          <div class="weather-forecast-temperature">
          <span class= "weather-forecast-temperature-min">
          ${Math.round(forecastDay.temp.min)}°
          </span> 
          | 
          <span class= "weather-forecast-temperature-max">
            ${Math.round(forecastDay.temp.max)}°
          </span>
          </div>
        </div>
        `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "73ff2a59c2dc5fd1e27fc5c64c2da1b5";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function cityTemperature(response) {
  let temperatureElement = document.querySelector("#degrees");
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");

  fahrenheitTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].main;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0]).description;

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "73ff2a59c2dc5fd1e27fc5c64c2da1b5";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial`;

  axios.get(`${url}&appid=${apiKey}`).then(cityTemperature);
}

function searchCurrentLocation(position) {
  let apiKey = "73ff2a59c2dc5fd1e27fc5c64c2da1b5";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;

  axios.get(url).then(cityTemperature);
}

function citySubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-search").value;
  searchCity(city);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#degrees");

  celsiusLink.classList.add("active", "pe-none");
  fahrenheitLink.classList.remove("active", "pe-none");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#degrees");

  celsiusLink.classList.remove("active", "pe-none");
  fahrenheitLink.classList.add("active", "pe-none");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

let fahrenheitTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", citySubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

searchCity("Nashville");
