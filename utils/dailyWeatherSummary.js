// utils/dailyWeatherSummary.js
import { Weather, DailySummary } from '../models/Weather.js';
import dbConnect from '../utils/dbConnect.js';

export async function calculateDailySummary(city, date) {
  await dbConnect();
  
  // Fetch all weather data for the city on the given date
  const startOfDay = Math.floor(new Date(date).setHours(0, 0, 0, 0) / 1000); // Convert to Unix timestamp
const endOfDay = Math.floor(new Date(date).setHours(23, 59, 59, 999) / 1000); // Convert to Unix timestamp

const weatherData = await Weather.find({
    city,
    dt: { $gte: startOfDay, $lt: endOfDay },
});

  if (weatherData.length === 0) return; // Exit if no data is found

  const avgTemp = weatherData.reduce((acc, val) => acc + val.temp, 0) / weatherData.length;
  const maxTemp = Math.max(...weatherData.map((data) => data.temp));
  const minTemp = Math.min(...weatherData.map((data) => data.temp));

  // Dominant weather condition: the one that appears most frequently
  const conditionCounts = weatherData.reduce((acc, { main }) => {
    acc[main] = (acc[main] || 0) + 1;
    return acc;
  }, {});
  const dominantCondition = Object.keys(conditionCounts).reduce((a, b) => conditionCounts[a] > conditionCounts[b] ? a : b);
  // console.log({
  //   avgTemp,
  //   maxTemp,
  //   minTemp,
  //   dominantCondition,
  // })
  // Use findOneAndUpdate to replace the existing summary or create a new one
  await DailySummary.findOneAndUpdate(
    { city, date }, // Query to find the existing summary
    {
      avgTemp,
      maxTemp,
      minTemp,
      dominantCondition,
    },
    { upsert: true, new: true } // Upsert option: create if not exists; return the updated document
  );
}
