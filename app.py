from flask import Flask, render_template
from dotenv import load_dotenv # type: ignore
import os

load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/settings.html')
def settings():
    gemini_api_key = os.getenv('gemini_api_key')
    return render_template('settings.html',gemini_api_key=gemini_api_key)

@app.route('/game.html')
def game():
    return render_template('game.html')

@app.route('/manifest.json')
def serve_manifest():
    return app.send_static_file('manifest.json')

@app.route('/sw.js')
def serve_sw():
    return app.send_static_file('sw.js')
    

if __name__ == '__main__':
    app.run(debug=True)