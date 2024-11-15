var cityInputValue = cityInput.value;

var apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=-6.8886&longitude=109.6753&daily=sunrise,sunset&timezone=Asia%2FBangkok`;

if (cityInputValue != "") {
    async function getWeather() {
        var response = await fetch(apiUrl);
        var data = await response.json();

        if (data.message != "city not found" && data.cod != "404") 
            var sunrise = data.sys.sunrise;
            var sunset = data.sys.sunset;

            fetch(`https://api.open-meteo.com/v1/forecast?latitude=-6.8886&longitude=109.6753&daily=sunrise,sunset&timezone=Asia%2FBangkok`)
                .then(response => response.json())
                .then(data => {
                    const forecastContainer = document.getElementById('forecast-container');
                    forecastContainer.innerHTML = '';

                    const dailyForecasts = {};
                    data.list.forEach(entry => {
                        const dateTime = new Date(entry.dt * 1000);
                        const date = dateTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                        if (!dailyForecasts[date]) {
                            dailyForecasts[date] = {
                                date: date,
                                icon: `https://openweathermap.org/img/w/${entry.weather[0].icon}.png`,
                                maxTemp: -Infinity,
                                minTemp: Infinity,
                                weatherType: entry.weather[0].main
                            };
                        }

                        if (entry.main.temp_max > dailyForecasts[date].maxTemp) {
                            dailyForecasts[date].maxTemp = entry.main.temp_max;
                        }
                        if (entry.main.temp_min < dailyForecasts[date].minTemp) {
                            dailyForecasts[date].minTemp = entry.main.temp_min;
                        }
                    });

                    Object.values(dailyForecasts).forEach(day => {
                        const forecastCard = document.createElement('div');
                        forecastCard.classList.add('daily-forecast-card');

                        forecastCard.innerHTML = `
        <p class="daily-forecast-date">${day.date}</p>
        <div class="daily-forecast-logo"><img class="imgs-as-icons" src="${day.icon}"></div>
        <div class="max-min-temperature-daily-forecast">
          <span class="max-daily-forecast">${Math.round(day.maxTemp - 273.15)}<sup>o</sup>C</span>
          <span class="min-daily-forecast">${Math.round(day.minTemp - 273.15)}<sup>o</sup>C</span>
        </div>
        <p class="weather-type-daily-forecast">${day.weatherType}</p>
      `;
      forecastContainer.appendChild(forecastCard);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });



document.getElementById("locationName").innerHTML = location;
document.getElementById("sunriseAdditionalValue").innerHTML = sunrise;
document.getElementById("sunsetAdditionalValue").innerHTML = sunset;
}
else {
document.getElementById("locationName").innerHTML = "City Not Found";
document.getElementById("temperatureValue").innerHTML = "";
document.getElementById("weatherType").innerHTML = "";
}
}

getWeather();
}
else document.getElementById("locationName").innerHTML = "Enter a city name...";
}
});