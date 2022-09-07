import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic
function getWeather(city) {
  let promise = WeatherService.getWeather(city);
  promise.then(function(weatherDataArray) {
    printElements(weatherDataArray);
  }, function(errorArray) {
    printError(errorArray);
  });
}

function getWeatherPartTwo(lat, long) {
  let promise = new Promise(function(resolve, reject) {
  let request = new XMLHttpRequest();
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.API_KEY}`;

  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      resolve([response, lat, long]);
    } else {
      reject([this, response, lat, long]);
    }
  });

  request.open("GET", url, true);
  request.send();
});

promise.then(function(weatherDataArray) {
  printElementsTwo(weatherDataArray);
}, function(errorArray) {
  printErrorTwo(errorArray);
});
}
// UI Logic


function printElementsTwo(data) {
  document.querySelector('#showResponse').innerText = `The humidity in lat ${data[1]} and long ${data[2]} is ${data[0].main.humidity}%. 
  The temperature in Farenheit is ${1.8*(data[1].main.temp-273) + 32} degrees. It feels like ${1.8*(data[2].main.feels_like-273) + 32} Farenheit.`;
}

function printErrorTwo(error) {
  document.querySelector('#showResponse').innerText = `There was an error accessing the weather data for lat ${error[2]} and long ${error[3]}: ${error[0].status} ${error[0].statusText}: ${error[1].message}`;
}


function printElements(data) {
  document.querySelector('#showResponse').innerText = `The humidity in ${data[1]} is ${data[0].main.humidity}%. 
  The temperature in Farenheit is ${1.8*(data[0].main.temp-273) + 32} degrees. It feels like ${1.8*(data[0].main.feels_like-273) + 32} Farenheit.`;
}

function printError(error) {
  document.querySelector('#showResponse').innerText = `There was an error accessing the weather data for ${error[2]}: ${error[0].status} ${error[0].statusText}: ${error[1].message}`;
}

function handleFormSubmission(event) {
  event.preventDefault();
  const city = document.querySelector('#location').value;
  const lat = parseInt(document.querySelector('#lat').value);
  const long = parseInt(document.querySelector('#long').value);
  document.querySelector('#location').value = null;
  document.querySelector('#lat').value = null;
  document.querySelector('#long').value = null;
  getWeather(city);
  getWeatherPartTwo(lat, long);
}

window.addEventListener("load", function() {
  document.querySelector('form').addEventListener("submit", handleFormSubmission);
});