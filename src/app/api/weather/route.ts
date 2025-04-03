import { NextRequest, NextResponse } from 'next/server';

// Define the structure of the weather API response
interface WeatherResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
    is_day: number;
  };
};

export async function GET(request: NextRequest) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Weather API key is not configured' },
        { status: 500 }
      );
    }
    
    // Get location from query parameters or use default
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location') || 'auto:ip';
    
    // Fetch weather data from the API
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to fetch weather data', details: errorData },
        { status: response.status }
      );
    }
    
    const data = await response.json() as WeatherResponse;
    
    // Map weather condition to our app's weather classes
    const weatherClass = mapWeatherCondition(data.current.condition.code, data.current.is_day === 1);
    
    // Return the processed weather data
    return NextResponse.json({
      location: data.location.name,
      country: data.location.country,
      temperature: {
        celsius: data.current.temp_c,
        fahrenheit: data.current.temp_f,
        feelsLike: {
          celsius: data.current.feelslike_c,
          fahrenheit: data.current.feelslike_f
        }
      },
      condition: {
        text: data.current.condition.text,
        icon: data.current.condition.icon,
        code: data.current.condition.code
      },
      wind: {
        kph: data.current.wind_kph,
        mph: data.current.wind_mph,
        direction: data.current.wind_dir
      },
      humidity: data.current.humidity,
      cloud: data.current.cloud,
      uv: data.current.uv,
      weatherClass: weatherClass,
      localTime: data.location.localtime
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', details: String(error) },
      { status: 500 }
    );
  }
}

// Helper function to map weather condition codes to our app's weather classes
function mapWeatherCondition(code: number, isDay: boolean): string {
  // Clear conditions
  if ([1000].includes(code)) {
    return isDay ? 'weather-clear' : 'weather-night-clear';
  }
  
  // Partly cloudy
  if ([1003].includes(code)) {
    return isDay ? 'weather-partly-cloudy' : 'weather-night-partly-cloudy';
  }
  
  // Cloudy
  if ([1006, 1009].includes(code)) {
    return 'weather-cloudy';
  }
  
  // Fog/Mist
  if ([1030, 1135, 1147].includes(code)) {
    return 'weather-fog';
  }
  
  // Rain
  if ([1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
    return 'weather-rain';
  }
  
  // Snow
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) {
    return 'weather-snow';
  }
  
  // Thunderstorm
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return 'weather-thunderstorm';
  }
  
  // Default to clear if no match
  return isDay ? 'weather-clear' : 'weather-night-clear';
}
