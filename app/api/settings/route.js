import dbConnect from '@/utils/dbConnect'; // Ensure you have a dbConnect utility to connect to MongoDB
import Settings from '@/models/Settings'; // Your Settings model

// Handle POST requests for updating settings
export async function POST(req) {
  try {
    await dbConnect(); // Connect to the database

    // Parse the incoming request body
    const { temperatureThreshold, weatherCondition } = await req.json();

    // Ensure values are valid (optional)
    if (!temperatureThreshold || !weatherCondition) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update settings in the database
    await Settings.findOneAndUpdate(
      {},
      { temperatureThreshold, weatherCondition },
      { upsert: true, new: true }
    );

    return new Response(JSON.stringify({ message: 'Settings updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Log the exact error
    console.error('Error in POST /api/settings:', error);
    
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle GET requests to retrieve settings
export async function GET(req) {
  try {
    await dbConnect(); // Connect to the database

    // Retrieve settings from the database
    const settings = await Settings.findOne({}); // Find the settings document

    if (!settings) {
      return new Response(JSON.stringify({ error: 'Settings not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Log the exact error
    console.error('Error in GET /api/settings:', error);
    
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
