export async function getSpotifyPlaylist( searchInput ){
    var jsonData = [];
    await fetch('/api/Spotify/playlist/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "search_text": searchInput
        })
    }).then((res) => {
        return res.json();
    }).then((json) => {
        var res = [];
        for(var i in json)
            res.push(json[i]);
        jsonData = res;
    });
    return jsonData;
};

export async function getSpotifySong(searchInput) {
    var jsonData = [];
    await fetch('/api/Spotify/search/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "search_text": searchInput
        })
    }).then((res) => {
        return res.json();
    }).then((json) => {
        var res = [];
        for(var i in json)
            res.push(json[i]);
        jsonData = res;
    });
    console.log(jsonData);
    return jsonData;
};

export async function getSongsDb() {
    var jsonData = [];
    await fetch('/api/Songs/', {
        method: 'GET',
    }).then((res) => {
        return res.json();
    }).then((json) => {
        var res = [];
        for(var i in json)
            res.push(json[i]);
        jsonData = res;
    });
    return jsonData;
}

export async function insertSong(song, artist, id, url, uri){
    var jsonData = [];
    await fetch('/api/Songs/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "name": song,
            "artist": artist,
            "spotifyId": id,
            "spotifyUrl": url,
            "spotifyUri": uri
        })
    }).then((res) => {
        return res.json();
    }).then((json) => {
        console.log(json);
    });
    return jsonData;
}

