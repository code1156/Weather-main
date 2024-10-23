// utils/fetchWeatherData.js
import axios from 'axios';
import { Weather } from '../models/Weather.js'; // Adjusted to import named export
import dotenv from 'dotenv';

dotenv.config({path: '.env.local'});
const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Your OpenWeatherMap API Key
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bengaluru', 'Kolkata', 'Hyderabad'];

export const fetchWeatherDataAndSave = async () => {
  const weatherResults = await Promise.all(CITIES.map(async (city) => {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const weatherData = response.data;

    // Assuming you have a Weather model that matches your database schema
    const newWeather = new Weather({
      city: city,
      main: weatherData.weather[0].main,
      temp: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      dt: weatherData.dt,
    });

    await newWeather.save();

    // Return essential weather data for alerting
    return {
      city: city,
      temp: weatherData.main.temp,
      main: weatherData.weather[0].main,
    };
  }));

  return weatherResults; // Return weather data for alert system
};
