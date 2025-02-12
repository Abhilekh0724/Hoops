import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tooltip as MuiTooltip,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Line, Pie, Scatter, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
        padding: 20,
        font: {
          size: 12
        }
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#FF4B2B',
      bodyColor: 'white',
      padding: 12,
      cornerRadius: 8,
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
  },
};

const PlayerAnalytics = ({ stats }) => {
  if (!stats || !stats.basicStats || !stats.detailedStats) {
    return null;
  }

  const { basicStats, detailedStats } = stats;

  // Enhanced Scoring Distribution Data
  const scoringData = {
    labels: ['2PT FG', '3PT FG', 'FT'],
    datasets: [{
      label: 'Points Distribution',
      data: [
        (detailedStats.fieldGoalsPerGame - detailedStats.threePointersPerGame) * 2,
        detailedStats.threePointersPerGame * 3,
        detailedStats.freeThrowsPerGame,
      ],
      backgroundColor: [
        'rgba(255, 75, 43, 0.8)',
        'rgba(255, 142, 83, 0.8)',
        'rgba(255, 206, 86, 0.8)',
      ],
      borderColor: [
        'rgba(255, 75, 43, 1)',
        'rgba(255, 142, 83, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Enhanced Efficiency Metrics with Attempts
  const efficiencyData = {
    labels: ['Field Goal', 'Three Point', 'Free Throw'],
    datasets: [
      {
        label: 'Success Rate (%)',
        data: [
          basicStats.fieldGoalPercentage,
          basicStats.threePointPercentage,
          basicStats.freeThrowPercentage,
        ],
        backgroundColor: 'rgba(255, 75, 43, 0.2)',
        borderColor: 'rgba(255, 75, 43, 1)',
        borderWidth: 2,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Attempts per Game',
        data: [
          detailedStats.fieldGoalAttempts,
          detailedStats.threePointAttempts,
          detailedStats.freeThrowAttempts,
        ],
        backgroundColor: 'rgba(255, 142, 83, 0.2)',
        borderColor: 'rgba(255, 142, 83, 1)',
        borderWidth: 2,
        fill: true,
        yAxisID: 'y1',
      }
    ],
  };

  const efficiencyOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        title: {
          display: true,
          text: 'Success Rate (%)',
          color: 'rgba(255, 75, 43, 1)',
        },
        position: 'left',
      },
      y1: {
        ...chartOptions.scales.y,
        title: {
          display: true,
          text: 'Attempts per Game',
          color: 'rgba(255, 142, 83, 1)',
        },
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Enhanced Performance Data with More Metrics
  const performanceData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Points',
        data: [
          basicStats.pointsPerGame * 0.25,
          basicStats.pointsPerGame * 0.28,
          basicStats.pointsPerGame * 0.22,
          basicStats.pointsPerGame * 0.25,
        ],
        backgroundColor: 'rgba(255, 75, 43, 0.8)',
        stack: 'Stack 0',
      },
      {
        label: 'Assists',
        data: [
          basicStats.assistsPerGame * 0.25,
          basicStats.assistsPerGame * 0.28,
          basicStats.assistsPerGame * 0.22,
          basicStats.assistsPerGame * 0.25,
        ],
        backgroundColor: 'rgba(255, 142, 83, 0.8)',
        stack: 'Stack 1',
      },
      {
        label: 'Rebounds',
        data: [
          basicStats.reboundsPerGame * 0.25,
          basicStats.reboundsPerGame * 0.28,
          basicStats.reboundsPerGame * 0.22,
          basicStats.reboundsPerGame * 0.25,
        ],
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
        stack: 'Stack 2',
      },
    ],
  };

  // Enhanced Production Metrics
  const productionData = {
    labels: ['Scoring', 'Playmaking', 'Rebounding', 'Defense', 'Efficiency'],
    datasets: [{
      label: 'Player Production Metrics',
      data: [
        (basicStats.pointsPerGame / 30) * 100,
        (basicStats.assistsPerGame / 10) * 100,
        (basicStats.reboundsPerGame / 15) * 100,
        ((detailedStats.stealsPerGame + detailedStats.blocksPerGame) / 5) * 100,
        basicStats.fieldGoalPercentage,
      ],
      backgroundColor: 'rgba(255, 75, 43, 0.2)',
      borderColor: 'rgba(255, 75, 43, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(255, 75, 43, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 75, 43, 1)',
    }],
  };

  const productionOptions = {
    ...chartOptions,
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
  };

  // Enhanced Scatter Plot Data
  const scatterData = {
    datasets: [
      {
        label: 'Points vs Minutes',
        data: Array.from({ length: 10 }, (_, i) => ({
          x: detailedStats.minutesPerGame * (0.8 + i * 0.04),
          y: basicStats.pointsPerGame * (0.8 + i * 0.04),
        })),
        backgroundColor: 'rgba(255, 75, 43, 0.8)',
      },
      {
        label: 'Projected Performance',
        data: Array.from({ length: 5 }, (_, i) => ({
          x: detailedStats.minutesPerGame * (1.2 + i * 0.04),
          y: basicStats.pointsPerGame * (1.2 + i * 0.04),
        })),
        backgroundColor: 'rgba(255, 142, 83, 0.8)',
      },
    ],
  };

  const scatterOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        title: {
          display: true,
          text: 'Minutes Played',
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        ...chartOptions.scales.y,
        title: {
          display: true,
          text: 'Points Scored',
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: '#FF4B2B', mb: 3 }}>
        Advanced Player Analytics Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Scoring Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: 300,
          }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Scoring Distribution Analysis
            </Typography>
            <MuiTooltip title="Shows the breakdown of points scored from different shot types">
              <Box sx={{ height: '100%' }}>
                <Pie data={scoringData} options={chartOptions} />
              </Box>
            </MuiTooltip>
          </Paper>
        </Grid>

        {/* Efficiency Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: 300,
          }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Shooting Efficiency & Volume Analysis
            </Typography>
            <MuiTooltip title="Compares shooting percentages with attempt volume">
              <Box sx={{ height: '100%' }}>
                <Line data={efficiencyData} options={efficiencyOptions} />
              </Box>
            </MuiTooltip>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: 300,
          }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Quarter-by-Quarter Performance Analysis
            </Typography>
            <MuiTooltip title="Shows distribution of key stats across quarters">
              <Box sx={{ height: '100%' }}>
                <Bar data={performanceData} options={chartOptions} />
              </Box>
            </MuiTooltip>
          </Paper>
        </Grid>

        {/* Production Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: 300,
          }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Overall Production Analysis
            </Typography>
            <MuiTooltip title="Comprehensive view of player's production across key metrics">
              <Box sx={{ height: '100%' }}>
                <Radar data={productionData} options={productionOptions} />
              </Box>
            </MuiTooltip>
          </Paper>
        </Grid>

        {/* Minutes vs Production with Projection */}
        <Grid item xs={12}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: 300,
          }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Minutes-Production Correlation & Projection
            </Typography>
            <MuiTooltip title="Shows current performance and projected potential based on minutes played">
              <Box sx={{ height: '100%' }}>
                <Scatter data={scatterData} options={scatterOptions} />
              </Box>
            </MuiTooltip>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerAnalytics; 