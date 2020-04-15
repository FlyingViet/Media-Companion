import os
from googleapiclient.discovery import build
import google_auth_oauthlib.flow

scopes = ['https://www.googleapis.com/auth/youtube']
client_secrets_file = "secret/client_secret.json"

# Get credentials and create an API client
redirect_uri = "http://localhost"
flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(client_secrets_file, scopes)
credentials = flow.run_console()
youtube = build('youtube', 'v3', credentials=credentials)


def search_song_title(name: str):
    s = youtube.search().list(q=name, part='snippet', type='video', maxResults=1)
    s_exe = s.execute()
    s_entry = s_exe['items'][0]
    print(s_entry)


def search_artist_name(artist: str):
    a = youtube.search().list(q=artist, part='snippet', type='channel', maxResults=1)
    a_exe = a.execute()
    a_entry = a_exe['items'][0]
    print(a_entry)

def all_user_playlist():
    p = youtube.playlists().list(part="snippet", mine=True)
    p_exe = p.execute()
    p_all = p_exe['items']
    print(p_all)

def search_user_playlist_name(pl: str):
    p = youtube.playlist().list(part="snippet", mine=True)
    p_exe = p.execute()
    p_all = p_exe['items']
    print(type(p_all))

search_song_title('Old Time Road')
search_artist_name('Drake')
all_user_playlist()
search_user_playlist_name('Programming')


