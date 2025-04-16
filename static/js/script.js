document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const cityName = document.getElementById('city-name');
    const currentDate = document.getElementById('current-date');
    const temp = document.getElementById('temp');
    const description = document.getElementById('description');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');
    const weatherIcon = document.getElementById('weather-icon');
    const forecastList = document.getElementById('forecast-list');
    const prevForecastBtn = document.getElementById('prev-forecast');
    const nextForecastBtn = document.getElementById('next-forecast');
    const weatherBackground = document.querySelector('.weather-background');

    let currentForecastIndex = 0;
    let forecastData = [];

    // Weather condition to background image mapping
    const weatherBackgrounds = {
        '01d': '../img/boat.png', // clear sky
        '01n': '../img/boat.png', // clear night
        '02d': '../img/boat.png', // few clouds
        '02n': '../img/boat.png', // few clouds night
        '03d': '../img/boat.png', // scattered clouds
        '03n': '../img/boat.png', // scattered clouds night
        '04d': '../img/boat.png', // broken clouds
        '04n': '../img/boat.png', // broken clouds night
        '09d': '../img/boat.png', // shower rain
        '09n': '../img/boat.png', // shower rain night
        '10d': '../img/boat.png', // rain
        '10n': '../img/boat.png', // rain night
        '11d': '../img/boat.png', // thunderstorm
        '11n': '../img/boat.png', // thunderstorm night
        '13d': '../img/boat.png', // snow
        '13n': '../img/boat.png', // snow night
        '50d': '../img/boat.png', // mist
        '50n': '../img/boat.png'  // mist night
    };

    // Weather condition to icon mapping
    const weatherIcons = {
        '01d': 'wi-day-sunny',
        '01n': 'wi-night-clear',
        '02d': 'wi-day-cloudy',
        '02n': 'wi-night-alt-cloudy',
        '03d': 'wi-cloudy',
        '03n': 'wi-cloudy',
        '04d': 'wi-cloudy',
        '04n': 'wi-cloudy',
        '09d': 'wi-showers',
        '09n': 'wi-showers',
        '10d': 'wi-rain',
        '10n': 'wi-rain',
        '11d': 'wi-thunderstorm',
        '11n': 'wi-thunderstorm',
        '13d': 'wi-snow',
        '13n': 'wi-snow',
        '50d': 'wi-fog',
        '50n': 'wi-fog'
    };

    // Function to create weather icon
    const createWeatherIcon = (iconCode) => {
        const iconClass = weatherIcons[iconCode] || 'sunny';
        return `<div class="weather-icon-container">
            <div class="weather-icon ${iconClass}">
                <div class="icon-sun"></div>
                <div class="icon-cloud"></div>
                <div class="icon-rain"></div>
                <div class="icon-snow"></div>
                <div class="icon-thunder"></div>
            </div>
        </div>`;
    };

    // Function to update background image
    const updateBackground = (iconCode) => {
        const backgroundUrl = weatherBackgrounds[iconCode] || weatherBackgrounds['01d'];
        document.documentElement.style.setProperty('--weather-bg', `url('${backgroundUrl}')`);
    };

    // Set initial background
    updateBackground('01d');

    // Function to format date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Function to format time
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Function to update current weather
    const updateCurrentWeather = (data) => {
        cityName.textContent = `${data.current.city}, ${data.current.country}`;
        currentDate.textContent = formatDate(Date.now() / 1000);
        temp.textContent = data.current.temperature;
        description.textContent = data.current.description;
        feelsLike.textContent = data.current.feels_like;
        humidity.textContent = data.current.humidity;
        wind.textContent = data.current.wind_speed;
        
        // Update weather icon
        weatherIcon.className = `wi ${weatherIcons[data.current.icon]}`;
        
        updateBackground(data.current.icon);
    };

    // Function to update forecast
    const updateForecast = (forecast) => {
        forecastData = forecast;
        currentForecastIndex = 0;
        renderForecast();
        updateForecastNav();
    };

    // Function to render forecast
    const renderForecast = () => {
        forecastList.innerHTML = '';
        const startIndex = currentForecastIndex;
        const endIndex = startIndex + 5;
        const visibleForecast = forecastData.slice(startIndex, endIndex);

        visibleForecast.forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="time">${formatTime(item.dt)}</div>
                <i class="wi ${weatherIcons[item.weather[0].icon]}"></i>
                <div class="temp">${Math.round(item.main.temp)}°C</div>
            `;
            forecastList.appendChild(forecastItem);
        });
    };

    // Function to update forecast navigation
    const updateForecastNav = () => {
        prevForecastBtn.style.opacity = currentForecastIndex === 0 ? '0.5' : '1';
        nextForecastBtn.style.opacity = currentForecastIndex + 5 >= forecastData.length ? '0.5' : '1';
    };

    // Function to fetch weather data
    const fetchWeather = async (city) => {
        try {
            const loadingDiv = addLoadingState();
            const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
            const data = await response.json();
            
            if (response.ok) {
                updateCurrentWeather(data);
                updateForecast(data.forecast);
            } else {
                showError(data.error || 'City not found');
            }
            loadingDiv.remove();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            showError('Error fetching weather data. Please try again.');
            loadingDiv.remove();
        }
    };

    // Function to show error
    const showError = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.querySelector('.container').prepend(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    };

    // Event listeners
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeather(city);
            }
        }
    });

    prevForecastBtn.addEventListener('click', () => {
        if (currentForecastIndex > 0) {
            currentForecastIndex -= 5;
            renderForecast();
            updateForecastNav();
        }
    });

    nextForecastBtn.addEventListener('click', () => {
        if (currentForecastIndex + 5 < forecastData.length) {
            currentForecastIndex += 5;
            renderForecast();
            updateForecastNav();
        }
    });

    // Add loading state
    const addLoadingState = () => {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        document.querySelector('.container').prepend(loadingDiv);
        return loadingDiv;
    };

    // Initial weather fetch for London
    fetchWeather('London');
}); 