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

const TemperatureChart = ({ weatherData }) => {
  // Helper function to format the data for each city
  const formatChartData = (city) => {
    const cityData = weatherData.filter((data) => data.city === city);
    return {
      labels: cityData.map((entry) => new Date(entry.dt * 1000).toLocaleTimeString()),
      datasets: [
        {
          label: `${city} Temperature (°C)`,
          data: cityData.map((entry) => entry.temp),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
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
                    text: 'Time',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Temperature (°C)',
                  },
                  ticks: {
                    callback: function (value) {
                      return value + '°C';
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
