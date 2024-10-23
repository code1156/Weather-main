// components/TemperatureChart.js
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './TemperatureChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TemperatureChart = ({ weatherData, unit }) => {
  // Helper function to format the data for each city
  const formatChartData = (city) => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const last24Hours = currentTime - 24 * 60 * 60; // Time 24 hours ago in seconds

    // Filter data for the last 24 hours
    const cityData = weatherData
      .filter((data) => data.city === city && data.dt >= last24Hours)
      .sort((a, b) => a.dt - b.dt); // Sort data by timestamp in ascending order

    // Convert temperatures to Fahrenheit if needed
    const tempData = cityData.map((entry) =>
      unit === 'F' ? (entry.temp * 9) / 5 + 32 : entry.temp
    );

    return {
      labels: cityData.map((entry) =>
        new Date(entry.dt * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false, // Use 24-hour format for clarity
        })
      ),
      datasets: [
        {
          label: `${city} Temperature (°${unit})`,
          data: tempData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4, // Adjust for smoother curves
        },
      ],
    };
  };

  // Extract unique cities from the weather data
  const cities = [...new Set(weatherData.map((data) => data.city))];

  return (
    <div className={styles.chartContainer}>
      {cities.map((city) => (
        <div key={city} className={styles.chart}>
          <h3>{city}</h3>
          <Line
            data={formatChartData(city)}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: `Temperature Trend for ${city}`,
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Time (HH:MM)',
                  },
                  ticks: {
                    autoSkip: false,
                    maxTicksLimit: 8, // Limit to ensure clear labeling
                    callback: function (value, index, values) {
                      // Show time every 3 hours
                      const date = new Date(values[index].value);
                      if (date.getHours() % 3 === 0) {
                        return date.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        });
                      }
                      return null; // Skip labels that aren't on the 3-hour mark
                    },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: `Temperature (°${unit})`,
                  },
                  ticks: {
                    stepSize: 1, // Adjust step size based on the unit
                    callback: function (value) {
                      return value + `°${unit}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default TemperatureChart;
