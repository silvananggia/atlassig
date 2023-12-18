import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartBar = ({ title, apiData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  // Extracting labels and data from API response
  const labels = apiData.map(item => item.jenisfaskes);
  const dataValues = apiData.map(item => parseInt(item.count, 10));

  // Define an array of colors to be used for each label
  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    // Add more colors as needed
  ];

  // Assign a color to each label dynamically
  const backgroundColors = labels.map((label, index) => colors[index % colors.length]);

  const chartData = {
    labels,
    datasets: [
      {
        
        
        label: 'Healthcare Facilities',
        data: dataValues,
        backgroundColor: backgroundColors,
      },
    ],
  };

  return (
    <div>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default ChartBar;
