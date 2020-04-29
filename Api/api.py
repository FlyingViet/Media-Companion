from flask import Flask, render_template, request, jsonify
import pymysql
import json
import spotipy
import spotipy.util as util
import requests
from flask_cors import CORS
import yt

app = Flask(__name__)
CORS(app)

f = open('config.json')
data = json.load(f)

f2 = open('secrets.json')
secrets = json.load(f2)
clientId = secrets['clientId']
secret = secrets['secret']

youtube = None

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

    def insert_song(self, songName, songArtist, spotifyId, SpotifyUrl, uri):
        self.cur.execute("INSERT IGNORE INTO Songs(SongName, SongArtist, SpotifyID, SpotifyUrl, SpotifyUri) VALUES( %s, %s, %s, %s, %s)", (songName, songArtist, spotifyId, SpotifyUrl, uri))

    def insert_multiple_songs(self, songList):
        self.cur.executemany("""INSERT IGNORE INTO Songs(SongName, SongArtist, SpotifyID, SpotifyUrl, SpotifyUri) VALUES( %s, %s, %s, %s, %s)""", songList)

    def get_songs(self):
        self.cur.execute("SELECT SongId, SongName, SongArtist, SpotifyID, SpotifyUrl, SpotifyUri from Songs")
        result = self.cur.fetchall()
        return result

    def set_auth(self, userId):
        self.cur.execute("update Users set ytAuth=1 where id=%s", userId)

    def get_user(self, userId):
        self.cur.execute("select id, email, password, ytAuth from Users where id=%s", userId)
        result = self.cur.fetchall()
        return result


####################### DATABASE ######################################
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

@app.route('/api/Songs/', methods=['GET', 'POST'])
def getSongs():
    db = Database()
    if request.method == "GET":
        songs = db.get_songs()
        return jsonify(songs)
    elif request.method == "POST":
        payload = request.get_json()
        data = payload['list']
        playlist = []
        for item in data:
            name = item['song']
            artist = item['artist']
            spotifyId = item['id']
            spotifyUrl = item['url']
            uri = item['uri']
            form = (name, artist, spotifyId, spotifyUrl, uri)
            playlist.append(form)
        db.insert_multiple_songs(playlist)
        db.con.commit()
        return jsonify(data)

@app.route('/api/Song/', methods=['POST'])
def insertSong():
    db = Database()
    payload = request.get_json()
    name = payload['name']
    artist = payload['artist']
    spotifyId = payload['spotifyId']
    spotifyUrl = payload['spotifyUrl']
    uri = payload['spotifyUri']
    db.insert_song(name, artist, spotifyId, spotifyUrl, uri)
    db.con.commit()
    return jsonify(name=name, artist=artist, spotifyId=spotifyId, spotifyUrl=spotifyUrl, uri= uri)

####################### SPOTIFY ######################################
@app.route('/api/Spotify/search/', methods=['POST'])
def search():
    payload = request.get_json()
    token = spotify_authenticate(clientId, secret)
    search_url = 'https://api.spotify.com/v1/search'
    search_txt = payload['search_text']
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
    # search_txt = '37i9dQZF1DXcBWIGoYBM5M'
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
    playlistName = response['name']
    songs = response['tracks']
    i = show_playlist(songs, results, i)
    nextList = songs['next']
    while nextList is not None:
        response = requests.get(nextList, headers=headers, params=params).json()
        songs = response['items']
        i = show_playlist(response, results, i)
        nextList = response['next']
    return jsonify(playlistName, results)

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
        uri = item["uri"]
        id = item["id"]
        songs[i] = {"song": song, "artist": artist, "url": ext_url['spotify'], "id": id, "uri": uri}
    
    return songs

def show_playlist(tracks, results, i):
    songs = {}
    for il, item in enumerate(tracks['items']):
        it = item['track']
        song = it['name']
        artist = it['artists'][0]["name"]
        ext_url = it["external_urls"]
        id = it["id"]
        uri = it["uri"]
        songs[i] = {"song": song, "artist": artist, "url": ext_url['spotify'], "id": id, "uri":uri}
        i = i + 1
    results.update(songs)
    return i

####################### YOUTUBE ######################################
@app.route('/api/Youtube/Auth/', methods=['POST'])
def ytAuth():
    global youtube
    db = Database()
    payload = request.get_json()
    userId = payload['id']
    # userId = 1
    youtube = yt.auth(userId)
    if youtube is not None:
        db.set_auth(userId)
    auth = db.get_user(userId)
    return jsonify(auth)


if __name__ == '__main__':
    app.run(debug=True)
