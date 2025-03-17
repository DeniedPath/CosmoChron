"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  fetchWeatherByCoords, 
  fetchWeatherByCity,
  WeatherData,
  DEFAULT_WEATHER
} from '@/services/weatherService';
import { toast } from "@/components/ui/use-toast";

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface UseWeatherProps {
  city?: string;
  autoFetch?: boolean;
}

export const useWeather = ({ city, autoFetch = true }: UseWeatherProps = {}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(() => {
    // Check if user has a saved preference
    if (typeof window !== 'undefined') {
      const savedUnit = localStorage.getItem('spaceTimer_tempUnit');
      return (savedUnit === 'fahrenheit') ? 'fahrenheit' : 'celsius';
    }
    return 'celsius';
  });

  // Load default weather (either from localStorage or a default value)
  const fetchDefaultWeather = useCallback(async () => {
    const savedWeather = localStorage.getItem('spaceTimer_weather');
    
    if (savedWeather) {
      try {
        setWeatherData(JSON.parse(savedWeather));
      } catch (err) {
        console.error("Error parsing saved weather:", err);
        setWeatherData(DEFAULT_WEATHER);
      }
    } else {
      setWeatherData(DEFAULT_WEATHER);
    }
  }, []);

  // Get user location and fetch weather
  const fetchWeatherByLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const data = await fetchWeatherByCoords(latitude, longitude);
              setWeatherData(data);
              // Save to localStorage to persist between sessions
              localStorage.setItem('spaceTimer_weather', JSON.stringify(data));
              setLoading(false);
              toast({
                title: "Weather Updated",
                description: `Showing weather for ${data.location}`,
                duration: 3000,
              });
            } catch (err) {
              console.error("Weather API error:", err);
              setError("Couldn't fetch weather data. Using default cosmic weather.");
              fetchDefaultWeather();
              setLoading(false);
            }
          },
          (err) => {
            console.error("Geolocation error:", err);
            setError("Couldn't access your location. Using default cosmic weather.");
            toast({
              title: "Location Access Error",
              description: "Please enable location services to see your local weather.",
              variant: "destructive",
              duration: 5000,
            });
            fetchDefaultWeather();
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by your browser. Using default cosmic weather.");
        toast({
          title: "Browser Limitation",
          description: "Your browser doesn't support geolocation. Using default weather.",
          variant: "destructive",
          duration: 5000,
        });
        fetchDefaultWeather();
        setLoading(false);
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError("Failed to fetch weather data. Using default cosmic weather.");
      fetchDefaultWeather();
      setLoading(false);
    }
  }, [fetchDefaultWeather]);

  // Fetch weather for a specific city
  const fetchWeatherForCity = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherByCity(cityName);
      setWeatherData(data);
      // Save to localStorage to persist between sessions
      localStorage.setItem('spaceTimer_weather', JSON.stringify(data));
      setLoading(false);
      toast({
        title: "Weather Updated",
        description: `Showing weather for ${data.location}`,
        duration: 3000,
      });
    } catch (err) {
      console.error("Weather API error:", err);
      setError("Couldn't fetch weather data. Using default cosmic weather.");
      fetchDefaultWeather();
      setLoading(false);
    }
  }, [fetchDefaultWeather]);

  // Temperature unit conversion utilities
  const toggleTemperatureUnit = () => {
    const newUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTemperatureUnit(newUnit);
    localStorage.setItem('spaceTimer_tempUnit', newUnit);
  };

  const convertTemperature = (celsiusTemp: number): number => {
    if (temperatureUnit === 'fahrenheit') {
      return (celsiusTemp * 9/5) + 32; // Convert to Fahrenheit
    }
    return celsiusTemp; // Return as is for Celsius
  };

  const formatTemperature = (celsiusTemp: number): string => {
    const temp = convertTemperature(celsiusTemp);
    const roundedTemp = Math.round(temp);
    const unit = temperatureUnit === 'celsius' ? '°C' : '°F';
    return `${roundedTemp}${unit}`;
  };
  
  // Initial fetch on mount
  useEffect(() => {
    if (!autoFetch || typeof window === 'undefined') return;
    
    // Try to load from localStorage first
    const savedWeather = localStorage.getItem('spaceTimer_weather');
    if (savedWeather) {
      try {
        setWeatherData(JSON.parse(savedWeather));
      } catch (err) {
        console.error("Error parsing saved weather:", err);
      }
    }
    
    // If a city is specified, fetch for that city
    if (city) {
      fetchWeatherForCity(city);
    } else {
      // Otherwise try to get user location
      fetchWeatherByLocation();
    }
    
    // Refresh weather data every 30 minutes
    const intervalId = setInterval(() => {
      if (city) {
        fetchWeatherForCity(city);
      } else {
        fetchWeatherByLocation();
      }
    }, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [autoFetch, city, fetchWeatherForCity, fetchWeatherByLocation]);

  // Get weather condition class for styling
  const getWeatherConditionClass = () => {
    if (!weatherData) return 'weather-clear';
    
    const { main } = weatherData;
    
    switch (main.toLowerCase()) {
      case 'clear':
        return 'weather-clear';
      case 'clouds':
        return 'weather-clouds';
      case 'rain':
      case 'drizzle':
        return 'weather-rain';
      case 'thunderstorm':
        return 'weather-storm';
      case 'snow':
        return 'weather-snow';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'weather-mist';
      default:
        return 'weather-clear';
    }
  };

  // Get weather icon based on condition
  const getWeatherIcon = (): "sun" | "moon" | "cloud" | "cloud-sun" | "cloud-moon" | "cloud-rain" | "cloud-snow" | "cloud-fog" | "cloud-lightning" => {
    if (!weatherData) return 'sun';
    
    const { main, icon } = weatherData;
    const isNight = icon.includes('n');
    
    switch (main.toLowerCase()) {
      case 'clear':
        return isNight ? 'moon' : 'sun';
      case 'clouds':
        return isNight ? 'cloud-moon' : 'cloud-sun';
      case 'rain':
      case 'drizzle':
        return 'cloud-rain';
      case 'thunderstorm':
        return 'cloud-lightning';
      case 'snow':
        return 'cloud-snow';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'cloud-fog';
      default:
        return isNight ? 'moon' : 'sun';
    }
  };

  return {
    weatherData,
    loading,
    error,
    temperatureUnit,
    fetchWeatherByLocation,
    fetchWeatherForCity,
    getWeatherConditionClass,
    getWeatherIcon,
    toggleTemperatureUnit,
    formatTemperature
  };
};