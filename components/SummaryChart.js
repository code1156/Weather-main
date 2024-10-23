"use client"; // This is a client component

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './SummaryChart.module.css'; // Assuming you're using CSS modules
import { set } from 'mongoose';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SummaryChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [cities, setCities] = useState([]); // State for storing cities
  const cities = ["Delhi", "Mumbai", "Chennai", "Bengaluru", "Kolkata", "Hyderabad"];
  const [selectedCity, setSelectedCity] = useState(''); // State for selected city

  useEffect(()=>{
    setSelectedCity(cities[0]);
  },[])
  const fetchData = async (date, city) => {
    if (!city) {
      console.error('City is not selected. Unable to fetch data.');
      return []; // Return empty array if no city is selected
    }
    try {
      const response = await axios.get(`/api/daily-summary?date=${date}&city=${city}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching temperature data:', error);
      return [];
    }
  };

  const processData = (data) => {
    const labels = data.map(item => item.date);
    const avgTemp = data.map(item => item.avgTemp);
    const maxTemp = data.map(item => item.maxTemp);
    const minTemp = data.map(item => item.minTemp);

    return {
      labels,
      datasets: [
        {
          label: 'Avg Temp (°C)',
          data: avgTemp,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
        {
          label: 'Max Temp (°C)',
          data: maxTemp,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        },
        {
          label: 'Min Temp (°C)',
          data: minTemp,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
      ],
    };
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (selectedCity) { // Only fetch data if a city is selected
        const weekData = await Promise.all(
          Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            return fetchData(date.toISOString().split('T')[0], selectedCity); // Fetch data for selected city
          })
        );

        const flattenedData = weekData.flat();
        const processedData = processData(flattenedData);
        setChartData(processedData);
      }
    };

    fetchAndSetData();
  }, [currentDate, selectedCity]); // Fetch data when the current date or selected city changes

  const handlePreviousWeek = () => {
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 7);
    setCurrentDate(previousDate);
  };

  const handleNextWeek = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 7);
    setCurrentDate(nextDate);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value); // Update selected city
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Temperature Summary</h2>

      <div className={styles.controls}>
        <div className={styles.citySelect}>
          <label htmlFor="city-select">Select City:</label>
          <select id="city-select" value={selectedCity} onChange={handleCityChange} className='text-black'>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.weekButtons}>
          <button onClick={handlePreviousWeek} className={styles.navButton}>Previous Week</button>
          <button onClick={handleNextWeek} className={styles.navButton}>Next Week</button>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <Line
          data={chartData} 
          options={{
            scales: {
              x: {
                reverse: true,
                ticks: {
                  autoSkip: false, // Ensures all labels are shown
                  maxRotation: 90, // Rotate labels for better visibility
                  minRotation: 90, // Set minimum rotation
                  padding: 10 // Adds padding between the x-axis and labels to prevent cutting off
                }
              }
            }
          }}/>
      </div>
    </div>
  );
};

export default SummaryChart;
