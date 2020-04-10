from googleapiclient.discovery import build

api_key = "AIzaSyBTjlMVBAobeP2juvjL6PwVK9H6rRAPXaU"
youtube = build('youtube', 'v3', developerKey=api_key)

"""
Search for Music
"""
req = youtube.search().list(q='avengers', part='snippet', type='video', maxResults=10)
res = req.execute()

for item in res['items']:
    print(item['snippet']['title'])

print()
print()
"""
Search for Channel (Artist)
"""
req = youtube.search().list(q='apple', part='snippet', type='channel', maxResults=10)
res = req.execute()

for item in res['items']:
    print(item['snippet']['title'])




