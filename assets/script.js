const apiKey = '99646673296253aa8c7b2fde911527b7'; 

const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search-btn');
const currentWeatherEl = document.querySelector('#current-weather');
const forecastEl = document.querySelector('#forecast');
const searchHistoryEl = document.querySelector('#search-history');

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

searchBtn.addEventListener('click', function (event) {
  event.preventDefault(); 
  searchCity();
});
searchHistoryEl.addEventListener('click', searchHistoryCity);

function searchCity() {
    const city = cityInput.value.trim();
  
    // check if city already exists in search history
    if (!searchHistory.includes(city)) {
      searchHistory.push(city);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      renderSearchHistory();
    }
    
    cityInput.value = '';

      // make API request
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    // render current weather
    currentWeatherEl.innerHTML = `
      <div class="weather-item">
        <h3>${data.name} (${new Date().toLocaleDateString()})</h3>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp}&deg;F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
      </div>
    `;

    // make API request for 5-day forecast
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`);
  })
  .then(res => res.json())
  .then(data => {
    // filter data to get 5-day forecast
    const forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    // render 5-day forecast
    forecastEl.innerHTML = forecastData.map(item => `
      <div class="weather-item">
        <h3>${new Date(item.dt_txt).toLocaleDateString()}</h3>
        <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
        <p>Temperature: ${item.main.temp}&deg;F</p>
        <p>Humidity: ${item.main.humidity}%</p>
        <p>Wind Speed: ${item.wind.speed} m/s</p>
      </div>
    `).join('');
  })
  .catch(err => console.log(err));
}

function renderSearchHistory() {
    searchHistoryEl.innerHTML = `
      <h3>Search History</h3>
      <ul>
        ${searchHistory.map(city => `<li>${city}</li>`).join('')}
      </ul>
    `;
  }
  
  function searchHistoryCity(e) {
    if (e.target.tagName === 'LI') {
      cityInput.value = e.target.textContent;
      searchCity();
    }
  }

  renderSearchHistory();
