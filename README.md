# NBA Player Trading Analysis Dashboard

## Project Overview
This project provides a comprehensive NBA player trading analysis dashboard that helps team managers and analysts make informed decisions about player trades. The dashboard offers detailed player statistics, team comparisons, and trade analysis tools to evaluate potential trades between teams.

## Features

### 1. Player Analysis
- View complete player statistics including:
  - Points per game
  - Rebounds
  - Assists
  - Age
  - Experience
  - Salary
- Interactive scatter plots comparing any two statistics
- Filter players by team and position

### 2. Team Comparisons
- Compare multiple teams' performance metrics
- Analyze team averages across different statistical categories
- Visualize team statistics through bar charts and scatter plots

### 3. Trade Analysis Tools
- Select players from different teams to analyze potential trades
- Compare trade packages with detailed statistics
- Evaluate salary implications of trades
- View statistical impact on both teams

## Getting Started

### Prerequisites
- Python 3.7+
- Required Python packages:
  ```
  streamlit
  pandas
  numpy
  matplotlib
  seaborn
  scipy
  ```

### Installation
1. Clone this repository
2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Ensure data files are present:
   - `nba.csv` (player statistics)
   - `nbaallelo.csv` (historical team data)

### Running the Dashboard
```bash
streamlit run dashboard.py
```

## Data Sources
- Player statistics from NBA.com
- Historical team data from FiveThirtyEight's NBA database
- Salary information from Basketball Reference

## How to Use

1. **Team Selection**
   - Choose your primary team from the sidebar
   - Select additional teams for comparison

2. **Player Analysis**
   - View detailed player statistics
   - Create custom statistical comparisons
   - Filter players by various metrics

3. **Trade Analysis**
   - Select players to trade from your team
   - Choose players to receive from other teams
   - Review trade package statistics and salary implications

## Contributing
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
