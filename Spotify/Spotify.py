import spotipy
import spotipy.util as util


def show_tracks(tracks):
    for i, item in enumerate(tracks['items']):
        track = item['track']
        artist = track['artists'][0]['name']
        song = track['name']
        print("%s - %s" % (artist, song))


def display_playlist(token, link):
    # link = input('Enter the playlist url: ')
    # link = 'https://open.spotify.com/playlist/6SXzRD2I9kBN4iFQt4Rn4B'
    linkArr = link.split('/')
    playlist_id = linkArr[-1].strip()
    endpoint = f'https://api.spotify.com/v1/playlists/{playlist_id}'
    authCode = "BQC86IUaQt8bUYyedd1GDOexhnZ0PoDHxLgm0nH1JIbD5SYvCvsa8S8xIK40808smpaIKrj7b4lb4ohlrRk9BQ8XlRkJ"

    if token:
        sp = spotipy.Spotify(auth=token)
        list = sp.playlist(playlist_id, fields="tracks,next")
        song = list['tracks']
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
        print(song)
    else:
        print("Can't get token")


if __name__ == '__main__':
    user = '1214261898'
    clientId = '6fc4feaa2fce44ebacf339ab0ea62757'
    secret = '9851d5c181684612acf523bafde3c66e'

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
        else:
            print('Thanks goodbye')
            running = False

        choice = input("\nWhat would you like to do? "
                       "\n1) Search for a song"
                       "\n2) Load a playlist"
                       "\nq) Quit"
                       "\nChoice: ")
