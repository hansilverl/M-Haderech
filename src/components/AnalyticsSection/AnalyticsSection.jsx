import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import useStatistics from '../../hooks/useStatistics';
import './AnalyticsSection.css';

// Register the necessary chart components and plugins
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const AnalyticsSection = () => {
  const { statistics, loading, error } = useStatistics();

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  // Assuming the statistics now has a field `helped_mothers_amount`
  const data = {
    labels: ['מספר אמהות שעזרנו להן'],
    datasets: [
      {
        label: 'סטטיסטיקות של העמותה',
        data: [statistics.helped_mothers_amount || 0],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 40, // Adjust bar thickness here
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false, // Disable the default tooltip
      },
      legend: {
        display: false, // Hide the legend
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        offset: -10, // Move the label
        formatter: (value) => value,
      },
    },
  };

  return (
    <section id="analytics" className="analytics-section">
      <div className="analytics-text">
        <h2>נתונים של העמותה</h2>
        <p>כאן ניתן לראות את נתונים שלנו לאורך החודשים האחרונים...</p>
      </div>
      <div className="analytics-chart">
        <Bar data={data} options={options} />
      </div>
    </section>
  );
};

export default AnalyticsSection;
