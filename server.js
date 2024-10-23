import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { fetchWeatherDataAndSave } from './utils/fetchWeatherData.js'; // Adjusted path
import { calculateDailySummary } from './utils/dailyWeatherSummary.js'; // Adjusted path
import Settings from './models/Settings.js'; // Import Settings model

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

let previousTemps = {}; // Object to store the last recorded temperatures for each city
let previousConditions = {}; // Object to store the last recorded weather conditions for each city
let alertSentTemperature = {}; // Object to track sent temperature alerts
let alertSentCondition = {}; // Object to track sent weather condition alerts

// Connect to your database
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

// Function to check temperature threshold for two consecutive updates
const checkTemperatureThreshold = (city, temp, threshold) => {
    const previousTemp = previousTemps[city] || null;

    if (previousTemp && previousTemp > threshold && temp > threshold) {
        if (!alertSentTemperature[city]) { // Check if alert has not been sent yet
            console.log(`⚠️ ALERT: ${city}'s temperature has exceeded the threshold of ${threshold}°C for two consecutive updates!`);
            alertSentTemperature[city] = true; // Mark alert as sent
        }
    } else {
        alertSentTemperature[city] = false; // Reset alert if conditions are not met
    }

    // Update the previous temperature for this city
    previousTemps[city] = temp;
};

// Function to check weather condition for alerts
const checkWeatherCondition = (city, currentCondition, alertConditions) => {
    const previousCondition = previousConditions[city] || null;

    if (alertConditions.includes(currentCondition) && previousCondition !== currentCondition) {
        if (!alertSentCondition[city]) { // Check if alert has not been sent yet
            console.log(`⚠️ ALERT: ${city}'s weather condition is now '${currentCondition}'!`);
            alertSentCondition[city] = true; // Mark alert as sent
        }
    } else {
        alertSentCondition[city] = false; // Reset alert if conditions are not met
    }

    // Update the previous condition for this city
    previousConditions[city] = currentCondition;
};

// Schedule a job to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    try {
        console.log('Fetching weather data and checking thresholds...');

        // Fetch current settings (temperature threshold and weather conditions)
        const settings = await Settings.findOne({});
        const temperatureThreshold = settings?.temperatureThreshold || 35;
        const alertConditions = settings?.alertConditions || []; // This should be an array of conditions to alert on (e.g., ['Rain', 'Thunderstorm'])

        // Fetch and store weather data for all cities
        const weatherData = await fetchWeatherDataAndSave(); // This function now returns the data for each city

        // Check temperature against the threshold and weather condition for each city
        weatherData.forEach(data => {
            const { city, temp, main } = data; // Use the data returned from the fetchWeatherDataAndSave function
            checkTemperatureThreshold(city, temp, temperatureThreshold);
            checkWeatherCondition(city, main, alertConditions);
        });

        // Calculate and update daily summary for each city
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
        const cityList = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
        await Promise.all(cityList.map(city => calculateDailySummary(city, dateString)));

        console.log('Daily summaries updated successfully');
    } catch (error) {
        console.error('Error updating weather data or daily summaries:', error);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
