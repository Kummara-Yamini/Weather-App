
async function getWeather() {
    const city = document.getElementById("city").value.trim();
    const message = document.getElementById("message");
    const info = document.getElementById("weather-info");

    if (!city) {
        message.textContent = "Please enter a city name.";
        info.classList.add("hidden");
        return;
    }

    message.textContent = "Loading weather...";
    info.classList.add("hidden");

    try {
        const geoURL =
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) + "&count=1&language=en&format=json";

        const geoResponse = await fetch(geoURL);
        if (!geoResponse.ok) throw new Error();

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            message.textContent = "City not found. Try another city.";
            return;
        }

        const place = geoData.results[0];

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}` +
            `&longitude=${place.longitude}` +
            "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m";

        const weatherResponse = await fetch(weatherURL);
        if (!weatherResponse.ok) throw new Error();

        const data = await weatherResponse.json();
        const current = data.current;

        const conditions = {
            0: ["Clear sky", "☀️"],
            1: ["Mainly clear", "🌤️"],
            2: ["Partly cloudy", "⛅"],
            3: ["Overcast", "☁️"],
            45: ["Foggy", "🌫️"],
            48: ["Foggy", "🌫️"],
            51: ["Light drizzle", "🌦️"],
            53: ["Drizzle", "🌦️"],
            55: ["Heavy drizzle", "🌧️"],
            61: ["Light rain", "🌦️"],
            63: ["Rain", "🌧️"],
            65: ["Heavy rain", "🌧️"],
            71: ["Light snow", "🌨️"],
            73: ["Snow", "❄️"],
            75: ["Heavy snow", "❄️"],
            80: ["Rain showers", "🌦️"],
            81: ["Rain showers", "🌧️"],
            82: ["Heavy showers", "⛈️"],
            95: ["Thunderstorm", "⛈️"],
            96: ["Thunderstorm with hail", "⛈️"],
            99: ["Thunderstorm with hail", "⛈️"]
        };

        const [condition, icon] =
            conditions[current.weather_code] || ["Weather unavailable", "🌍"];

        document.getElementById("city-name").textContent =
            place.name + (place.country ? ", " + place.country : "");

        document.getElementById("weather-icon").textContent = icon;
        document.getElementById("temperature").textContent =
            current.temperature_2m + "°C";
        document.getElementById("condition").textContent = condition;
        document.getElementById("humidity").textContent =
            current.relative_humidity_2m;
        document.getElementById("wind").textContent =
            current.wind_speed_10m;

        message.textContent = "";
        info.classList.remove("hidden");

    } catch (error) {
        message.textContent =
            "Unable to get weather. Check your internet and try again.";
    }
}
