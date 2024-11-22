// Fungsi untuk mendapatkan tanggal hari ini
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

// Fungsi untuk mendapatkan tanggal 6 hari ke depan (total 7 hari)
function getEndDate() {
    const today = new Date();
    const future = new Date(today);
    future.setDate(today.getDate() + 6);
    return future.toISOString().split("T")[0];
}

// Fungsi untuk fetch data cuaca dari API
async function fetchWeatherData(location) {
    document.querySelector('.location-name').innerText = `Searching for ${location}...`;

    try {
        // Gunakan API Geocoding untuk mendapatkan latitude dan longitude
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json`);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            alert("Location not found. Please try another city or state.");
            return;
        }

        const { lat, lon } = geoData[0];

        // API URL Open-Meteo
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weathercode&start_date=${getCurrentDate()}&end_date=${getEndDate()}&timezone=auto`;

        // Fetch data cuaca
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Render data cuaca ke UI
        renderDailyForecast(
            data.daily.temperature_2m_max, 
            data.daily.temperature_2m_min, 
            data.daily.sunrise, 
            data.daily.sunset, 
            data.daily.weathercode
        );

        // Update lokasi setelah data berhasil diambil
        document.querySelector('.location-name').innerText = `Weather Forecast for ${location}`;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Unable to fetch data. Please check your connection or try again.");
    }
}

// Fungsi untuk mendapatkan deskripsi cuaca berdasarkan weathercode
function getWeatherDescription(code) {
    const weatherDescriptions = {
        0: "Clear sky",
        1: "Mostly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Freezing fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Rain showers",
        81: "Heavy rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Severe thunderstorm with hail"
    };
    return weatherDescriptions[code] || "Unknown weather condition";
}

// Render data cuaca harian dengan kondisi cuaca
function renderDailyForecast(maxTemps, minTemps, sunriseData, sunsetData, weatherCodes) {
    const container = document.getElementById("daily-forecast-container");
    container.innerHTML = ""; 

    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    maxTemps.forEach((maxTemp, index) => {
        const forecastItem = document.createElement("div");
        forecastItem.className = "daily-forecast-item";

        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + index);

        const dayOfWeek = days[forecastDate.getDay()];
        const dateString = `${forecastDate.getDate()} ${months[forecastDate.getMonth()]} ${forecastDate.getFullYear()}`;
        const weatherDescription = getWeatherDescription(weatherCodes[index]);

        forecastItem.innerHTML = `
            <div>
                <h5>${dayOfWeek}</h5>
                <p class="date">${dateString}</p>
                <p>Max Temp: ${maxTemp}°C</p>
                <p>Min Temp: ${minTemps[index]}°C</p>
                <p>Weather: ${weatherDescription}</p>
                <p>🌅 Sunrise: ${new Date(sunriseData[index]).toLocaleTimeString()}</p>
                <p>🌇 Sunset: ${new Date(sunsetData[index]).toLocaleTimeString()}</p>
            </div>
        `;
        container.appendChild(forecastItem);
    });
}

// Event listener untuk lokasi default atau pencarian baru
document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData("Tegal"); // Default lokasi
});

document.getElementById("searchCity").addEventListener("submit", (e) => {
    e.preventDefault();
    const location = e.target.querySelector("input").value;
    if (!location) {
        alert("Please enter a city or state.");
        return;
    }
    fetchWeatherData(location);
});


// Fungsi untuk mengubah background secara otomatis
function changeBackground() {
    // Get current hour
    const currentHour = new Date().getHours();
    let backgroundImage;

    if (currentHour >= 5 && currentHour < 9) {
        // Pagi
        backgroundImage = 'day1.jpg';
    } else if (currentHour >= 9 && currentHour < 13) {
        // Siang awal
        backgroundImage = 'day2.jpg';
    } else if (currentHour >= 13 && currentHour < 16) {
        // Siang akhir
        backgroundImage = 'day3.jpg';
    } else if (currentHour >= 16 && currentHour < 19) {
        // Sore
        backgroundImage = 'day4.jpg';
    } else {
        // Malam
        backgroundImage = 'day5.jpg';
    }

    document.body.style.backgroundImage = `url('media/${backgroundImage}')`;
}

document.addEventListener('DOMContentLoaded', () => {
    changeBackground();
    
    setInterval(changeBackground, 60000);
});