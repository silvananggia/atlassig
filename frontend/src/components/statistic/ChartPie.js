// FloatingButton.js

import React from "react";
import Typography from "@mui/material/Typography";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartBar = ({dataPie}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
        text: 'Perbandingan Jumlah Fasilitas Kesehatan',
      },
    },
  };
  const data = {
    labels: ['FKTP', 'FKRTL'],
    datasets: [
      {
        
        data: dataPie,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          
        ],
        borderWidth: 1,
      },
    ],
  };



  return (
    <div >
     <Pie  height={100} width={100} options={options} data={data} />
    </div>
  );
};

export default chartBar;
