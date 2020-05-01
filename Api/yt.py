from __future__ import print_function
import pickle
import os.path
from flask import Flask, redirect
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/youtube']

def auth(userId):
    """Shows basic usage of the People API.
    Prints the name of the first 10 connections.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists(f'./userauth/{userId}.pickle'):
        with open(f'./userauth/{userId}.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'secret/client_secret.json', SCOPES)
            # flow.redirect_uri= 'http://localhost:3000'
            # authorization_url, state = flow.authorization_url()
            creds = flow.run_local_server()
        # Save the credentials for the next run
        with open(f'./userauth/{userId}.pickle', 'wb') as token:
            pickle.dump(creds, token)

    youtube = build('youtube', 'v3', credentials=creds)

    return youtube

def search_song_title(name: str, youtube):
        s = youtube.search().list(q=name, part='snippet', type='video', maxResults=1)
        s_exe = s.execute()
        s_entry = s_exe['items'][0]
        print(s_entry)

def search_artist_name(artist: str, youtube):
        a = youtube.search().list(q=artist, part='snippet', type='channel', maxResults=1)
        a_exe = a.execute()
        a_entry = a_exe['items'][0]
        print(a_entry)    

def all_user_playlist(youtube):
        p = youtube.playlists().list(part="snippet", mine=True)
        p_exe = p.execute()
        p_all = p_exe['items']
        print(p_all)    

def search_user_playlist_name(pl: str, youtube):
    p = youtube.playlist().list(part="snippet", mine=True)
    p_exe = p.execute()
    p_all = p_exe['items']
    print(type(p_all))

def create_user_playlist(pl: str, youtube):
    create_play = youtube.playlists().insert(
        part='snippet',
        body=
        {
            "snippet": {
                "title": pl
            }
        }
    )
    create_play_exe = create_play.execute()
    print(create_play_exe['id'])
    return create_play_exe['id']

def get_video_id(v_name: str, youtube):
    s_video = youtube.search().list(
        part="id",
        maxResults=1,
        q=v_name
    )
    s_exe = s_video.execute()
    vid = s_exe['items'][0]['id']['videoId']
    return vid

def insert_video_user_playlist(pl_id: str, v_name: str, youtube):
    vid = get_video_id(v_name=v_name, youtube=youtube)

    up = youtube.playlistItems().insert(
        part='snippet',
        body={
            "snippet": {
                "playlistId": pl_id,
                "resourceId": {
                    "videoId": vid,
                    "kind": 'youtube#video'
                }
            }
        }
    )
    up_exe = up.execute()
    return up_exe['snippet']['title']

def delete_video_user_playlist(pl_id: str, v_name: str, youtube):
    vid = get_video_id(v_name=v_name, youtube=youtube)

    vid_delete = youtube.playlistItems().list(
        part="id",
        playlistId=pl_id,
        videoId=vid
    )
    vid_exe = vid_delete.execute()
    vid_id = vid_exe['items'][0]['id']

    delete_video = youtube.playlistItems().delete(id=vid_id)
    delete_exe = delete_video.execute()
    print(delete_exe)

    """
    # Create Playlist
    create_user_playlist("Test Playlist")
    """

    """
    # Add or delete to Playlist
    url = input("Enter Playlist URL: ")
    playlistid = url[38:]

    #insert_video_user_playlist(pl_id=playlistid, v_name="Old Town Road")
    #delete_video_user_playlist(pl_id=playlistid, v_name="Old Town Road")
    """

    # search_song_title('Old Time Road')
    """
    search_artist_name('Drake')
    all_user_playlist()
    search_user_playlist_name('Programming')
    """    


# if __name__ == '__main__':
#     auth()
