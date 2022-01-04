var apiKey = "6ef0014aabef8562491a8623c83179b3";
var cityName = "";

var form = $('#submissionForm');
var forecastHead = $('#cityEl');
var todayImg = $('#todayImg');
var todayTemp = $('#tempEl');
var todayWind = $('#elwind');
var todayHumid = $('#humidEl');
var todayUv = $('#uvEl');
var histList = $('#searchHistory');
var histItem = $(".cityButton");
var longTerm = $('#longTerm');
var searchText = $('#searchBar');

var requestStatus = "";
var maxDays = 5;
var maxCities = 10;
var unitVar = "imperial";
var scaleVar = "°F"
var cities = [];
var nowWeather = {};
var dayForecast = {};
var forecastDays = {};

// Could set something to make this happen only if cityName exists.

function setDay() {
    var dateVar = moment().format("dddd, MMMM DD, YYYY");
    date.textContent=(dateVar);
};

function runWeather() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=" + unitVar + "&appid=" + apiKey;
    // var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=" + unitVar + "&cnt=" + maxDays + "&appid=" + apiKey;
    searchText.val("");
    fetch(requestUrl)
    .then(function (response) {
        if (response.ok) {
            requestStatus="good";
            return response.json();
            } else {
            requestStatus="bad";
            }
        }
    )
    .then(function (data) {
        if(requestStatus === "good") {
            console.log(data);
            nowWeather=data;
            // Wrapped these functions inside the promise so that they don't fire until the data is returned.
            appendHistory();
            displayWeather();
            var latVar = nowWeather.coord.lat;
            var lonVar = nowWeather.coord.lon;
            var onecallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latVar + "&lon=" + lonVar + "&appid=" + apiKey;
            fetch(onecallUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                forecastDays=data;
                displayForecast();
                populate();
            })
        } else {
            alert(`${cityName} not found.`);
        }
    });
};

function appendHistory() {
    if (!(cities.includes(cityName))) {
        cities.push(cityName);
    };
    localStorage.setItem("cityStorage", JSON.stringify(cities));
}

// function histClick(event) {
//     // if (event.target.attr('button')) {
//         console.log(event.target);
//         var cityEntry = event.target.innerText;
//         cityName = cityEntry;
//         runWeather();
//     // };
// };

function displayWeather() {
    var picture=nowWeather.weather[0].icon;
    forecastHead.text(`Today's Forecast: ${cityName}`);
    todayImg.attr("src", `http://openweathermap.org/img/w/${picture}.png`)
    todayTemp.text("Temp: " + nowWeather.main.temp + " " + scaleVar);
    todayWind.text("Wind: " + nowWeather.wind.speed + " mph");
    todayHumid.text("Humidity: " + nowWeather.main.humidity + "%");
    todayUv.text("UV Index: " + nowWeather.main);
};

function displayForecast() {
    longTerm.empty();
    for (var i = 0; i < maxDays; i++) {
        dayForecast[i] = forecastDays.daily[i];
        var forecastBlock = document.createElement("div");
        forecastBlock.className="forecastBlock";
        var forecastDay = document.createElement("h6");
        forecastDay.className="forecastEl";
        forecastDay.textContent=dayForecast[i].dt;
        var forecastTemp = document.createElement("p");
        forecastTemp.className="forecastEl";
        forecastTemp.textContent=dayForecast[i].temp.max;
        var forecastWind = document.createElement("p");
        forecastWind.className="forecastEl";
        forecastWind.textContent=dayForecast[i].wind_speed;
        var forecastHumid = document.createElement("p");
        forecastHumid.className="forecastEl";
        forecastHumid.textContent=dayForecast[i].humidity;
        var forecastUv = document.createElement("p");
        forecastUv.className="forecastEl";
        forecastUv.textContent=dayForecast[i].main;
        forecastBlock.append(forecastDay);
        forecastBlock.append(forecastTemp);
        forecastBlock.append(forecastWind);
        forecastBlock.append(forecastHumid);
        forecastBlock.append(forecastUv);
        longTerm.append(forecastBlock);
    }
};

function populate() {
    // Clears the list before populating it again.
    histList.html("");
    var cityPop = JSON.parse(localStorage.getItem("cityStorage"));
    for (var i = 0; i < cityPop.length; i++) {
        cities[i] = cityPop[i];
        // Put in a function to snip the cities array to the right size, to check for duplicates, and to validate entry. Can probably use if (response.status === 404) or response.ok to help with that.
        var genButton = $('<button>');
        genButton.addClass('cityButton');
        genButton.text(cities[i]);
        histList.append(genButton);
    };
};

form.on('submit', function(event) {
    event.preventDefault();
    if (!searchText.val()) {
        alert("Please enter a city.")
    } else {
        cityName = $('#searchBar').val();
        runWeather();
    }
});

histItem.on('click', function(event) {
    // if (event.target.attr('button')) {
    cityName = event.target.innerText;
    runWeather();
    // };
});

setDay();
populate();


// Do loop with if length > max length, then i = array.length-1 and i-- 10 times.
