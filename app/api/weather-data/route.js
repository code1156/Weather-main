// app/api/weather-data/route.js
import dbConnect from '@/utils/dbConnect.js';
import { Weather } from '@/models/Weather.js';

export async function GET(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch weather data from the Weather collection
    const weatherData = await Weather.find({});

    // Respond with the weather data
    return new Response(JSON.stringify(weatherData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return new Response(JSON.stringify({ error: 'Error fetching data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
