import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import { Weather } from "../models/Weather.js";

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to fetch actual weather data
const fetchRealWeatherData = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching real weather data:', error);
    return null;
  }
};

// Function to generate realistic weather variations using a sine wave
const generateWeatherData = (baseData, timestamp) => {
  const hour = new Date(timestamp * 1000).getUTCHours(); // Get the hour from the timestamp (UTC)
  
  // Calculate the temperature based on a sine wave pattern
  const baseTemp = baseData.main.temp;
  const amplitude = 5; // Amplitude of the sine wave (max deviation)
  const averageTemp = baseTemp; // Average temperature

  // Create a sine wave: peak around 14:00 (2 PM) and trough around 2 AM
  const sineTemp = averageTemp + amplitude * Math.sin((hour - 2) * (Math.PI / 12)); // Adjusted phase shift
  
  // Add some random noise
  const noise = (Math.random() - 0.5) * 1; // Random noise between -0.5°C and +0.5°C

  return {
    city: baseData.name,
    main: baseData.weather[0].main,
    temp: sineTemp + noise, // Smooth sine wave with noise
    feels_like: sineTemp + noise, // Adjust feels_like similarly for simplicity
    dt: timestamp,
  };
};

// Function to populate the database with weather data
const populateWeatherDatabase = async (city, numEntries) => {
  const baseData = await fetchRealWeatherData(city);
  if (!baseData) {
    console.error(`Unable to fetch real weather data for ${city}, aborting.`);
    return;
  }

  const startTime = Math.floor(Date.now() / 1000); // Current Unix timestamp (in seconds)
  const interval = 5 * 60; // 5 minutes in seconds

  const weatherEntries = [];

  for (let i = 0; i < numEntries; i++) {
    const timestamp = startTime - i * interval;
    const weatherData = generateWeatherData(baseData, timestamp);
    weatherEntries.push(weatherData);
  }

  try {
    await Weather.insertMany(weatherEntries);
    console.log(`${numEntries} weather entries inserted into the database for ${city}.`);
  } catch (error) {
    console.error('Error inserting weather data:', error);
  }
};

// Main execution
const main = async () => {
  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bengaluru', 'Kolkata', 'Hyderabad']; // List of cities
  const numEntries = 500; // Number of entries for each city

  // Iterate over each city to populate the database
  for (const city of cities) {
    await populateWeatherDatabase(city, numEntries);
  }

  mongoose.connection.close();
};

main();
