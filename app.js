//APP CONSTS
const key = "98f6e44fa80bfa8537e6fdad88b5f640";
const KELVIN = 273;

//Default view
getWeatherByCity("gdynia");

//SELECT ELEMENTS


const tempValueElements = document.querySelectorAll(".temperature-value");

// HEADER SECTION
const geoButton = document.getElementById('geoButton');
const searchButton = document.querySelector("#searchButton");
const deleteButton = document.querySelector("#deleteButton")
const input = document.querySelector(".inputValue");
// LEFT SECTION
const descriptionElement = document.querySelector(".weather-info__description p");
const cityElement = document.querySelector(".weather-info__city p");
const dateElement = document.querySelector(".weather-info__date p");
const TimeElement = document.querySelector(".weather-info__time p");
const temperatureElement = document.querySelector(".weather-info__temperature p");
const iconElement = document.querySelector(".weather-icon");

// RIGHT SECTION
const feelsLikeElement = document.getElementById("feels-like");
const humidityElement = document.getElementById("humidity");
const pressureElement = document.getElementById("pressure");
const windSpeedElement = document.getElementById("wind-speed");



//App data
let today = new Date();
let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes();
if(today.getMinutes()<10){
    time = today.getHours() + ":0" +  today.getMinutes()
}


const weather = {};
weather.temperature = {
    
    
}
weather.dateAndTime = {
    date : date, 
    time : time
}

// EVENTS


// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

const scaleCheckBox = document.querySelector("input[name=scaleChange]");
scaleCheckBox.addEventListener('change', function() {
    if(this.checked) {
        
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        
        tempValueElements.forEach(el => {
            el.innerHTML= `${fahrenheit}°<span>F</span>`;
        })

    }
    else {
        tempValueElements.forEach(el => {
            el.innerHTML= `${weather.temperature.value}°<span>C</span>`;
        })
        
        
    }
});




geoButton.addEventListener('click',getLocation);
searchButton.addEventListener('click',getCity)
deleteButton.addEventListener('click',removeText);
function removeText() {
    input.value="";
}
function getCity(){
    let city= input.value
    getWeatherByCity(city);
    removeText();
}

function getLocation(){
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(setPosition);
    }else{
        alert("Browser doesn't Support Geolocation");
    }
    console.log("clicked")
}

   // SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(longitude);
    console.log(latitude);
    getWeatherByPosition(latitude, longitude);
}


function getWeatherByPosition(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log(data);
            return data;
        })
        .then(function(data){
            console.log(data);
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
        .then(function(){
            displayWeather();
            
        });
}

function getWeatherByCity(city){
    let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log(data);
            return data;
        })
        .then(function(data){
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
        .then(function(){
            displayWeather();
            removeText();
        })
        .catch(err => alert("Wrong city name!"));
}





function displayWeather(){
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
    
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}