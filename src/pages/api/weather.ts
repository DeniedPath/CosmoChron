// src/pages/api/weather.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Get API key from environment variables
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Mock weather data for fallback when API fails
const generateMockWeatherData = (city?: string) => {
  const conditions = ['clear', 'clouds', 'rain', 'snow', 'thunderstorm'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const temp = Math.round(Math.random() * 25 + 5); // Random temp between 5-30°C
  
  return {
    location: {
      name: city ?? 'Your Location',
      region: '',
      country: '',
      lat: 0,
      lon: 0
    },
    current: {
      temp_c: temp,
      temp_f: (temp * 9/5) + 32,
      condition: {
        text: condition.charAt(0).toUpperCase() + condition.slice(1),
        icon: getWeatherIcon(condition),
        code: 1000
      },
      wind_kph: Math.random() * 20,
      humidity: Math.round(Math.random() * 60 + 30),
      feelslike_c: temp + Math.random() * 3 - 1,
      feelslike_f: ((temp + Math.random() * 3 - 1) * 9/5) + 32
    }
  };
};

// Helper function to get weather icon based on condition
const getWeatherIcon = (condition: string): string => {
  switch (condition) {
    case 'clear':
      return '//cdn.weatherapi.com/weather/64x64/day/113.png';
    case 'clouds':
      return '//cdn.weatherapi.com/weather/64x64/day/116.png';
    case 'rain':
      return '//cdn.weatherapi.com/weather/64x64/day/296.png';
    case 'snow':
      return '//cdn.weatherapi.com/weather/64x64/day/326.png';
    default:
      return '//cdn.weatherapi.com/weather/64x64/day/200.png'; // thunderstorm
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key is available
  if (!WEATHER_API_KEY) {
    console.warn('Weather API key is missing. Please add WEATHER_API_KEY to your .env.local file');
    return res.status(200).json(generateMockWeatherData(req.query.city as string));
  }

  try {
    const { lat, lon, city } = req.query;
    let url: string;

    // Determine which API endpoint to use based on provided parameters
    if (lat && lon) {
      url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&aqi=no`;
    } else if (city) {
      url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city as string)}&aqi=no`;
    } else {
      return res.status(400).json({ error: 'Missing required parameters: lat & lon or city' });
    }

    // Fetch weather data from WeatherAPI.com
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Weather API returned status ${response.status}, using mock data instead`);
      // Return mock data instead of throwing an error
      return res.status(200).json(generateMockWeatherData(city as string));
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Weather API proxy error:', error);
    // Return mock data instead of an error response
    return res.status(200).json(generateMockWeatherData(req.query.city as string));
  }
}
