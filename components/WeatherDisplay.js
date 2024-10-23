"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import { fetchWeatherData } from "@/utils/fetchWeather.js"; // Use only fetchWeatherData
import styles from "./WeatherDisplay.module.css"; // Import the CSS module

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [unit, setUnit] = useState("C"); // State to track temperature unit
  const cities = ["Delhi", "Mumbai", "Chennai", "Bengaluru", "Kolkata", "Hyderabad"];
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all(cities.map((city) => fetchWeatherData(city)));
        setWeatherData(results);
        console.log("Weather data updated successfully");
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, []);

  const handleCardClick = (city) => {
    // Navigate to the /charts page with the selected city as a query parameter
    router.push(`/charts?city=${city}`);
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  const convertTemperature = (temp) => {
    if (!isNaN(temp)) {
      const temperature = parseFloat(temp); // Ensure the temperature is a number
      if (unit === "F") {
        return (temperature * 9) / 5 + 32; // Convert Celsius to Fahrenheit
      }
      return temperature; // Return Celsius by default
    }
    return null; // Return null if temp is invalid
  };

  const handleSettingsClick = () => {
    router.push('/settings'); // Navigate to the settings page
  };

  const handleSummaryClick = () => {
    router.push('/summary'); // Navigate to the summary page
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Weather Dashboard</h1>
      
      {/* Settings button */}
      <button className={styles.settingsButton} onClick={handleSettingsClick}>
        Settings
      </button>

      {/* Toggle unit button */}
      <button className={styles.toggleButton} onClick={toggleUnit}>
        Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
      </button>

      {/* Navigate to summary page button */}
      <button className={styles.summaryButton} onClick={handleSummaryClick}>
        Go to Summary
      </button>

      <div className={styles.cardsContainer}>
        {weatherData.map((data, index) => (
          <div
            key={index}
            className={styles.weatherCard}
            onClick={() => handleCardClick(cities[index])} // Set onClick handler
          >
            <h2 className={styles.cityName}>{cities[index]}</h2>
            <p className={styles.mainCondition}>Condition: {data.main}</p>
            <p className={styles.temp}>
              Temperature: {convertTemperature(data.temp)?.toFixed(2)}°{unit}
            </p>
            <p className={styles.feelsLike}>
              Feels Like: {convertTemperature(data.feels_like)?.toFixed(2)}°{unit}
            </p>
            <p className="flex float-right text-slate-600">
              Wind Speed: {data.wind}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDisplay;
