# Weather Monitoring Application

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Design Choices](#design-choices)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)

## Introduction
The Weather Monitoring Application provides real-time weather data for multiple cities in India. It allows users to view temperature trends, including daily summaries and detailed charts, helping them make informed decisions based on current and historical weather conditions. The application is built using Next.js for the frontend and Express with MongoDB for the backend.

## Features
- **Real-Time Weather Data**: Fetches current weather data from OpenWeatherMap API every 5 minutes.
- **Daily Summaries**: Automatically calculates and stores daily average, maximum, and minimum temperatures for each city.
- **Temperature Charts**: Visualizes temperature data over the past week for selected cities using responsive charts.
- **Alerts**: Sends alerts when temperature thresholds are exceeded or when specific weather conditions occur.
- **City Selection**: Users can select from a list of cities to view weather data.
- **Responsive Design**: The application is designed to work on various devices, ensuring accessibility and usability.

## Design Choices
- **Frontend**: Utilizes Next.js for server-side rendering and dynamic page routing, enhancing SEO and performance.
- **Backend**: An Express server manages API requests, while MongoDB stores weather data and user settings, ensuring scalability and reliability.
- **Data Fetching**: The application employs Axios for API calls and integrates a cron job for regular data updates to the database from the OpenWeather API.
- **Charting**: Utilizes Chart.js for data visualization, providing a smooth and interactive user experience.

## Dependencies
To run this application, you need the following dependencies:

### Backend
- **Express**: Web framework for Node.js.
- **Mongoose**: MongoDB object modeling tool.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Dotenv**: Module to load environment variables from a `.env.local` file.
- **Node-Cron**: A cron-like job scheduler for Node.js.

### Frontend
- **Next.js**: React framework for building server-side rendered applications.
- **Chart.js**: Library for creating responsive charts.

## Installation
Follow these steps to set up and run the application:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/weather-monitoring-app.git
   cd weather-monitoring-app

2. **Install dependencies**:
   ```bash
   npm i
3. **Configure environment variables**: Create a .env.local file in the root of the server directory and add your MongoDB URI and OpenWeatherMap API key:
   ```bash
   MONGO_URI=your_mongodb_uri
   NEXT_PUBLIC_API_KEY=your_openweathermap_api_key
4. **Run the server**:
   ```bash
   node server.js
5. **Run the NextJs Application**:
   ```bash
   npm run dev

## Usage

### Accessing the Application
- Open your web browser and navigate to `http://localhost:3000` after starting the frontend application. This will load the main dashboard of the weather monitoring system.

### Selecting a City
- At the top of the dashboard, you will find a dropdown menu labeled **Select City**.
- Click on the dropdown to view a list of available cities. You can choose any city to display its weather data and temperature charts.
- The default selected city will be the first city in the list.

### Viewing Temperature Charts
- Once you select a city, a temperature summary chart will be displayed below the city selection dropdown.
- The chart shows three datasets:
  - **Average Temperature (°C)**: Represented by a smooth line (in teal) showing the average temperatures over the past week.
  - **Max Temperature (°C)**: Represented by a line (in red) showing the highest recorded temperatures for each day.
  - **Min Temperature (°C)**: Represented by a line (in blue) indicating the lowest recorded temperatures for each day.
- Hovering over the chart will display tooltips with specific temperature values for each day.

### Navigating Between Weeks
- Two buttons labeled **Previous Week** and **Next Week** are available beside the city selection dropdown.
- Click on **Previous Week** to view temperature data for the week prior to the currently selected week.
- Click on **Next Week** to view the upcoming week’s data (if available).
- The charts will update automatically to reflect the selected week’s data.

### Customizing Alerts
- The application includes customizable settings for temperature thresholds and weather conditions that trigger alerts.
- You can modify these settings by updating the values in the **Settings** section of your application. Adjust the temperature threshold to set the maximum temperature that should trigger an alert and specify any weather conditions (like Rain, Thunderstorm, etc.) that should also trigger notifications.
- The system will log alerts to the console when conditions are met, ensuring you’re always informed of significant weather changes.

### Real-Time Data Updates
- The application is designed to fetch real-time weather data and perform regular updates using a cron job in the backend.
- Every minute, the backend fetches the latest weather data for all cities, storing it in the database. Alerts will be triggered based on the defined conditions.

### Monitoring Alerts
- Alerts regarding temperature thresholds and significant weather conditions will be logged in the console output of the backend server. You can monitor these alerts for any critical weather updates.

### Accessing Daily Summary Data
- The application compiles daily summaries of weather data for each city. Users can access these summaries by selecting different dates to visualize historical weather patterns over time.

This comprehensive overview of the usage should provide users with clear instructions on how to interact with the application effectively.

## Testing

- Use the scripts folder in the repository to manage the database for testing
  ```bash
  node scripts/emptySummaries.js
  node scripts/emptyWeather.js
  node scripts/addSampleData.js
  node scripts/addSummaryData.js
