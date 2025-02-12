import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StatBox = ({ label, value, unit = '' }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <Typography 
      variant="h4" 
      sx={{ 
        color: '#FF4B2B',
        fontWeight: 'bold',
        wordBreak: 'break-word',
        width: '100%',
        mb: 1
      }}
    >
      {typeof value === 'number' ? value.toFixed(1) : value}
      {unit}
    </Typography>
    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
      {label}
    </Typography>
  </Box>
);

const PlayerStats = ({ stats }) => {
  if (!stats || !stats.basicStats || !stats.detailedStats) {
    return null;
  }

  const { basicStats, detailedStats } = stats;

  return (
    <Box>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <StatBox
            label="Points per Game"
            value={basicStats.pointsPerGame || 0}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox
            label="Rebounds per Game"
            value={basicStats.reboundsPerGame || 0}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox
            label="Assists per Game"
            value={basicStats.assistsPerGame || 0}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <StatBox
            label="Field Goal %"
            value={basicStats.fieldGoalPercentage || 0}
            unit="%"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox
            label="3-Point %"
            value={basicStats.threePointPercentage || 0}
            unit="%"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox
            label="Free Throw %"
            value={basicStats.freeThrowPercentage || 0}
            unit="%"
          />
        </Grid>
      </Grid>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Detailed Statistics</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {Object.entries(detailedStats).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <Typography variant="subtitle2">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Typography>
                <Typography variant="body1">{value || 0}</Typography>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default PlayerStats; 