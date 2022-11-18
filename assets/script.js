var apiKey = "59857ed1a8ede53e3ef7bd3b63b6f10f";
var currentDay = moment().format("MM/DD/YYYY");
var searchForm = document.querySelector("#search-form"); 
var searchCity = document.querySelector('#city'); // Grabs the name of the city typed in the form box
var currentCityContainer = document.querySelector('#current-city-container'); // Empty to begin with. Will be dynamically added to
var currentCity = document.querySelector('#current-city'); // Empty to begin with. Will be dynamically added to.
var forecastContainer = document.querySelector('#forecast-container');
var searchHistoryContainer = document.querySelector('#search-history-container');
var forecastText = document.querySelector('.forecast-text');
var formerSearch = document.querySelector('.former-search');

window.onload = function() {
    showHistory();
}

var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = searchCity.value.trim(); //name of the city typed in the form box
    if (city) { // If something has been entered..
      getWeather(city); // pass that city to the getWeather function
      currentCity.textContent = city + " (" + currentDay + ")"; // Dynamically updated HTML text.
      storeHistory(city);
      showForecastText();
    } else {
      alert('Please enter a city');
    }
  }; 

var getWeather = function(city) { // Pass city as only argument to function
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey; // URL needs dynamic city and api key
    fetch(queryURL)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayWeather(data) // call displayWeather function 
                getForecast(data.coord.lat, data.coord.lon);
            })
        }
    })
} 

var getForecast = function(lat, lon) { 
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(queryURL)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayForecast(data);
            })
        }
    })
}

var displayWeather = function(data) {
    if (data.length === 0) {
        currentCityContainer.textContent = "No weather found";
        return;
    }
    var temp = Math.round(((data.main.temp - 273.15) * 9/5) + 32);
    var wind = Math.round(data.wind.speed);
    var humidity = Math.round(data.main.humidity);
    currentCityContainer.innerHTML = "";
    currentCity.textContent = city + " (" + currentDay + ")"; // Dynamically updated HTML text.
    var currentCityWeather = document.createElement('div');
    var tempEl = document.createElement('li');
    var windEl = document.createElement('li');
    var humidityEl = document.createElement('li');
    tempEl.innerHTML = "Temp: " + temp + "&#8457";
    windEl.textContent = "Wind: " + wind + " MPH";
    humidityEl.textContent = "Humidity: " + humidity + " %";
    currentCityContainer.appendChild(tempEl);
    currentCityContainer.appendChild(windEl);
    currentCityContainer.appendChild(humidityEl);
    currentCityContainer.classList = "current-city-style";
}

var displayForecast = function(data) {
    if (data.length === 0) {
        forecastContainer.textContent = "No forecast found";
        return;
    }
    indexNums = [4,12,20,28,36];                 //  [4,12,20,28,36];
    forecastContainer = document.querySelector('#forecast-container');
    forecastContainer.innerHTML = "";
    for (i = 0; i < 37; i++) {
    if(indexNums.includes(i)) {
    var date = data.list[i].dt_txt;
    var date = date.slice(0,10);  
    var temp = Math.round(((data.list[i].main.temp - 273.15) * 9/5) + 32);
    var wind = Math.round(data.list[i].wind.speed);
    var humidity = Math.round(data.list[i].main.humidity);
    var dateEl = document.createElement('li');
    var tempEl = document.createElement('li');
    var windEl = document.createElement('li');
    var humidityEl = document.createElement('li');
    dateEl.textContent = "Date: " + date;
    tempEl.textContent = "Temp: " + temp;
    windEl.textContent = "Wind: " + wind;
    humidityEl.textContent = "Humidity: " + humidity;
    forecastContainer2 = document.createElement('ul');
    forecastContainer2.appendChild(dateEl);
    forecastContainer2.appendChild(tempEl);
    forecastContainer2.appendChild(windEl);
    forecastContainer2.appendChild(humidityEl);
    forecastContainer2.classList.add('forecast-box');
    forecastContainer.appendChild(forecastContainer2);
    }
    }
}

var storeHistory = function(city) {
    var description = "city" + city;
    var name = city;
    localStorage.setItem(description, name);
}

var showHistory = function() {
    var results = [];
    for (i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        if (key.slice(0,4) === "city") {
            results.push(key);
        }
    }
    for (i = 0; i < results.length; i++) {
        var formerCity = results[i];
        var formerCity2 = formerCity.replace("city", "");
        var formerCityEl = document.createElement('button');
        formerCityEl.textContent = formerCity2;
        formerCityEl.classList = 'former-search';
        formerCityEl.value = formerCity2;
        formerCityEl.onclick = displayFormerCity;
        searchHistoryContainer.appendChild(formerCityEl);
    }
}

var showForecastText = function() {
    x = forecastText;
    x.style.display = "block";
}



var displayFormerCity = function(event) {
    //alert(this.value);
    event.preventDefault();
    var city = this.value.trim(); //name of the city typed in the form box
    if (city) { // If something has been entered..
      getWeather(city); // pass that city to the getWeather function
      showForecastText();
    }
}


searchForm.addEventListener('submit', formSubmitHandler);

