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

// The requestStatus variable is here to validate whether the fetch request was successful, and interrupt some functions if not.
var requestStatus = "";
var maxDays = 5;
// var maxCities = 10;
var unitVar = "imperial";
var scaleVar = "°F"
var cities = [];
var nowWeather = {};
var dayForecast = {};
var forecastDays = {};

// Sets the day in the jumbotron.
function setDay() {
    var dateVar = moment().format("dddd, MMMM DD, YYYY");
    date.textContent=(dateVar);
};

function runWeather() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=" + unitVar + "&appid=" + apiKey;
    // Zeroes out the previous values before populating.
    searchText.val("");
    // First fetch request, required to get coordinates for second.
    fetch(requestUrl)
    .then(function (response) {
        // Makes sure the request is valid; otherwise it interrupts the sequence so we don't end up with junk in the local storage.
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
            // Variables store the lat and lon from the initial requiest to concat the new one.
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

// This function is called by anything that needs to re-populate the history.
function appendHistory() {
    if (!(cities.includes(cityName))) {
        cities.push(cityName);
    };
    localStorage.setItem("cityStorage", JSON.stringify(cities));
}

// This populates pre-existing elements with data from the fetch requests to display current weather conditions.
function displayWeather() {
    var picture=nowWeather.weather[0].icon;
    forecastHead.text(`Today's Forecast: ${cityName}`);
    todayImg.attr("src", `http://openweathermap.org/img/w/${picture}.png`)
    todayTemp.text("Temp: " + nowWeather.main.temp + " " + scaleVar);
    todayWind.text("Wind: " + nowWeather.wind.speed + " mph");
    todayHumid.text("Humidity: " + nowWeather.main.humidity + "%");
    var uvString = $('<span>').addClass('forecastEl uvIndex').text(forecastDays.daily[0].uvi);
    todayUv.addClass('uvIndex').text("UV Index: ");
    // This conditional applies the appropriate class to the UV index.
    if (forecastDays.daily[0].uvi <= 3 ) {
        uvString.addClass('lowThreat')
    } else if (forecastDays.daily[0].uvi <= 7 ) {
        uvString.addClass('moderateThreat')
    } else {
        uvString.addClass('highThreat')
    }
    todayUv.append(uvString);
};

// This is similar to the above function, but it pulls from the second fetch request to populate the n-day forecast.
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
        // These are here since this script is building new elements from scratch, whereas the above function just modifies existing elements.
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

// This function pulls from local storage to generate the search history buttons.
function populate() {
    // Clears the list before populating it again.
    histList.html("");
    var cityPop = JSON.parse(localStorage.getItem("cityStorage"));
    for (var i = 0; i < cityPop.length; i++) {
        cities[i] = cityPop[i];
        var genButton = $('<button>').addClass('cityButton').text(cities[i]);
        histList.append(genButton);
        // I tried re-definine the histItem variable here just to make sure that that variable was up-to-date when called by the histItem event listener. It didn't seem to help so I've commented it out.
        // histItem = $(".cityButton");
    };
};

// This validates to make sure the string isn't empty. If it's not, it passes the search bar text to the cityName variable and runs the fetch request for it.
form.on('submit', function(event) {
    event.preventDefault();
    if (!searchText.val()) {
        alert("Please enter a city.")
    } else {
        cityName = $('#searchBar').val();
        runWeather();
    }
});

// This is the one that was causing me all the trouble. Finally found out about tying events to static ancestors after like 7 hours of troubleshooting.
histList.on('click', '.cityButton', function(event) {
    cityName = event.target.innerText;
    runWeather();
});

// These functions set today's date and populate the history from local storage, respectively, when the page loads.
setDay();
populate();
