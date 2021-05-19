//APP CONSTS
const key = "98f6e44fa80bfa8537e6fdad88b5f640";
const KELVIN = 273;

//Default view
getWeatherByCity("gdynia");

//SELECT ELEMENTS

// SET OF TEMPERATURE ELEMENTS
const tempValueElements = document.querySelectorAll(".temperature-value");

// HEADER SECTION
const themeSwitch = document.querySelector("input[name=themeSwitch]");
themeSwitch.addEventListener('change',function (){
  document.body.classList.toggle('dark-theme');
})
const scaleCheckBox = document.querySelector("input[name=scaleChange]");
const geoButton = document.getElementById("geoButton");
const searchButton = document.querySelector("#searchButton");
const deleteButton = document.querySelector("#deleteButton");
const input = document.querySelector(".inputValue");
// LEFT SECTION
const descriptionElement = document.querySelector(
  ".weather-info__description p"
);
const cityElement = document.querySelector(".weather-info__city p");
const dateElement = document.querySelector(".weather-info__date p");
const TimeElement = document.querySelector(".weather-info__time p");
const temperatureElement = document.querySelector(
  ".weather-info__temperature p"
);
const iconElement = document.querySelector(".weather-icon");

// RIGHT SECTION
const feelsLikeElement = document.getElementById("feels-like");
const humidityElement = document.getElementById("humidity");
const pressureElement = document.getElementById("pressure");
const windSpeedElement = document.getElementById("wind-speed");

//App data

let today = new Date();
let date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
let time = today.getHours() + ":" + today.getMinutes();
if (today.getMinutes() < 10) {
  time = today.getHours() + ":0" + today.getMinutes();
}

const weather = {
  nextDays: [[], [], [], [], [], [], [], []],
};

weather.temperature = {};
weather.dateAndTime = {
  date: date,
  time: time,
};

// Fraction to percentage conversion
function toPercentage(number) {
  return Math.trunc(number * 100) + "%";
}
// Unix time to day conversion
function getDay(timeStamp) {
  let a = new Date(timeStamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[a.getDay()];
}

//F to C conversion
function FahrenheitToCelsius(temperature) {
  return Math.round((temperature - 32) / 1.8);
}
// C to F conversion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}


// EVENTS
scaleCheckBox.addEventListener("change", function () {
  if (this.checked) {
    tempValueElements.forEach((el) => {
      let str = el.textContent;
      str = str.substring(0, str.indexOf("°")).trim();
      let number = parseInt(str);
      
      let fahrenheit = celsiusToFahrenheit(number);

      el.innerHTML = `${fahrenheit}°<span>F</span>`;
      
    });
  } else {
    tempValueElements.forEach((el) => {
      let str = el.textContent;
      str = str.substring(0, str.indexOf("°")).trim();
      let number = parseInt(str);
      
      let celsius = FahrenheitToCelsius(number);
      el.innerHTML = `${celsius}°<span>C</span>`;
    });
  }
});

geoButton.addEventListener("click", getLocation);
searchButton.addEventListener("click", getCity);
deleteButton.addEventListener("click", removeText);
function removeText() {
  input.value = "";
}
function getCity() {
  let city = input.value;
  getWeatherByCity(city);
  getForecast();
  removeText();
}

function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition);
  } else {
    alert("Browser doesn't Support Geolocation");
  }
}

// SET USER'S POSITION
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeatherByPosition(latitude, longitude);
  getForecast();
}

// 7 day forecast
function getForecast() {
  let lon = weather.longitude;
  let lat = weather.latitude;
  console.log("Latitude:" + lat);
  console.log("Longitude:" + lon);
  let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${key}`;
  fetch(api)
    .then(function (response) {
      let data = response.json();
      console.log(data);
      return data;
    })
    .then(function (data) {
      for (let i = 0; i < 8; i++) {
        weather.nextDays[i][0] = data.daily[i].dt;
        weather.nextDays[i][1] = data.daily[i].weather[0].icon;
        weather.nextDays[i][2] = data.daily[i].pop;
        weather.nextDays[i][3] = data.daily[i].humidity;
        weather.nextDays[i][4] = Math.floor(data.daily[i].temp.day - KELVIN);
      }
    })
    .then(function () {
      displayWeather();
    })
    .catch((err) => alert("Something went wrong"));
}

function getWeatherByPosition(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      console.log(data);
      return data;
    })
    .then(function (data) {
      console.log(data);
      weather.longitude = data.coord.lon;
      weather.latitude = data.coord.lat;
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.feelsLike = Math.floor(data.main.feels_like - KELVIN);
      weather.humidity = data.main.humidity;
      weather.pressure = data.main.pressure;
      weather.windSpeed = data.wind.speed;
    })
    .then(function () {
      displayWeather();
    });
}

function getWeatherByCity(city) {
  let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      console.log(data);
      return data;
    })
    .then(function (data) {
      weather.longitude = data.coord.lon;
      weather.latitude = data.coord.lat;
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.feelsLike = Math.floor(data.main.feels_like - KELVIN);
      weather.humidity = data.main.humidity;
      weather.pressure = data.main.pressure;
      weather.windSpeed = data.wind.speed;
    })
    .then(function () {
      getForecast();
      displayWeather();
      removeText();
    })
    .catch((err) => alert("Wrong city name!"));
}

function displayWeather() {
  // LEFT SECTION
  descriptionElement.innerHTML = weather.description.capitalize();
  cityElement.innerHTML = `${weather.city}, ${weather.country}`;
  dateElement.innerHTML = weather.dateAndTime.date;
  TimeElement.innerHTML = weather.dateAndTime.time;
  temperatureElement.innerHTML = `${weather.temperature.value} °<span>C</span>`;
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;

  // RIGHT SECTION
  feelsLikeElement.innerHTML = `${weather.feelsLike} °<span>C</span>`;
  humidityElement.innerHTML = `${weather.humidity} <span>%</span>`;
  pressureElement.innerHTML = `${weather.pressure} <span>hPa</span>`;
  windSpeedElement.innerHTML = `${weather.windSpeed} <span>km/h</span>`;

  // TABLE SECTION

  for (let i = 1; i < 8; i++) {
    //SHOWING DAY
    const dayElement = document.getElementById("day" + i);
    dayElement.innerHTML = getDay(weather.nextDays[i][0]);
    // SHOWING IMG
    const imgElement = document.getElementById("img" + i);
    imgElement.innerHTML = `<img class="imgIcon" src="icons/${weather.nextDays[i][1]}.png"/>`;
    // SHOWING CHANCE
    const chanceElement = document.getElementById("chance" + i);
    chanceElement.innerHTML = toPercentage(weather.nextDays[i][2]);
    // SHOWING HUMIDITY
    const humidityElement = document.getElementById("humidity" + i);
    humidityElement.innerHTML = weather.nextDays[i][3] + "%";
    // SHOWING TEMPERATURE
    const tempElement = document.getElementById("temp" + i);
    tempElement.innerHTML = weather.nextDays[i][4] + "°C";
  }
}
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
