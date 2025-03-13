
import React from 'react';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudFog, 
  CloudLightning, 
  CloudSun, 
  CloudMoon,
  RefreshCw,
  Thermometer,
  Droplets,
  Wind,
  MapPin
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherDisplayProps {
  compact?: boolean;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ compact = false }) => {
  const { 
    weatherData, 
    loading, 
    error,
    temperatureUnit,
    fetchWeatherByLocation, 
    getWeatherIcon,
    toggleTemperatureUnit,
    formatTemperature
  } = useWeather();
  
  const getIconComponent = () => {
    const iconName = getWeatherIcon();
    const iconProps = { className: 'h-5 w-5' };
    
    switch (iconName) {
      case 'sun': return <Sun {...iconProps} />;
      case 'moon': return <Moon {...iconProps} />;
      case 'cloud': return <Cloud {...iconProps} />;
      case 'cloud-sun': return <CloudSun {...iconProps} />;
      case 'cloud-moon': return <CloudMoon {...iconProps} />;
      case 'cloud-rain': return <CloudRain {...iconProps} />;
      case 'cloud-snow': return <CloudSnow {...iconProps} />;
      case 'cloud-fog': return <CloudFog {...iconProps} />;
      case 'cloud-lightning': return <CloudLightning {...iconProps} />;
      default: return <Sun {...iconProps} />;
    }
  };
  
  if (loading && !weatherData) {
    return compact ? (
      <div className="flex items-center space-x-1 text-cosmic-white/80">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-10" />
      </div>
    ) : (
      <div className="bg-cosmic-blue/20 border border-cosmic-highlight/20 rounded-lg p-3 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-6 w-24 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!weatherData) {
    return (
      <div className="text-cosmic-white/70 flex items-center text-sm">
        <RefreshCw className="animate-spin h-4 w-4 mr-1" />
        <span>Fetching cosmic weather...</span>
      </div>
    );
  }
  
  if (compact) {
    return (
      <div className="flex items-center space-x-1 text-cosmic-white/80 cursor-pointer" 
           onClick={fetchWeatherByLocation}
           title={`${weatherData.description} in ${weatherData.location}`}>
        {getIconComponent()}
        <span className="text-sm">{formatTemperature(weatherData.temp)}</span>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Weather Display */}
      <div className="bg-cosmic-blue/20 border border-cosmic-highlight/20 rounded-lg p-4 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cosmic-blue/30 rounded-full">
              {getIconComponent()}
            </div>
            <div>
              <div className="flex items-center">
                <span 
                  className="text-xl font-semibold text-cosmic-white cursor-pointer" 
                  onClick={toggleTemperatureUnit}
                  title="Click to toggle between Celsius and Fahrenheit"
                >
                  {formatTemperature(weatherData.temp)}
                </span>
                <span className="ml-2 text-xs text-cosmic-white/70 capitalize">
                  {weatherData.description}
                </span>
              </div>
              <div className="flex items-center text-cosmic-white/60 text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{weatherData.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full bg-cosmic-blue/20 hover:bg-cosmic-blue/30 text-cosmic-white/70"
              onClick={fetchWeatherByLocation}
              disabled={loading}
              title="Refresh weather data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Additional weather info */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-cosmic-blue/10 p-2 rounded-lg flex flex-col items-center">
            <Thermometer className="h-4 w-4 text-cosmic-highlight/80 mb-1" />
            <span className="text-xs text-cosmic-white/70">Temperature</span>
            <span 
              className="text-sm text-cosmic-white cursor-pointer" 
              onClick={toggleTemperatureUnit}
              title="Click to toggle between Celsius and Fahrenheit"
            >
              {formatTemperature(weatherData.temp)}
            </span>
          </div>
          <div className="bg-cosmic-blue/10 p-2 rounded-lg flex flex-col items-center">
            <Droplets className="h-4 w-4 text-cosmic-highlight/80 mb-1" />
            <span className="text-xs text-cosmic-white/70">Humidity</span>
            <span className="text-sm text-cosmic-white">{weatherData.humidity}%</span>
          </div>
          <div className="bg-cosmic-blue/10 p-2 rounded-lg flex flex-col items-center">
            <Wind className="h-4 w-4 text-cosmic-highlight/80 mb-1" />
            <span className="text-xs text-cosmic-white/70">Wind</span>
            <span className="text-sm text-cosmic-white">{weatherData.windSpeed} km/h</span>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="text-xs text-cosmic-highlight/80 mb-3">
            {error}. <button className="underline" onClick={fetchWeatherByLocation}>Retry</button>
          </div>
        )}
        
        <div className="mt-3 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-cosmic-white/60 text-xs hover:text-cosmic-white hover:bg-cosmic-blue/30"
            onClick={toggleTemperatureUnit}
          >
            <Thermometer className="h-3 w-3 mr-1" />
            Switch to {temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
