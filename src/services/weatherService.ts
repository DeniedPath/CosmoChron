"use client";

// src/services/weatherService.ts
import $ from 'jquery';

export interface WeatherData {
  main: string;        // Main weather condition (Clear, Clouds, Rain, etc.)
  description: string; // Detailed description
  temp: number;        // Temperature in Celsius
  humidity: number;    // Humidity percentage
  windSpeed: number;   // Wind speed
  icon: string;        // Icon URL from WeatherAPI.com
  location: string;    // City name
}

// Updated to match the new API response format from our Next.js App Router API
export interface WeatherApiResponse {
  location: string;
  country: string;
  temperature: {
    celsius: number;
    fahrenheit: number;
    feelsLike: {
      celsius: number;
      fahrenheit: number;
    }
  };
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind: {
    kph: number;
    mph: number;
    direction: string;
  };
  humidity: number;
  cloud: number;
  uv: number;
  weatherClass: string;
  localTime: string;
}

// Default/fallback weather data
export const DEFAULT_WEATHER: WeatherData = {
  main: "Clear",
  description: "clear sky",
  temp: 20,
  humidity: 60,
  windSpeed: 5,
  icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
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
    icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
    location: "Sunny Valley"
  },
  clouds: {
    main: "Clouds",
    description: "scattered clouds",
    temp: 18,
    humidity: 65,
    windSpeed: 4.2,
    icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
    location: "Cloud City"
  },
  rain: {
    main: "Rain",
    description: "light rain",
    temp: 15,
    humidity: 80,
    windSpeed: 6.1,
    icon: "//cdn.weatherapi.com/weather/64x64/day/296.png",
    location: "Rainy Harbor"
  },
  snow: {
    main: "Snow",
    description: "light snow",
    temp: -2,
    humidity: 85,
    windSpeed: 3.8,
    icon: "//cdn.weatherapi.com/weather/64x64/day/326.png",
    location: "Snowflake Mountains"
  },
  thunderstorm: {
    main: "Thunderstorm",
    description: "thunderstorm with rain",
    temp: 17,
    humidity: 90,
    windSpeed: 8.5,
    icon: "//cdn.weatherapi.com/weather/64x64/day/200.png",
    location: "Thunder Peak"
  }
};

// Helper function to map weather condition codes to our format
const mapWeatherData = (apiData: WeatherApiResponse | WeatherApiResponse): WeatherData => {
  try {
    // Check if apiData and required properties exist
    if (!apiData?.condition?.text) {
      console.error("Invalid weather API response:", apiData);
      return DEFAULT_WEATHER;
    }
    
    // Extract the main weather condition
    const conditionText = apiData.condition.text;
    const mainWeather = conditionText.split(' ')[0]; // Take first word as main condition
    
    return {
      main: mainWeather,
      description: conditionText,
      temp: apiData.temperature?.celsius ?? 20,
      humidity: apiData.humidity ?? 60,
      windSpeed: apiData.wind?.kph ? apiData.wind.kph / 3.6 : 5, // Convert km/h to m/s
      icon: apiData.condition.icon ?? "//cdn.weatherapi.com/weather/64x64/day/113.png",
      location: apiData.location ?? "Cosmic Space"
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
        // Use our Next.js API route instead of calling WeatherAPI directly
        url: `/api/weather?q=${lat},${lon}`,
        method: 'GET',
        dataType: 'json',
        success: function(response: WeatherApiResponse) {
          console.log("Weather API response:", response);
          if (!response?.condition?.text) {
            console.error("Invalid weather API response:", response);
            resolve(DEFAULT_WEATHER);
            return;
          }
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
  location: string
): Promise<WeatherData> => {
  try {
    // If the location is "Cosmic Space", return the default weather
    if (location === "Cosmic Space") {
      return DEFAULT_WEATHER;
    }
    
    return await new Promise<WeatherData>((resolve) => {
      // Use "London" as default if location is empty or undefined
      const locationName = location && location.trim() !== "" ? location : "London";
      
      $.ajax({
        // Use our Next.js API route instead of calling WeatherAPI directly
        url: `/api/weather?location=${encodeURIComponent(locationName)}`,
        method: 'GET',
        dataType: 'json',
        success: function(response: WeatherApiResponse) {
          console.log("Weather API response:", response);
          if (!response?.condition?.text) {
            console.error("Invalid weather API response:", response);
            resolve(DEFAULT_WEATHER);
            return;
          }
          resolve(mapWeatherData(response));
        },
        error: function(error) {
          console.error("Weather API error:", error);
          
          // Generate mock data based on location name
          const mockData = getMockWeatherData(locationName);
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