import os
import json
from flask import Flask, render_template
from pymongo import MongoClient


app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'achievements')
COLLECTION_NAME = 'diagnostix'

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/stats')
def stats():
    return render_template('stats.html')


@app.route('/stats/details')
def get_stats():
    FIELDS = {
        '_id': False, 'progressState': True, 'titleAssociations': True, 'progression': True, 
        'rarity': True, 'isSecret': True, 'rewards': True
    }

    with MongoClient(MONGO_URI) as conn:
        collection = conn[DBS_NAME][COLLECTION_NAME]
        achievement_data = collection.find(projection=FIELDS)
        return json.dumps(list(achievement_data))

if __name__ == '__main__':
    app.run(debug=True)
