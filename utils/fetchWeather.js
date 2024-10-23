import dotenv from 'dotenv'
dotenv.config({path: '.env.local'})
export async function fetchWeatherData(city) {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    console.log(apiKey)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
  
    const data = await response.json();
    console.log(data)
    return {
      main: data.weather[0].main,
      temp: (data.main.temp - 273.15).toFixed(2), // Convert from Kelvin to Celsius
      feels_like: (data.main.feels_like - 273.15).toFixed(2),
      wind: (data.wind.speed),
      dt: data.dt,
    };
  }