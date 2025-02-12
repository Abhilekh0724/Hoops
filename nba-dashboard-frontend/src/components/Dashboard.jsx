import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import axios from 'axios';
import PlayerStats from './PlayerStats';
import RadarChart from './RadarChart';
import PlayerAnalytics from './PlayerAnalytics';
import AdvancedPlayerSearch from './AdvancedPlayerSearch';
import SportBasketballIcon from '@mui/icons-material/SportsBasketball';
import BarChartIcon from '@mui/icons-material/BarChart';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (activeTab === 0 && inputValue && inputValue.length > 0) {
      const delayDebounceFn = setTimeout(() => {
        fetchPlayers(inputValue);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [inputValue, activeTab]);

  const fetchPlayers = async (search = '') => {
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/players?search=${search}`);
      const playersList = Array.isArray(response.data) ? response.data : [];
      const uniquePlayers = [...new Set(playersList.filter(player => player != null))].sort();
      setPlayers(uniquePlayers);
    } catch (error) {
      console.error('Error fetching players:', error);
      setError('Failed to fetch players. Please try again.');
      setPlayers([]);
    }
  };

  const fetchPlayerStats = async (playerName) => {
    if (!playerName) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/player/${encodeURIComponent(playerName)}`);
      setPlayerStats(response.data);
    } catch (error) {
      console.error('Error fetching player stats:', error);
      setError('Failed to fetch player statistics. Please try again.');
      setPlayerStats(null);
    }
    setLoading(false);
  };

  const handlePlayerChange = (event, newValue) => {
    setSelectedPlayer(newValue);
    if (newValue) {
      fetchPlayerStats(newValue);
    } else {
      setPlayerStats(null);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
    setInputValue('');
    setSelectedPlayer(null);
    setPlayerStats(null);
  };

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 4,
          background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
          borderRadius: 2,
          padding: 3,
          color: 'white',
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
        }}
      >
        <SportBasketballIcon sx={{ fontSize: 40, animation: 'spin 4s linear infinite' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          HOOPS
        </Typography>
        <BarChartIcon sx={{ fontSize: 30 }} />
        <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
          Analytics Dashboard
        </Typography>
      </Box>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ 
        mb: 3,
        background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '& .MuiTab-root': {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': {
            color: '#FF4B2B',
          },
        },
        '& .MuiTabs-indicator': {
          backgroundColor: '#FF4B2B',
        },
      }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Player Statistics" />
          <Tab label="Advanced Search" />
        </Tabs>
      </Paper>

      {activeTab === 1 ? (
        <AdvancedPlayerSearch />
      ) : (
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Autocomplete
            value={selectedPlayer}
            onChange={handlePlayerChange}
            inputValue={inputValue || ''}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue || '');
            }}
            options={players.filter(Boolean)}
            getOptionLabel={(option) => option?.toString() || ''}
            isOptionEqualToValue={(option, value) => 
              option === value || 
              (option?.toString() || '') === (value?.toString() || '')
            }
            renderInput={(params) => (
              <TextField
                {...params}
                id="player-search"
                label="Search Player"
                variant="outlined"
                aria-label="Search for a player"
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
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading && <CircularProgress color="inherit" size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            loading={loading}
            loadingText="Loading..."
            noOptionsText={inputValue?.length > 0 ? "No players found" : "Start typing to search"}
            filterOptions={(x) => x}
            ListboxProps={{
              sx: {
                maxHeight: '50vh',
                '& .MuiAutocomplete-option': {
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                }
              }
            }}
            sx={{
              '& .MuiAutocomplete-listbox': {
                backgroundColor: '#2d2d2d',
                color: 'white',
              },
              '& .MuiAutocomplete-option': {
                '&:hover': {
                  backgroundColor: 'rgba(255, 75, 43, 0.2)',
                },
                '&[aria-selected="true"]': {
                  backgroundColor: 'rgba(255, 75, 43, 0.3)',
                },
              },
            }}
          />
        </Paper>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {activeTab === 0 && playerStats && !loading && (
        <>
          <Paper sx={{ 
            p: 3, 
            mb: 3,
            background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Typography variant="h4" sx={{ color: '#FF4B2B' }}>{playerStats.name}</Typography>
              <Chip 
                label={playerStats.position || 'Unknown'} 
                sx={{ 
                  backgroundColor: 'rgba(255, 75, 43, 0.8)',
                  color: 'white',
                }} 
              />
              <Chip 
                label={playerStats.team || 'Unknown'} 
                sx={{ 
                  backgroundColor: 'rgba(255, 142, 83, 0.8)',
                  color: 'white',
                }} 
              />
            </Box>
            <PlayerStats stats={playerStats} />
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3,
                background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#FF4B2B' }}>
                  Player Attribute Radar
                </Typography>
                <RadarChart data={playerStats.radarStats} />
              </Paper>
            </Grid>
          </Grid>

          <Box mt={3}>
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <PlayerAnalytics stats={playerStats} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard; 