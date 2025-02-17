

/* object creating */
const WeatherStation = {
       temperature: 0,
       humiduty: 0,
       pressure: 0,
       history: [],

    /* weather updating method*/

updateWeatherData(temp, humidity, pressure) {
    this.temperature = temp;
    this.humidity = humidity;
    this.pressure = pressure;

    /* save data in history*/
    this.history.push({temp, humidity, pressure});
    if(this.history.length > 10) {
        this.history.shift(); // remove the oldest info
    }

    console.log(` Temperature ${temp}°C, Humidity ${humidity}%, Pressure ${pressure} mm`);
}, 

analyzeHistory() {
    if (this.history.length === 0) {
        console.log("No history for analize.");
        return;
    }

    const avgTemp = this.history.reduce((sum, item) => sum + item.temp, 0) / this.history.length;
    const avgHumidity = this.history.reduce((sum, item) => sum + item.humidity, 0) / this.history.length;
    const avgPressure = this.history.reduce((sum, item) => sum + item.pressure, 0) / this.history.length;

    let forecast = "Uncertain forecast";

    if (avgTemp > 25 && avgHumidity < 50) {
        forecast = "Sunny ☀️";
    } else if (avgTemp >= 10 && avgTemp <= 25 && avgHumidity > 50) {
        forecast = "Claudy ☁️";
    } else if (avgHumidity > 80 && avgTemp < 20) {
        forecast = "Rain 🌧️";
    } else if (avgPressure < 750 && avgHumidity > 70) {
        forecast = "Storm ⛈️";
    }

    console.log(`Weather forecast based on history: ${forecast}`);
},



async fetchWeather() {
    const cityName = "Kyiv";
    const API_KEY = "6a80817cac950dc2623c8de33f9683a2"; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            const icon = data.weather[0].icon; 
            const description = data.weather[0].description; 
            const temp = data.main.temp;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure * 0.75006; 

            this.updateWeatherData(temp, humidity, pressure);
            this.analyzeHistory();
             
             const cityName = document.querySelector('.city');
             cityName.innerHTML = "Kyiv";

              let weatherDescription = document.querySelector('.weather-description');
              weatherDescription.textContent = description
            
            let temperature = document.querySelector('.temperature');
            temperature.innerHTML = `temperature: ${Math.round(temp)} <span>°C</span>`

             let humid = document.querySelector('.humidity');
            humid.innerHTML = `humidity: ${Math.round (humidity)} <span>%</span>`

             let press = document.querySelector('.pressure');
            press.innerHTML = `pressure: ${Math.round(pressure)} <span>mm</span>`

            document.querySelector('.weather-icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        } else {
            console.log(`Error: ${data.message}`);
        }
    } catch (error) {
        console.log("Error:", error);
    }

    
}
  


}




WeatherStation.fetchWeather();

  


