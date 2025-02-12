from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Load all data when the server starts
try:
    # Load player data
    players_df = pd.read_csv('nba.csv')
    players_df['Player'] = players_df['Player'].astype(str)
    players_df['Pos'] = players_df['Pos'].astype(str)
    players_df['Tm'] = players_df['Tm'].astype(str)

    # Load team data
    teams_df = pd.read_csv('nbaallelo.csv')
    teams_df['date_game'] = pd.to_datetime(teams_df['date_game'])
    teams_df = teams_df[teams_df['lg_id'] == 'NBA']  # Filter for NBA games only

    # Load franchise data
    franchise_df = pd.read_csv('frenchise.CSV')

except Exception as e:
    print(f"Error loading data: {str(e)}")
    players_df = None
    teams_df = None
    franchise_df = None

@app.route('/api/players', methods=['GET'])
def get_players():
    try:
        search_term = request.args.get('search', '').lower()
        
        if players_df is not None:
            if search_term:
                filtered_players = players_df[players_df['Player'].str.lower().str.contains(search_term, na=False)]
            else:
                filtered_players = players_df
                
            players_list = filtered_players['Player'].tolist()
            return jsonify(players_list)
        return jsonify([])
    except Exception as e:
        print(f"Error in get_players: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/teams', methods=['GET'])
def get_teams():
    try:
        if teams_df is not None:
            # Get unique teams from the franchise data
            teams_list = franchise_df['Team'].unique().tolist()
            return jsonify(teams_list)
        return jsonify([])
    except Exception as e:
        print(f"Error in get_teams: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/team/<team_id>', methods=['GET'])
def get_team_stats(team_id):
    try:
        if teams_df is None or franchise_df is None:
            print(f"Error: Data not loaded - teams_df: {teams_df is not None}, franchise_df: {franchise_df is not None}")
            return jsonify({'error': 'Data not loaded properly'}), 500

        # Get team info from franchise data
        team_info = franchise_df[franchise_df['Team'] == team_id]
        
        if team_info.empty:
            print(f"Error: Team {team_id} not found in franchise data")
            return jsonify({'error': f'Team {team_id} not found'}), 404
            
        team_info = team_info.iloc[0]
        
        # Get recent team games
        team_games = teams_df[teams_df['team_id'] == team_id].sort_values('date_game', ascending=False)
        
        if team_games.empty:
            print(f"Error: No games found for team {team_id}")
            return jsonify({'error': f'No games found for team {team_id}'}), 404
        
        recent_games = team_games.head(10)  # Last 10 games
        
        # Calculate team statistics
        team_stats = {
            'name': team_id,
            'info': {
                'fullName': team_info['Full_Name'],
                'league': team_info['League'],
                'conference': team_info['Conference'],
                'division': team_info['Division']
            },
            'recentGames': recent_games[['date_game', 'game_result', 'pts', 'opp_pts', 'elo_n']].to_dict('records'),
            'seasonStats': {
                'wins': len(team_games[team_games['game_result'] == 'W']),
                'losses': len(team_games[team_games['game_result'] == 'L']),
                'avgPoints': float(team_games['pts'].mean()),
                'avgPointsAllowed': float(team_games['opp_pts'].mean()),
                'currentElo': float(team_games.iloc[0]['elo_n']) if not team_games.empty else None
            }
        }
        return jsonify(team_stats)
    
    except Exception as e:
        print(f"Error in get_team_stats for team {team_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/player/<name>', methods=['GET'])
def get_player_stats(name):
    try:
        if players_df is not None:
            player_data = players_df[players_df['Player'] == name]
            
            if not player_data.empty:
                # Add debug logging
                print(f"Player position for {name}: {player_data['Pos'].values[0]}")
                
                player_stats = {
                    'name': name,
                    'position': player_data['Pos'].values[0],
                    'team': player_data['Tm'].values[0],
                    'basicStats': {
                        'pointsPerGame': float(player_data['PTS'].values[0]),
                        'reboundsPerGame': float(player_data['TRB'].values[0]),
                        'assistsPerGame': float(player_data['AST'].values[0]),
                        'fieldGoalPercentage': float(player_data['FG%'].values[0] * 100),
                        'threePointPercentage': float(player_data['3P%'].values[0] * 100),
                        'freeThrowPercentage': float(player_data['FT%'].values[0] * 100)
                    },
                    'detailedStats': {
                        'gamesPlayed': int(player_data['G'].values[0]),
                        'minutesPerGame': float(player_data['MP'].values[0]),
                        'fieldGoalsPerGame': float(player_data['FG'].values[0]),
                        'fieldGoalAttempts': float(player_data['FGA'].values[0]),
                        'threePointersPerGame': float(player_data['3P'].values[0]),
                        'threePointAttempts': float(player_data['3PA'].values[0]),
                        'freeThrowsPerGame': float(player_data['FT'].values[0]),
                        'freeThrowAttempts': float(player_data['FTA'].values[0]),
                        'offensiveRebounds': float(player_data['ORB'].values[0]),
                        'defensiveRebounds': float(player_data['DRB'].values[0]),
                        'stealsPerGame': float(player_data['STL'].values[0]),
                        'blocksPerGame': float(player_data['BLK'].values[0]),
                        'turnovers': float(player_data['TOV'].values[0]),
                        'personalFouls': float(player_data['PF'].values[0])
                    },
                    'radarStats': {
                        'scoring': min(float(player_data['PTS'].values[0]) / 30, 1),
                        'rebounding': min(float(player_data['TRB'].values[0]) / 15, 1),
                        'playmaking': min(float(player_data['AST'].values[0]) / 10, 1),
                        'efficiency': float(player_data['FG%'].values[0]),
                        'defense': min((float(player_data['STL'].values[0]) + float(player_data['BLK'].values[0])) / 5, 1)
                    }
                }
                return jsonify(player_stats)
        
        return jsonify({'error': 'Player not found'}), 404
    except Exception as e:
        print(f"Error in get_player_stats: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/players/search', methods=['GET'])
def search_players_by_criteria():
    try:
        if players_df is None:
            return jsonify([])

        # Get search criteria from query parameters and convert to float, defaulting to 0
        try:
            min_points = float(request.args.get('min_points', 0))
        except (ValueError, TypeError):
            min_points = 0
            
        try:
            min_rebounds = float(request.args.get('min_rebounds', 0))
        except (ValueError, TypeError):
            min_rebounds = 0
            
        try:
            min_assists = float(request.args.get('min_assists', 0))
        except (ValueError, TypeError):
            min_assists = 0
            
        position = request.args.get('position', '').upper()
        team = request.args.get('team', '').upper()

        # Debug logging
        print(f"Search criteria - Position: {position}, Points: {min_points}, Rebounds: {min_rebounds}, Assists: {min_assists}, Team: {team}")

        # Start with all players
        filtered_df = players_df.copy()

        # Apply filters based on criteria only if they are greater than 0
        if min_points > 0:
            filtered_df = filtered_df[filtered_df['PTS'] >= min_points]
        if min_rebounds > 0:
            filtered_df = filtered_df[filtered_df['TRB'] >= min_rebounds]
        if min_assists > 0:
            filtered_df = filtered_df[filtered_df['AST'] >= min_assists]
        if position:
            # Handle position search more flexibly
            position_mask = filtered_df['Pos'].str.contains(position, case=False, na=False)
            filtered_df = filtered_df[position_mask]
            print(f"Players found for position {position}: {len(filtered_df)}")
        if team:
            filtered_df = filtered_df[filtered_df['Tm'] == team]

        # Sort by points in descending order
        filtered_df = filtered_df.sort_values('PTS', ascending=False)

        # Get the filtered players with their stats
        players_list = filtered_df.apply(lambda row: {
            'name': row['Player'],
            'position': row['Pos'],
            'team': row['Tm'],
            'points': float(row['PTS']),
            'rebounds': float(row['TRB']),
            'assists': float(row['AST']),
            'gamesPlayed': int(row['G']),
            'minutesPerGame': float(row['MP']),
            'fieldGoalPercentage': float(row['FG%'] * 100),
            'threePointPercentage': float(row['3P%'] * 100)
        }, axis=1).tolist()

        return jsonify(players_list)
    except Exception as e:
        print(f"Error in search_players_by_criteria: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 