"use client";

// src/services/weatherService.ts
import $ from 'jquery';

export interface WeatherData {
  main: string;        // Main weather condition (Clear, Clouds, Rain, etc.)
  description: string; // Detailed description
  temp: number;        // Temperature in Celsius
  humidity: number;    // Humidity percentage
  windSpeed: number;   // Wind speed
  icon: string;        // Icon code from OpenWeatherMap
  location: string;    // City name
}

export interface WeatherApiResponse {
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  name: string;
}

// Default/fallback weather data
export const DEFAULT_WEATHER: WeatherData = {
  main: "Clear",
  description: "clear sky",
  temp: 20,
  humidity: 60,
  windSpeed: 5,
  icon: "01d",
  location: "Cosmic Space"
};

// Mock weather data for different conditions
const MOCK_WEATHER_DATA: { [key: string]: WeatherData } = {
  clear: {
    main: "Clear",
    description: "clear sky",
    temp: 25,
    humidity: 45,
    windSpeed: 3.5,
    icon: "01d",
    location: "Sunny Valley"
  },
  clouds: {
    main: "Clouds",
    description: "scattered clouds",
    temp: 18,
    humidity: 65,
    windSpeed: 4.2,
    icon: "03d",
    location: "Cloud City"
  },
  rain: {
    main: "Rain",
    description: "light rain",
    temp: 15,
    humidity: 80,
    windSpeed: 6.1,
    icon: "10d",
    location: "Rainy Harbor"
  },
  snow: {
    main: "Snow",
    description: "light snow",
    temp: -2,
    humidity: 85,
    windSpeed: 3.8,
    icon: "13d",
    location: "Snowflake Mountains"
  },
  thunderstorm: {
    main: "Thunderstorm",
    description: "thunderstorm with rain",
    temp: 17,
    humidity: 90,
    windSpeed: 8.5,
    icon: "11d",
    location: "Thunder Peak"
  }
};

// Helper function to map weather condition codes to our format
const mapWeatherData = (apiData: WeatherApiResponse): WeatherData => {
  try {
    // Extract the main weather condition
    const mainWeather = apiData.weather[0].main;
    
    // Map the icon code
    const iconCode = apiData.weather[0].icon || "01d";
    
    return {
      main: mainWeather,
      description: apiData.weather[0].description,
      temp: apiData.main.temp - 273.15, // Convert from Kelvin to Celsius
      humidity: apiData.main.humidity,
      windSpeed: apiData.wind.speed,
      icon: iconCode,
      location: apiData.name
    };
  } catch (error) {
    console.error("Error mapping weather data:", error);
    return DEFAULT_WEATHER;
  }
};

// Get mock weather data based on a seed string (city name)
const getMockWeatherData = (seed: string = ""): WeatherData => {
  // Use the seed to deterministically select a weather condition
  const conditions = Object.keys(MOCK_WEATHER_DATA);
  
  if (!seed || seed === "Cosmic Space") {
    return DEFAULT_WEATHER;
  }
  
  // Simple hash function to get a number from a string
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % conditions.length;
  
  const condition = conditions[index];
  const mockData = { ...MOCK_WEATHER_DATA[condition] };
  
  // Customize the location based on the seed
  mockData.location = seed;
  
  // Add some randomness to the temperature
  const tempVariation = (hash % 10) - 5; // -5 to +4 degrees variation
  mockData.temp += tempVariation;
  
  return mockData;
};

export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    return await new Promise<WeatherData>((resolve) => {
      $.ajax({
        // Use our Next.js API route instead of calling OpenWeatherMap directly
        url: `/api/weather?lat=${lat}&lon=${lon}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
          console.log("Weather API response:", response);
          resolve(mapWeatherData(response));
        },
        error: function(error) {
          console.error("Weather API error:", error);
          
          // Get approximate location name from coordinates
          const locationName = `Location (${lat.toFixed(1)}, ${lon.toFixed(1)})`;
          
          // Generate mock data based on coordinates
          const mockData = getMockWeatherData(locationName);
          console.log("Using mock weather data:", mockData);
          
          // Resolve with mock data instead of rejecting
          resolve(mockData);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    return DEFAULT_WEATHER;
  }
};

export const fetchWeatherByCity = async (
  city: string
): Promise<WeatherData> => {
  try {
    // If the city is "Cosmic Space", return the default weather
    if (city === "Cosmic Space") {
      return DEFAULT_WEATHER;
    }
    
    return await new Promise<WeatherData>((resolve) => {
      // Use "London" as default if city is empty or undefined
      const cityName = city && city.trim() !== "" ? city : "London";
      
      $.ajax({
        // Use our Next.js API route instead of calling OpenWeatherMap directly
        url: `/api/weather?city=${encodeURIComponent(cityName)}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
          console.log("Weather API response:", response);
          resolve(mapWeatherData(response));
        },
        error: function(error) {
          console.error("Weather API error:", error);
          
          // Generate mock data based on city name
          const mockData = getMockWeatherData(cityName);
          console.log("Using mock weather data:", mockData);
          
          // Resolve with mock data instead of rejecting
          resolve(mockData);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching weather by city:", error);
    return DEFAULT_WEATHER;
  }
};