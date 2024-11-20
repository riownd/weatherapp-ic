// Fungsi untuk fetch data cuaca dari API
async function fetchWeatherData(location) {
    // Memperlihatkan Loader
    document.querySelector('.location-name').innerText = `Searching for ${location}...`;

    try {
        // Gunakan API Geocoding untuk mendapatkan latitude dan longitude
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json`);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            alert("Location not found. Please try another city or state.");
        }

        const { lat, lon } = geoData[0];

        // API URL Open-Meteo
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&start_date=${getCurrentDate()}&end_date=${getEndDate()}&timezone=auto`;

        // Fetch data cuaca
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Render data cuaca ke UI
        renderDailyForecast(data.daily.temperature_2m_max, data.daily.temperature_2m_min, data.daily.sunrise, data.daily.sunset);

        // Update the location name after data is fetched
        document.querySelector('.location-name').innerText = ` ${location}`;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Unable to fetch data. Please check your connection or try again.");
    } 
}

// Fungsi untuk mendapatkan tanggal hari ini
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

// Fungsi untuk mendapatkan tanggal 5 hari ke depan
function getEndDate() {
    const today = new Date();
    const future = new Date(today);
    future.setDate(today.getDate() + 5);
    return future.toISOString().split("T")[0];
}

// Render data cuaca harian dengan nama hari (Monday - Saturday)
function renderDailyForecast(maxTemps, minTemps, sunriseData, sunsetData) {
    const container = document.getElementById("daily-forecast-container");
    container.innerHTML = ""; 

    // Starting day: Monday
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    maxTemps.forEach((maxTemp, index) => {
        const forecastItem = document.createElement("div");
        forecastItem.className = "daily-forecast-item";

        // Get the corresponding weekday name
        const dayOfWeek = weekdays[index];

        // Create weather info for each day
        forecastItem.innerHTML = `
            <div>
                <h5>${dayOfWeek}</h5>  <!-- Show the actual day of the week -->
                <p>Max Temp: ${maxTemp}°C</p>
                <p>Min Temp: ${minTemps[index]}°C</p>
                <p>🌅 Sunrise: ${new Date(sunriseData[index]).toLocaleTimeString()}</p>
                <p>🌇 Sunset: ${new Date(sunsetData[index]).toLocaleTimeString()}</p>
            </div>
        `;
        container.appendChild(forecastItem);
    });
}

// Event listener untuk pencarian lokasi
document.getElementById("searchCity").addEventListener("submit", (e) => {
    e.preventDefault();

    const location = e.target.querySelector("input").value;
    if (!location) {
        alert("Please enter a city or state.");
        return;
    }

    // Fetch cuaca berdasarkan lokasi
    fetchWeatherData(location);
});

// Panggil fungsi awal untuk data default
document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData("Tegal"); // Default lokasi
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