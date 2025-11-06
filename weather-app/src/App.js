import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Search, MapPin } from 'lucide-react';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('Peshawar');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather('Peshawar');
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');

    try {
      // Replace 'YOUR_API_KEY_HERE' with your actual OpenWeatherMap API key
      const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid='f9bbdf7df8de1ce9d9a4a905b3f7dbd3'&units=metric`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeather(data);
      setSearchCity(cityName);
    } catch (err) {
      setError('Could not fetch weather data. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return <Sun className="w-24 h-24 text-yellow-400" />;
      case 'clouds':
        return <Cloud className="w-24 h-24 text-gray-300" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-24 h-24 text-blue-400" />;
      default:
        return <Cloud className="w-24 h-24 text-gray-300" />;
    }
  };

  const getBackgroundGradient = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 'clouds':
        return 'from-gray-400 via-gray-500 to-gray-600';
      case 'rain':
      case 'drizzle':
        return 'from-gray-600 via-gray-700 to-gray-800';
      default:
        return 'from-blue-500 via-purple-500 to-pink-500';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${weather ? getBackgroundGradient(weather.weather[0].main) : 'from-blue-500 via-purple-500 to-pink-500'} flex items-center justify-center p-4 transition-all duration-1000`}>
      <div className="w-full max-w-2xl">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for a city..."
              className="w-full px-6 py-4 pr-12 rounded-2xl bg-white/20 backdrop-blur-lg text-white placeholder-white/70 text-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition-all"
            >
              <Search className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Weather Card */}
        {loading ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
            <div className="animate-pulse text-white text-xl">Loading...</div>
          </div>
        ) : error ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
            <div className="text-white text-xl">{error}</div>
          </div>
        ) : weather ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            {/* Location */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-white" />
              <h2 className="text-3xl font-bold text-white">
                {weather.name}, {weather.sys.country}
              </h2>
            </div>

            {/* Main Weather */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {getWeatherIcon(weather.weather[0].main)}
              </div>
              <div className="text-7xl font-bold text-white mb-2">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-2xl text-white/90 capitalize">
                {weather.weather[0].description}
              </div>
              <div className="text-lg text-white/80 mt-2">
                Feels like {Math.round(weather.main.feels_like)}°C
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Wind className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-white/80 text-sm mb-1">Wind Speed</div>
                <div className="text-white text-xl font-semibold">
                  {weather.wind.speed} m/s
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Droplets className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-white/80 text-sm mb-1">Humidity</div>
                <div className="text-white text-xl font-semibold">
                  {weather.main.humidity}%
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Eye className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-white/80 text-sm mb-1">Visibility</div>
                <div className="text-white text-xl font-semibold">
                  {(weather.visibility / 1000).toFixed(1)} km
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Gauge className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-white/80 text-sm mb-1">Pressure</div>
                <div className="text-white text-xl font-semibold">
                  {weather.main.pressure} hPa
                </div>
              </div>
            </div>

            {/* Temperature Range */}
            <div className="mt-6 bg-white/10 rounded-2xl p-4 flex justify-around">
              <div className="text-center">
                <div className="text-white/80 text-sm mb-1">Min Temp</div>
                <div className="text-white text-2xl font-semibold">
                  {Math.round(weather.main.temp_min)}°C
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/80 text-sm mb-1">Max Temp</div>
                <div className="text-white text-2xl font-semibold">
                  {Math.round(weather.main.temp_max)}°C
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="text-center mt-6 text-white/80 text-sm">
          Powered by OpenWeatherMap API
        </div>
      </div>
    </div>
  );
}