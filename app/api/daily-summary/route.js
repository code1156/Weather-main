// app/api/daily-summary/route.js

import dbConnect from '@/utils/dbConnect'; // Connect to MongoDB
import {DailySummary} from '@/models/Weather'; // Your DailySummary model

export async function GET(req) {
    try {
      await dbConnect(); // Connect to the database
      const { searchParams } = new URL(req.url);
      const date = searchParams.get('date');
      const city = searchParams.get('city'); // Get city from query parameters
  
      const summaries = await DailySummary.find({ date, city }); // Fetch summaries for the given date and city
  
      return new Response(JSON.stringify(summaries), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error in GET /api/daily-summary:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
