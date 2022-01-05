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
// var maxCities = 10;
var unitVar = "imperial";
var scaleVar = "°F"
var cities = [];
var nowWeather = {};
var dayForecast = {};
var forecastDays = {};

function setDay() {
    var dateVar = moment().format("dddd, MMMM DD, YYYY");
    date.textContent=(dateVar);
};

function runWeather() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=" + unitVar + "&appid=" + apiKey;
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
            var latVar = nowWeather.coord.lat;
            var lonVar = nowWeather.coord.lon;
            var onecallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latVar + "&lon=" + lonVar + "&units=" + unitVar + "&appid=" + apiKey;
            fetch(onecallUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                forecastDays=data;
                displayWeather();
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
    var uvString = $('<span>').addClass('forecastEl uvIndex').text(forecastDays.daily[0].uvi);
    todayUv.addClass('uvIndex').text("UV Index: ");
    if (forecastDays.daily[0].uvi <= 3 ) {
        uvString.addClass('lowThreat')
    } else if (forecastDays.daily[0].uvi <= 7 ) {
        uvString.addClass('moderateThreat')
    } else {
        uvString.addClass('highThreat')
    }
    todayUv.append(uvString);
};

function displayForecast() {
    longTerm.empty();
    for (var i = 1; i < maxDays+1; i++) {
        dayForecast[i] = forecastDays.daily[i];
        var forecastBlock = $('<div>').addClass('forecastBlock');
        var forecastDay = $('<h6>').addClass('forecastEl');
        var picVar = dayForecast[i].weather[0].icon;
        var forecastPicture = $(`<img src="http://openweathermap.org/img/w/${picVar}.png">`);
        var rawDate = forecastDay.textContent=dayForecast[i].dt;
        var readableDate = moment.unix(rawDate).format('MMMM Do, YYYY');
        forecastDay.text(readableDate);
        var forecastTemp = $('<p>').addClass('forecastEl').text(`High Temp: ${dayForecast[i].temp.max} ${scaleVar}`);
        var forecastWind = $('<p>').addClass('forecastEl').text(`Wind: ${dayForecast[i].wind_speed} MPH`);
        var forecastHumid = $('<p>').addClass('forecastEl').text(`Humidity: ${dayForecast[i].humidity}%`);
        var uvString = $('<span>').addClass('forecastEl uvIndex').text(dayForecast[i].uvi);
        var forecastUv = $('<p>').addClass('forecastEl').text("UV Index: ");
        if (dayForecast[i].uvi <= 3 ) {
            uvString.addClass('lowThreat')
        } else if (dayForecast[i].uvi <= 7 ) {
            uvString.addClass('moderateThreat')
        } else {
            uvString.addClass('highThreat')
        }
        forecastUv.append(uvString);
        forecastBlock.append(forecastDay);
        forecastBlock.append(forecastPicture);
        forecastBlock.append(forecastTemp);
        forecastBlock.append(forecastWind);
        forecastBlock.append(forecastHumid);
        forecastBlock.append(forecastUv);
        longTerm.append(forecastBlock);
    }
};

// function displayForecast() {
//     longTerm.empty();
//     for (var i = 0; i < maxDays; i++) {
//         dayForecast[i] = forecastDays.daily[i];
//         var forecastBlock = document.createElement("div");
//         forecastBlock.className="forecastBlock";
//         var forecastDay = document.createElement("h6");
//         forecastDay.className="forecastEl";
//         var rawDate = forecastDay.textContent=dayForecast[i].dt;
//         var readableDate = moment.unix(rawDate).format("MMMM Do, YYYY");
//         forecastDay.textContent=readableDate;
//         var forecastTemp = document.createElement("p");
//         forecastTemp.className="forecastEl";
//         forecastTemp.textContent=dayForecast[i].temp.max;
//         var forecastWind = document.createElement("p");
//         forecastWind.className="forecastEl";
//         forecastWind.textContent=dayForecast[i].wind_speed;
//         var forecastHumid = document.createElement("p");
//         forecastHumid.className="forecastEl";
//         forecastHumid.textContent=dayForecast[i].humidity;
//         var forecastUv = document.createElement("p");
//         forecastUv.className="forecastEl";
//         forecastUv.textContent=dayForecast[i].main;
//         forecastBlock.append(forecastDay);
//         forecastBlock.append(forecastTemp);
//         forecastBlock.append(forecastWind);
//         forecastBlock.append(forecastHumid);
//         forecastBlock.append(forecastUv);
//         longTerm.append(forecastBlock);
//     }
// };

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
