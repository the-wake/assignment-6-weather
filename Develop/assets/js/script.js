function setDay() {
    // Sets the variables for time and populates the page.
    var dateVar = moment().format("dddd, MMMM DD, YYYY");
    var timestamp = document.getElementById("currentDay");
    date.textContent=(dateVar);
};

setDay();
