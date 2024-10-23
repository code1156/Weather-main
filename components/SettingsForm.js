"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SettingsForm.module.css'; // Import the CSS module for styling

const SettingsForm = () => {
  const [temperatureThreshold, setTemperatureThreshold] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [weatherConditionsOptions, setWeatherConditionsOptions] = useState([]);

  useEffect(() => {
    // Fetch current settings when the component mounts
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings'); // API endpoint to get current settings
        setTemperatureThreshold(response.data.temperatureThreshold);
        setWeatherCondition(response.data.weatherCondition);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    // Fetch possible weather conditions (you can replace this with OpenWeather API call)
    const fetchWeatherConditions = async () => {
      try {
        // Normally you would fetch this from OpenWeather API, but we will use a predefined list for now
        const conditions = [
          'Clear', 'Clouds', 'Rain', 'Snow', 'Drizzle', 'Thunderstorm', 'Mist', 'Haze', 'Fog', 'Dust'
        ];
        setWeatherConditionsOptions(conditions);
      } catch (error) {
        console.error('Error fetching weather conditions:', error);
      }
    };

    fetchSettings();
    fetchWeatherConditions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/settings', {
        temperatureThreshold,
        weatherCondition,
      });
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Temperature Threshold (°C):
            <input
              className={styles.input}
              type="number"
              value={temperatureThreshold}
              onChange={(e) => setTemperatureThreshold(e.target.value)}
              required
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Weather Condition:
            <select
              className={styles.input}
              value={weatherCondition}
              onChange={(e) => setWeatherCondition(e.target.value)}
              required
            >
              <option value="" disabled>Select a condition</option>
              {weatherConditionsOptions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className={styles.submitButton}>Update Settings</button>
      </form>
    </div>
  );
};

export default SettingsForm;
