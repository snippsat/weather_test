# Modern Weather App

A beautiful weather application built with Flask and modern UI design. This app provides current weather information and a 5-day forecast for any city.

## Features

- Current weather display with temperature, feels like, humidity, and wind speed
- 5-day weather forecast
- Modern, responsive UI with glassmorphism design
- Real-time weather data from OpenWeatherMap API
- Search functionality for any city worldwide

## Setup

1. Clone this repository
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```
   You can get an API key by signing up at [OpenWeatherMap](https://openweathermap.org/api)

4. Run the application:
   ```bash
   python app.py
   ```
5. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Enter a city name in the search box
2. Press Enter or click the search button
3. View the current weather and 5-day forecast for the selected city

## Technologies Used

- Flask (Python web framework)
- OpenWeatherMap API
- HTML5
- CSS3 (with modern features like glassmorphism)
- JavaScript (ES6+)
- Font Awesome icons
- Google Fonts (Poppins) 