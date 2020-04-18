from flask import Flask, render_template, request, jsonify
import pymysql
import json
import spotipy
import spotipy.util as util
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

f = open('config.json')
data = json.load(f)

f2 = open('secrets.json')
secrets = json.load(f2)
clientId = secrets['clientId']
secret = secrets['secret']


class Database:
    def __init__(self):
        host = data['hostInfo']
        user = data['userInfo']
        password = data['passwordInfo']
        db = data['databaseInfo']
        self.con = pymysql.connect(host=host, user=user, password=password, db=db, cursorclass=pymysql.cursors.DictCursor)
        self.cur = self.con.cursor()

    def list_users(self):
        self.cur.execute("SELECT id, email, password from Users")
        result = self.cur.fetchall()
        return result

    def insert_user(self, email, password):
        self.cur.execute("INSERT INTO Users(email, password) VALUES(%s, %s)", (email, password))

@app.route('/api/', methods=['GET', 'POST'])
def home():
    db = Database()
    if request.method == "POST":
        payload = request.get_json()
        email = payload['email']
        password = payload['password']
        db.insert_user(email, password)
        db.con.commit()
        return jsonify(message='Post Success')
    elif request.method == "GET":
        users = db.list_users()
        return jsonify(users)

@app.route('/api/Spotify/search/', methods=['POST'])
def search():
    payload = request.get_json()
    token = spotify_authenticate(clientId, secret)
    search_url = 'https://api.spotify.com/v1/search'
    search_txt = payload['search_text']
    #search_txt = 'blinding lights'
    if search_txt == '':
        search_txt = request.args.get('search_text','')

    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {}'.format(token),
    }
    params = (
        ('q', '{}*'.format(search_txt)),
        ('type', 'track'),
        ('limit', 10)
    )

    response = requests.get(search_url, headers=headers, params=params).json()
    songs = response['tracks']
    song = show_songs(songs)
    return jsonify(song)

@app.route('/api/Spotify/playlist/', methods=['POST'])
def playlist():
    payload = request.get_json()
    token = spotify_authenticate(clientId, secret)
    playlist_url = 'https://api.spotify.com/v1/playlists/'
    search_txt = payload['search_text']
    #search_txt = '6SXzRD2I9kBN4iFQt4Rn4B'
    playlist_url += search_txt
    if search_txt == '':
        search_txt = request.args.get('search_text','')

    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {}'.format(token),
    }
    params = (
        ('type', 'track'),
        ('limit', 100)
    )
    
    results = {}
    i = 0
    response = requests.get(playlist_url, headers=headers, params=params).json()
    songs = response['tracks']
    i = show_playlist(songs, results, i)
    nextList = songs['next']
    while nextList is not None:
        response = requests.get(nextList, headers=headers, params=params).json()
        songs = response['items']
        i = show_playlist(response, results, i)
        nextList = response['next']
    return jsonify(results)

def spotify_authenticate(spotify_client_id, spotify_client_secret):
    data = {'grant_type': 'client_credentials'}
    url = 'https://accounts.spotify.com/api/token'
    response = requests.post(url, data=data, auth=(spotify_client_id, spotify_client_secret))
    return response.json()['access_token']

def show_songs(tracks):
    songs = {}
    for i, item in enumerate(tracks['items']):
        song = item["name"]
        artist = item["artists"][0]["name"]
        ext_url = item["external_urls"]
        id = item["id"]
        songs[i] = {"song": song, "artist": artist, "url": ext_url['spotify'], "id": id}
    
    return songs

def show_playlist(tracks, results, i):
    songs = {}
    for il, item in enumerate(tracks['items']):
        it = item['track']
        song = it['name']
        artist = it['artists'][0]["name"]
        ext_url = it["external_urls"]
        id = it["id"]
        songs[i] = {"song": song, "artist": artist, "url": ext_url['spotify'], "id": id}
        i = i + 1
    results.update(songs)
    return i

if __name__ == '__main__':
    app.run(debug=True)
