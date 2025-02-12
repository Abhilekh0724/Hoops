import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Chip,
} from '@mui/material';
import axios from 'axios';

const positions = ['', 'G', 'F', 'C', 'PG', 'SG', 'SF', 'PF'];

const AdvancedPlayerSearch = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    min_points: '',
    min_rebounds: '',
    min_assists: '',
    position: 'SG',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialPlayers = async () => {
      try {
        await handleSearch();
      } catch (error) {
        console.error('Error loading initial players:', error);
        setError('Failed to load initial players');
      }
    };
    
    loadInitialPlayers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]); // Clear previous results

    try {
      const params = new URLSearchParams();
      
      // Always include position if it's set
      if (searchCriteria.position) {
        params.append('position', searchCriteria.position);
      }

      // Add other numeric criteria only if they're greater than 0
      ['min_points', 'min_rebounds', 'min_assists'].forEach(key => {
        const value = searchCriteria[key];
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
          params.append(key, value);
        }
      });

      const url = `http://localhost:5000/api/players/search?${params}`;
      console.log('🚀 Making request to:', url);

      const response = await axios.get(url);
      console.log('✅ API Response Data:', response.data);

      let playerData = Array.isArray(response.data) ? response.data : [];
      console.log('✅ Processed Players Count:', playerData.length);
      setResults(playerData);
    } catch (error) {
      console.error('❌ Error searching players:', error);
      setError(error.message || 'Failed to search players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 Results state updated:', results.length, 'players', results);
  }, [results]);

  const renderTable = () => {
    console.log('📊 Rendering table with', results.length, 'players');
    if (!results || results.length === 0) {
      return null;
    }

    // Sort results by points in descending order
    const sortedResults = [...results].sort((a, b) => (b.points || 0) - (a.points || 0));

    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#FF4B2B' }}>
          Showing {sortedResults.length} players sorted by points per game
        </Typography>
        <TableContainer 
          component={Paper} 
          sx={{ 
            maxHeight: '70vh', 
            overflow: 'auto',
            background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '& .MuiTableCell-root': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
              background: '#FF4B2B',
              color: 'white',
              fontWeight: 'bold',
            }
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Player</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Team</TableCell>
                <TableCell align="right">PPG</TableCell>
                <TableCell align="right">RPG</TableCell>
                <TableCell align="right">APG</TableCell>
                <TableCell align="right">FG%</TableCell>
                <TableCell align="right">3P%</TableCell>
                <TableCell align="right">GP</TableCell>
                <TableCell align="right">MPG</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedResults.map((player, index) => {
                const formatNumber = (value) => (value !== null && value !== undefined ? Number(value).toFixed(1) : 'N/A');
                const formatPercentage = (value) => (value !== null && value !== undefined ? `${Number(value).toFixed(1)}%` : 'N/A');

                return (
                  <TableRow
                    key={`${player.name}-${player.team}-${index}`}
                    sx={{
                      backgroundColor: index < 3 ? 'rgba(255, 75, 43, 0.1)' : 'inherit',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 75, 43, 0.2)',
                      },
                    }}
                  >
                    <TableCell>
                      {index + 1}
                      {index < 3 && (
                        <Chip 
                          size="small" 
                          label={['🥇', '🥈', '🥉'][index]} 
                          sx={{ 
                            ml: 1,
                            backgroundColor: 'rgba(255, 75, 43, 0.8)',
                            color: 'white',
                          }} 
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: index < 3 ? 'bold' : 'normal',
                          color: index < 3 ? '#FF4B2B' : 'inherit'
                        }}
                      >
                        {player.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{player.position || 'Unknown'}</TableCell>
                    <TableCell>{player.team || 'Unknown'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#FF4B2B' }}>
                      {formatNumber(player.points)}
                    </TableCell>
                    <TableCell align="right">{formatNumber(player.rebounds)}</TableCell>
                    <TableCell align="right">{formatNumber(player.assists)}</TableCell>
                    <TableCell align="right">{formatPercentage(player.fieldGoalPercentage)}</TableCell>
                    <TableCell align="right">{formatPercentage(player.threePointPercentage)}</TableCell>
                    <TableCell align="right">{player.gamesPlayed}</TableCell>
                    <TableCell align="right">{formatNumber(player.minutesPerGame)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box>
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Typography variant="h6" gutterBottom>
          Advanced Player Search
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField 
              fullWidth 
              label="Min Points" 
              name="min_points" 
              id="min-points-input"
              type="number" 
              value={searchCriteria.min_points} 
              onChange={handleChange} 
              inputProps={{ min: 0, step: 0.1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 75, 43, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF4B2B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF4B2B',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField 
              fullWidth 
              label="Min Rebounds" 
              name="min_rebounds" 
              id="min-rebounds-input"
              type="number" 
              value={searchCriteria.min_rebounds} 
              onChange={handleChange} 
              inputProps={{ min: 0, step: 0.1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 75, 43, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF4B2B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF4B2B',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField 
              fullWidth 
              label="Min Assists" 
              name="min_assists" 
              id="min-assists-input"
              type="number" 
              value={searchCriteria.min_assists} 
              onChange={handleChange} 
              inputProps={{ min: 0, step: 0.1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 75, 43, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF4B2B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF4B2B',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField 
              fullWidth 
              select 
              label="Position" 
              name="position" 
              id="position-select"
              value={searchCriteria.position} 
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 75, 43, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF4B2B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF4B2B',
                  },
                },
              }}
            >
              {positions.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos || 'Any Position'}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleSearch} 
              disabled={loading} 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53 30%, #FF4B2B 90%)',
                },
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {loading && <Typography sx={{ mb: 2 }}>Loading...</Typography>}
      {!loading && !error && renderTable()}
    </Box>
  );
};

export default AdvancedPlayerSearch;
