// generateSampleData.js

import mongoose from 'mongoose';
import {DailySummary} from '../models/Weather.js'; // Adjust the path to your DailySummary model
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'})
const cities = ["Delhi", "Mumbai", "Chennai", "Bengaluru", "Kolkata", "Hyderabad"];
const startDate = new Date();
const daysToGenerate = 30; // Number of days to generate data for
const MONGO_URI = process.env.MONGO_URI
const generateRandomTemperature = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min; // Generates a random temperature between min and max
};

const generateSampleData = async () => {
  try {
    await mongoose.connect(MONGO_URI, { // Replace with your database connection string
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

      for (const city of cities) {
        const avgTemp = generateRandomTemperature(10, 35); // Random average temperature between 10°C and 35°C
        const maxTemp = avgTemp + generateRandomTemperature(0, 5); // Max temperature is slightly higher than average
        const minTemp = avgTemp - generateRandomTemperature(0, 5); // Min temperature is slightly lower than average
        const dominantCondition = ['Clear', 'Cloudy', 'Rain', 'Thunderstorm'][generateRandomTemperature(0, 3)]; // Random weather condition

        const dailySummary = new DailySummary({
          city,
          date: formattedDate,
          avgTemp,
          maxTemp,
          minTemp,
          dominantCondition,
        });

        await dailySummary.save(); // Save the daily summary to the database
      }
    }

    console.log('Sample data generated successfully!');
  } catch (error) {
    console.error('Error generating sample data:', error);
  } finally {
    await mongoose.disconnect(); // Disconnect from the database
  }
};

generateSampleData();
