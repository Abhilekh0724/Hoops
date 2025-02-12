import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Box } from '@mui/material';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ data }) => {
  const chartData = {
    labels: ['Scoring', 'Rebounding', 'Playmaking', 'Efficiency', 'Defense'],
    datasets: [
      {
        label: 'Player Attributes',
        data: [
          data.scoring * 100,
          data.rebounding * 100,
          data.playmaking * 100,
          data.efficiency * 100,
          data.defense * 100,
        ],
        backgroundColor: 'rgba(144, 202, 249, 0.2)',
        borderColor: 'rgba(144, 202, 249, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(144, 202, 249, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(144, 202, 249, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
        },
        ticks: {
          backdropColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.7)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto' }}>
      <Radar data={chartData} options={options} />
    </Box>
  );
};

export default RadarChart; 