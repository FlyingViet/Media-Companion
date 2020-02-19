import spotipy
import spotipy.util as util
import json


def show_tracks(tracks):
    for i, item in enumerate(tracks['items']):
        track = item['track']
        artist = track['artists'][0]['name']
        song = track['name']
        print("%s - %s" % (artist, song))


def show_songs(tracks):
    songs = {}
    for i, item in enumerate(tracks['items']):
        song = item["name"]
        artist = item["artists"][0]["name"]
        ext_url = item["external_urls"]  # link to song
        id = item["id"]
        songs[song] = {"artist": artist, "url": ext_url, "id": id}
        print(f'{i}: ', song, "by", artist)


def display_playlist(token, link):
    linkArr = link.split('/')
    playlist_id = linkArr[-1].strip()

    if token:
        sp = spotipy.Spotify(auth=token)
        songs = sp.playlist(playlist_id, fields="tracks,next")
        song = songs['tracks']
        show_tracks(song)
        while song['next']:
            song = sp.next(song)
            show_tracks(song)
    else:
        print("Can't get token")


def searchTracks(token, track):
    if token:
        sp = spotipy.Spotify(auth=token)
        song = sp.search(q=track, type='track')
        tracks = song['tracks']
        show_songs(tracks)
    else:
        print("Can't get token")


if __name__ == '__main__':
    with open('./Secrets/secrets.json') as f:
        data = json.load(f)

    user = data['user']
    clientId = data['clientId']
    secret = data['secret']

    token = util.prompt_for_user_token(user,
                                       scope='playlist-modify-private,playlist-modify-public',
                                       client_id=clientId,
                                       client_secret=secret,
                                       redirect_uri='https://localhost:8080')
    
    running = True
    choice = input("Welcome to Media Companion, what would you like to do? "
                   "\n1) Search for a song"
                   "\n2) Load a playlist"
                   "\nq) Quit"
                   "\nChoice: ")

    while running:
        if choice == '1':
            track = input("Enter the song you want to find: ")
            searchTracks(token, track)
        elif choice == '2':
            link = input("Enter your playlist URL: ")
            display_playlist(token, link)
        elif choice == 'q':
            print('Thanks goodbye')
            running = False
            exit
        else:
            print('Invalid choice enter again: ')

        if choice != 'q':
            choice = input("\nWhat would you like to do? "
                           "\n1) Search for a song"
                           "\n2) Load a playlist"
                           "\nq) Quit"
                           "\nChoice: ")
