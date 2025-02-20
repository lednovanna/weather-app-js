const WeatherStation = {
    temperature: 0,
    humiduty: 0, 
    pressure: 0,
    history: [],

    updateWeatherData(temp, humidity, pressure) {
        this.temperature = temp;
        this.humidity = humidity;
        this.pressure = pressure;

        this.history.push({ temp, humidity, pressure });
        if (this.history.length > 10) this.history.shift();

        console.log(`Temperature: ${temp}°C, Humidity: ${humidity}%, Pressure: ${pressure} mm`);
    },

    analyzeHistory() {
        if (!this.history.length) {
            console.log("No history for analize.");
            return;
        }

        const getAverage = (key) => this.history.reduce((sum, item) => sum + item[key], 0) / this.history.length;
        
        const avgTemp = getAverage("temp");
        const avgHumidity = getAverage("humidity");
        const avgPressure = getAverage("pressure");

        let forecast = "Uncertain forecast";
        if (avgTemp > 25 && avgHumidity < 50) forecast = "Sunny ☀️";
        else if (avgTemp >= 10 && avgTemp <= 25 && avgHumidity > 50) forecast = "Claudy ☁️";
        else if (avgHumidity > 80 && avgTemp < 20) forecast = "Rain 🌧️";
        else if (avgPressure < 750 && avgHumidity > 70) forecast = "Storm ⛈️";

        console.log(`Weather forecast based on history: ${forecast}`);
    },

    async fetchWeather(city = "Kyiv") {
        const API_KEY = "6a80817cac950dc2623c8de33f9683a2";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const data = await response.json();
            const { temp, humidity, pressure } = data.main;
            const icon = data.weather[0].icon;
            const description = data.weather[0].description;

            this.updateWeatherData(temp, humidity, pressure * 0.75006);
            this.analyzeHistory();
            this.renderWeather(city, icon, description, temp, humidity, pressure);

        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    },

    renderWeather(city, icon, description, temp, humidity, pressure) {
        document.querySelector(".city").textContent = city;
        document.querySelector(".weather-icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        document.querySelector(".weather-description").textContent = description;
        document.querySelector(".temperature").textContent = `Temperature: ${Math.round(temp)}°C`;
        document.querySelector(".humidity").textContent = `Humidity: ${Math.round(humidity)}%`;
        document.querySelector(".pressure").textContent = `Pressure: ${Math.round(pressure)} mm`;
    }
};

document.addEventListener("DOMContentLoaded", () => WeatherStation.fetchWeather());

