from gmusicapi import Mobileclient

api = Mobileclient()
# after running api.perform_oauth() once:
api.oauth_login(api.FROM_MAC_ADDRESS)
# => True
s = api.search(query="Old Town Road", max_results=10)
print(s['video_hits'][0])
