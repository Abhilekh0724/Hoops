from flask import Flask, render_template, request, flash, jsonify
import pandas as pd
import json
import plotly
import plotly.express as px
import os
from waitress import serve
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xls', 'xlsx', 'csv', 'xlsm', 'xlsb', 'odf', 'ods', 'odt'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_data(df):
    """Analyze any dataframe and create appropriate visualizations"""
    try:
        # Make a copy to avoid modifying the original dataframe
        df = df.copy()
        
        # Get numeric columns
        numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
        
        # Create visualizations
        if len(numeric_cols) >= 1:
            fig1 = px.bar(df, x=df.index, y=numeric_cols[0],
                          title=f'Distribution of {numeric_cols[0]}')
            
            fig2 = px.scatter(df, x=numeric_cols[0], y=numeric_cols[1],
                              title=f'{numeric_cols[0]} vs {numeric_cols[1]}') if len(numeric_cols) >= 2 else None
        else:
            fig1 = px.bar(df.iloc[:, 0].value_counts(), title=f'Distribution of {df.columns[0]}')
            fig2 = px.pie(df, names=df.columns[0], title=f'Distribution of {df.columns[0]}')

        return fig1, fig2, df

    except Exception as e:
        print(f"Error in analyze_data: {str(e)}")
        return None, None, df

@app.route('/api/players/search', methods=['GET'])
def search_players():
    try:
        # Load the data
        df = pd.read_csv('nba.csv')  # Ensure the file is present

        # Validate that the dataset exists
        if df is None or df.empty:
            return jsonify([])

        # Convert column names to lowercase for consistency
        df.columns = df.columns.str.lower()

        # Extract search parameters
        min_points = float(request.args.get('min_points', 0))
        min_rebounds = float(request.args.get('min_rebounds', 0))
        min_assists = float(request.args.get('min_assists', 0))
        position = request.args.get('position', '').upper()

        # Log the search criteria for debugging
        print(f"🔍 Search criteria: min_points={min_points}, min_rebounds={min_rebounds}, min_assists={min_assists}, position={position}")

        # Filter dataset based on criteria
        filtered_df = df.copy()
        if min_points > 0:
            filtered_df = filtered_df[filtered_df['pts'] >= min_points]
        if min_rebounds > 0:
            filtered_df = filtered_df[filtered_df['trb'] >= min_rebounds]
        if min_assists > 0:
            filtered_df = filtered_df[filtered_df['ast'] >= min_assists]
        if position:
            filtered_df = filtered_df[filtered_df['pos'].str.contains(position, case=False, na=False)]

        # Log the number of results found
        print(f"✅ Players found: {len(filtered_df)}")

        # Return formatted response
        return jsonify(filtered_df.to_dict(orient="records"))

    except Exception as e:
        print(f"❌ Error in search_players: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET', 'POST'])
def index():
    uploaded_data = None
    fig1, fig2 = None, None
    
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file selected')
            return render_template('index.html')

        file = request.files['file']
        if file.filename == '':
            flash('No file selected')
            return render_template('index.html')

        if file and allowed_file(file.filename):
            try:
                if file.filename.endswith('.csv'):
                    df = pd.read_csv(file)
                elif file.filename.endswith(('.xls', '.xlsx', '.xlsm', '.xlsb')):
                    df = pd.read_excel(file, engine='openpyxl')
                elif file.filename.endswith(('.ods', '.odt', '.odf')):
                    df = pd.read_excel(file, engine='odf')
                else:
                    flash('Unsupported file format')
                    return render_template('index.html')

                if df.empty:
                    flash('File contains no data')
                    return render_template('index.html')

                fig1, fig2, df = analyze_data(df)
                if fig1 is None:
                    flash('Error analyzing data')
                    return render_template('index.html')

                uploaded_data = df

            except Exception as e:
                flash(f'Error processing file: {str(e)}')
                return render_template('index.html')

    if uploaded_data is None:
        try:
            df = pd.read_excel('Active Franchise.xls')
            fig1, fig2, df = analyze_data(df)
        except:
            flash('No data available')
            return render_template('index.html')

    graph1JSON = json.dumps(fig1, cls=plotly.utils.PlotlyJSONEncoder) if fig1 else None
    graph2JSON = json.dumps(fig2, cls=plotly.utils.PlotlyJSONEncoder) if fig2 else None

    return render_template('index.html', 
                           graph1JSON=graph1JSON,
                           graph2JSON=graph2JSON,
                           stats_table=df.to_dict('records'),
                           columns=df.columns.tolist())

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == '--dev':
        app.run(debug=True)
    else:
        print("Server starting on http://127.0.0.1:8080")
        serve(app, host='127.0.0.1', port=8080)
