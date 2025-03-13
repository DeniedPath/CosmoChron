
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "demo"; 

export interface WeatherData {
  main: string;        // Main weather condition (Clear, Clouds, Rain, etc.)
  description: string; // Detailed description
  temp: number;        // Temperature in Celsius
  humidity: number;    // Humidity percentage
  windSpeed: number;   // Wind speed
  icon: string;        // Icon code from OpenWeatherMap
  location: string;    // City name
}

const DEFAULT_WEATHER: WeatherData = {
  main: "Clear",
  description: "clear sky",
  temp: 20,
  humidity: 60,
  windSpeed: 5,
  icon: "01d",
  location: "Cosmic Space"
};

export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    // During development with no API key, we'll use mock data
    if (API_KEY === "demo") {
      return mockWeatherData();
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Weather data could not be fetched");
    }

    const data = await response.json();
    
    return {
      main: data.weather[0].main,
      description: data.weather[0].description,
      temp: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      location: data.name
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return DEFAULT_WEATHER;
  }
};

// This function is still useful for the initial load if geolocation fails
export const fetchWeatherByCity = async (
  city: string
): Promise<WeatherData> => {
  try {
    // During development with no API key, we'll use mock data
    if (API_KEY === "demo") {
      return mockWeatherData(city);
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Weather data could not be fetched");
    }

    const data = await response.json();
    
    return {
      main: data.weather[0].main,
      description: data.weather[0].description,
      temp: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      location: data.name
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return DEFAULT_WEATHER;
  }
};

// Mock data function to use during development
const mockWeatherData = (city: string = "Your Location"): WeatherData => {
  const weatherTypes = [
    { main: "Clear", description: "clear sky", icon: "01d" },
    { main: "Clouds", description: "scattered clouds", icon: "03d" },
    { main: "Rain", description: "light rain", icon: "10d" },
    { main: "Thunderstorm", description: "thunderstorm", icon: "11d" },
    { main: "Snow", description: "light snow", icon: "13d" },
    { main: "Mist", description: "mist", icon: "50d" }
  ];
  
  const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  
  return {
    ...randomWeather,
    temp: Math.floor(Math.random() * 30) + 5, // 5 to 35 degrees
    humidity: Math.floor(Math.random() * 60) + 40, // 40% to 100%
    windSpeed: Math.floor(Math.random() * 20) + 1, // 1 to 20 km/h
    location: city
  };
};
