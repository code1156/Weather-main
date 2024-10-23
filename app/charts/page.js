"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TemperatureChart from '@/components/TemperatureChart.js';
import styles from './charts.module.css';

const ChartsPage = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [unit, setUnit] = useState('C'); // State for temperature unit (Celsius or Fahrenheit)

  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city'); // Read the city from the URL query parameter

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('/api/weather-data');
        const data = await response.json();
        setWeatherData(data);

        // Extract unique cities from the data
        const uniqueCities = [...new Set(data.map((entry) => entry.city))];
        setCities(uniqueCities);

        // If a city parameter exists in the URL, set it as the selected city, otherwise default to the first city
        if (cityParam) {
          setSelectedCity(cityParam);
        } else if (uniqueCities.length > 0) {
          setSelectedCity(uniqueCities[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    fetchWeatherData();

    const interval = setInterval(fetchWeatherData, 300000); // 300,000 ms = 5 minutes

    return () => clearInterval(interval); // Cleanup on unmount
  }, [cityParam]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'C' ? 'F' : 'C'));
  };

  // Filter data for the selected city and within the last 24 hours
  const filteredData = weatherData
    .filter((entry) => entry.city === selectedCity)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Weather Data</h1>
        <button onClick={toggleUnit} className={styles.toggleButton}>
          Toggle to {unit === 'C' ? 'Fahrenheit' : 'Celsius'}
        </button>
      </div>
      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <>
          {cities.length > 0 && (
            <div className={styles.selectContainer}>
              <label htmlFor="citySelect" className={styles.label}>Select City:</label>
              <select id="citySelect" value={selectedCity} onChange={handleCityChange} className={styles.citySelect}>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          )}
          <TemperatureChart weatherData={filteredData} unit={unit} />
        </>
      )}
    </div>
  );
};

export default ChartsPage;
