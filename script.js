// Global Variables
var weatherApiUrl = 'https://api.openweathermap.org';
var apiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
var searchHistory = [];

// DOM references
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayContainer = document.querySelector('#today');
var forecastContainer = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

// Timezone plugins
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// search history
function renderSearchHistory() {
    searchHistoryContainer.innerHTML = '';

    for (var i = searchHistory.length - 1; i >= 0; i--) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-controls', 'today forecast');
        btn.classList.add('history-btn', 'btn-history');

        // `data-search` allows access to city name when click handler is invoked
        btn.setAttribute('data-search', searchHistory[i]);
        btn.textContent = searchHistory[i];
        searchHistoryContainer.append(btn);
    }
}

// update history to local storage
function appendHistory(search) {
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);

    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();
}

// Function to get search history from local storage
function initSearchHistory() {
    var storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}

// function to display the weather
function renderWeather(city, weather, timezone) {
    var date = dayjs().tz(timezone).format('M/D/YYYY');

    // Store response data from our fetch request in variables
    var tempF = weather.temp;
    var windMph = weather.wind_speed;
    var humidity = weather.humidity;
    var uvi = weather.uvi;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvEl = document.createElement('p');
    var uviBadge = document.createElement('button');

    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);

    heading.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${tempF}??F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidityEl);

    uvEl.textContent = 'UV Index: ';
    uviBadge.classList.add('btn', 'btn-sm');

    if (uvi < 3) {
        uviBadge.classList.add('btn-success');
    } else if (uvi < 7) {
        uviBadge.classList.add('btn-warning');
    } else {
        uviBadge.classList.add('btn-danger');
    }

    uviBadge.textContent = uvi;
    uvEl.append(uviBadge);
    cardBody.append(uvEl);

    todayContainer.innerHTML = '';
    todayContainer.append(card);
}