import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

const StatBox = ({ label, value, unit = '' }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: 'background.paper',
      boxShadow: 1,
      textAlign: 'center',
    }}
  >
    <Typography variant="h4" color="primary" gutterBottom>
      {typeof value === 'number' ? value.toFixed(1) : value}
      {unit}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

const TeamStats = ({ stats }) => {
  if (!stats || !stats.info || !stats.seasonStats || !stats.recentGames) {
    return null;
  }

  const { info, seasonStats, recentGames } = stats;

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" gutterBottom>Team Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Full Name:</strong> {info.fullName}
            </Typography>
            <Typography variant="body1">
              <strong>Conference:</strong> {info.conference}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Division:</strong> {info.division}
            </Typography>
            <Typography variant="body1">
              <strong>League:</strong> {info.league}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h5" gutterBottom>Season Statistics</Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <StatBox
            label="Win-Loss Record"
            value={`${seasonStats.wins}-${seasonStats.losses}`}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox
            label="Points Per Game"
            value={seasonStats.avgPoints}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox
            label="Points Allowed"
            value={seasonStats.avgPointsAllowed}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>Recent Games</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Result</TableCell>
              <TableCell align="right">Points</TableCell>
              <TableCell align="right">Opp. Points</TableCell>
              <TableCell align="right">ELO Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentGames.map((game, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(game.date_game).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={game.game_result}
                    color={game.game_result === 'W' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{game.pts}</TableCell>
                <TableCell align="right">{game.opp_pts}</TableCell>
                <TableCell align="right">{Math.round(game.elo_n)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeamStats; 