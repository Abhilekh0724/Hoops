import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import scipy.stats as stats
import os

def load_data():
    try:
        # Load player data
        players_df = pd.read_csv('nba.csv')
        return players_df
    except Exception as e:
        st.error(f"Error loading data: {str(e)}")
        return None

def display_player_stats(player_data):
    """Display player statistics in a clean format"""
    # Create three columns for basic stats
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Points per Game", f"{player_data['PTS'].values[0]:.1f}")
    with col2:
        st.metric("Rebounds per Game", f"{player_data['TRB'].values[0]:.1f}")
    with col3:
        st.metric("Assists per Game", f"{player_data['AST'].values[0]:.1f}")
    
    # Create three more columns for advanced stats
    col4, col5, col6 = st.columns(3)
    
    with col4:
        st.metric("Field Goal %", f"{player_data['FG%'].values[0]:.1%}")
    with col5:
        st.metric("3-Point %", f"{player_data['3P%'].values[0]:.1%}")
    with col6:
        st.metric("Free Throw %", f"{player_data['FT%'].values[0]:.1%}")
    
    # Display detailed statistics in an expander
    with st.expander("View Detailed Statistics"):
        # Create a more detailed stats display
        detailed_stats = {
            'Games Played': player_data['G'].values[0],
            'Minutes per Game': player_data['MP'].values[0],
            'Field Goals per Game': player_data['FG'].values[0],
            'Field Goal Attempts': player_data['FGA'].values[0],
            '3-Pointers per Game': player_data['3P'].values[0],
            '3-Point Attempts': player_data['3PA'].values[0],
            'Free Throws per Game': player_data['FT'].values[0],
            'Free Throw Attempts': player_data['FTA'].values[0],
            'Offensive Rebounds': player_data['ORB'].values[0],
            'Defensive Rebounds': player_data['DRB'].values[0],
            'Steals per Game': player_data['STL'].values[0],
            'Blocks per Game': player_data['BLK'].values[0],
            'Turnovers': player_data['TOV'].values[0],
            'Personal Fouls': player_data['PF'].values[0]
        }
        
        # Convert to DataFrame for better display
        detailed_df = pd.DataFrame([detailed_stats]).T
        detailed_df.columns = ['Value']
        st.dataframe(detailed_df, use_container_width=True)

    # Create a radar chart for player attributes
    fig = plt.figure(figsize=(8, 8))
    categories = ['Scoring', 'Rebounding', 'Playmaking', 'Efficiency', 'Defense']
    
    # Calculate normalized values for each category
    scoring = (player_data['PTS'].values[0]) / 30  # Normalize against 30 PPG
    rebounding = (player_data['TRB'].values[0]) / 15  # Normalize against 15 RPG
    playmaking = (player_data['AST'].values[0]) / 10  # Normalize against 10 APG
    efficiency = player_data['FG%'].values[0]  # Already normalized
    defense = ((player_data['STL'].values[0] + player_data['BLK'].values[0]) / 5)  # Normalize against 5 stocks
    
    values = [scoring, rebounding, playmaking, efficiency, defense]
    values += values[:1]  # Repeat first value to close the polygon
    
    # Compute angle for each category
    angles = [n / float(len(categories)) * 2 * np.pi for n in range(len(categories))]
    angles += angles[:1]  # Repeat first angle to close the polygon
    
    # Create radar chart
    ax = plt.subplot(111, polar=True)
    plt.plot(angles, values)
    plt.fill(angles, values, alpha=0.25)
    
    # Set the labels
    plt.xticks(angles[:-1], categories)
    
    # Add title
    plt.title("Player Attribute Radar")
    
    st.pyplot(fig)

def main():
    st.set_page_config(page_title="NBA Player Stats Dashboard", layout="wide")
    
    # Add custom CSS
    st.markdown("""
        <style>
        .big-font {
            font-size:30px !important;
            font-weight: bold;
            color: #1f77b4;
        }
        </style>
    """, unsafe_allow_html=True)
    
    # Title with custom styling
    st.markdown('<p class="big-font">NBA Player Statistics Dashboard</p>', unsafe_allow_html=True)
    
    # Load data
    players_df = load_data()
    if players_df is None:
        return
    
    # Create a search box for players
    search_term = st.text_input("Search Player", "")
    
    # Filter players based on search term
    if search_term:
        filtered_players = players_df[players_df['Player'].str.contains(search_term, case=False, na=False)]
    else:
        filtered_players = players_df
    
    # Create player dropdown
    selected_player = st.selectbox(
        "Select Player",
        filtered_players['Player'].tolist(),
        index=0 if not filtered_players.empty else None
    )
    
    if selected_player:
        # Get player data
        player_data = players_df[players_df['Player'] == selected_player]
        
        # Display player info header
        st.markdown(f"### {selected_player} | {player_data['Pos'].values[0]} | {player_data['Tm'].values[0]}")
        st.markdown("---")
        
        # Display player statistics
        display_player_stats(player_data)

if __name__ == "__main__":
    main() 