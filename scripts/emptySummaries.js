// deleteWeatherData.js
import mongoose from 'mongoose';
import { Weather, DailySummary } from '../models/Weather.js'; // Adjust the path based on your project structure
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' });
// Database connection string
const MONGODB_URI = process.env.MONGO_URI; // Ensure this is set in your environment variables

// Connect to the database and delete all entries
const deleteAllSummaryData = async () => {
  try {
    // Connect to the database
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Delete all entries from the Weather collection
    const result = await DailySummary.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} entries from the Weather collection.`);
  } catch (error) {
    console.error('Error deleting weather data:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
};

// Execute the function
deleteAllSummaryData();
