from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# OpenWeatherMap API configuration
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
BASE_URL = "http://api.openweathermap.org/data/2.5"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', 'London')
    
    print(f"API Key being used: {OPENWEATHER_API_KEY[:5]}... (first 5 chars)")
    
    try:
        # Get current weather
        weather_url = f"{BASE_URL}/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
        print(f"Making request to: {weather_url.replace(OPENWEATHER_API_KEY, 'API_KEY_HIDDEN')}")
        
        weather_response = requests.get(weather_url)
        print(f"Current weather response status: {weather_response.status_code}")
        
        if weather_response.status_code == 200:
            weather_data = weather_response.json()
            # Get 5-day forecast
            forecast_url = f"{BASE_URL}/forecast?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
            forecast_response = requests.get(forecast_url)
            print(f"Forecast response status: {forecast_response.status_code}")
            
            if forecast_response.status_code != 200:
                print(f"Forecast API error: {forecast_response.text}")
                return jsonify({'error': 'Error fetching forecast data'}), 500
                
            forecast_data = forecast_response.json()
            return jsonify({
                'current': {
                    'temperature': round(weather_data['main']['temp']),
                    'feels_like': round(weather_data['main']['feels_like']),
                    'humidity': weather_data['main']['humidity'],
                    'description': weather_data['weather'][0]['description'],
                    'icon': weather_data['weather'][0]['icon'],
                    'wind_speed': weather_data['wind']['speed'],
                    'city': weather_data['name'],
                    'country': weather_data['sys']['country']
                },
                'forecast': forecast_data['list'][:5]  # Get next 5 forecasts
            })
        else:
            print(f"Weather API error: {weather_response.text}")
            return jsonify({'error': f'City not found. Status code: {weather_response.status_code}'}), 404
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True) 