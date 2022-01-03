var apiKey = "6ef0014aabef8562491a8623c83179b3";
var cityName = "Athens";
var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;


var form = document.getElementById('submissionForm');
var histList = document.getElementById('searchHistory');

var maxCities = 10;
var cities = [];

fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
    });

function setDay() {
    var dateVar = moment().format("dddd, MMMM DD, YYYY");
    var timestamp = document.getElementById("currentDay");
    date.textContent=(dateVar);
};

function logSubmit(event) {
    event.preventDefault();
    var cityEntry = document.getElementById('searchBar').value;
    cities.push(cityEntry);
    localStorage.setItem("cityStorage", JSON.stringify(cities));
    populate();
};

// Add function to search a city when clicked from history.

function populate() {
    // Make sure to clear the list before populating it again.
    histList.innerHTML="";
    var cityPop = JSON.parse(localStorage.getItem("cityStorage"));
    for (var i = 0; i < cityPop.length; i++) {
        cities[i] = cityPop[i];
        // Put in a function to snip the cities array to the right size, to check for duplicates, and to validate entry.
        var cityButton = document.createElement("button");
        cityButton.className="cityButton";
        cityButton.textContent=cities[i];
        searchHistory.appendChild(cityButton);
    };
};

form.addEventListener('submit', logSubmit);

setDay();
populate();
