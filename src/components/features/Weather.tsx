import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudLightning, CloudSnow, Sun, MapPin, Loader } from 'lucide-react';
import { getCurrentPosition, getWeatherCondition, WeatherData, DEFAULT_WEATHER } from '@/utils/weatherUtils';

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        
        const weatherData = await getWeatherCondition(latitude, longitude);
        setWeather(weatherData);
        setError(null);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Could not get weather data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
    
    // Refresh weather every 30 minutes
    const intervalId = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const getWeatherIcon = () => {
    switch (weather.icon) {
      case 'cloud':
        return <Cloud className="w-8 h-8" />;
      case 'cloud-rain':
        return <CloudRain className="w-8 h-8" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-8 h-8" />;
      case 'cloud-snow':
        return <CloudSnow className="w-8 h-8" />;
      case 'sun':
      default:
        return <Sun className="w-8 h-8" />;
    }
  };
  
  return (
    <div className="cosmic-card p-4">
      <h3 className="text-md font-medium mb-2">Weather</h3>
      
      {loading ? (
        <div className="flex items-center justify-center h-20">
          <Loader className="w-6 h-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-white/70 p-4">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-nebula-blue mt-2"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-cosmic-mid/50 rounded-full mr-3">
              {getWeatherIcon()}
            </div>
            <div>
              <div className="text-xl font-light">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-white/70 flex items-center">
                <MapPin className="w-3 h-3 mr-1" /> {weather.location}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {weather.condition}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;