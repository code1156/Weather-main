// models/Weather.js
import mongoose from "mongoose";
// import mongoose from 'mongoose';
const weatherSchema = new mongoose.Schema({
  city: String,
  main: String,
  temp: Number,
  feels_like: Number,
  dt: Number,
});

const dailySummarySchema = new mongoose.Schema({
  city: String,
  date: String,
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  dominantCondition: String,
});

const Weather = mongoose.models.Weather || mongoose.model('Weather', weatherSchema);
const DailySummary = mongoose.models.DailySummary || mongoose.model('DailySummary', dailySummarySchema);

export { Weather, DailySummary };
// module.exports = {Weather, DailySummary}
