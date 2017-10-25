class spotifyWebApi {
    constructor (token){
        if (token == null) {
            this.login();
        } else {
            this.accessToken = token;
        }
    }

    login() {
        var CLIENT_ID = '441a4822a4e64231b66d281c7d20810b';
        var REDIRECT_URI = 'https://playlistadder.github.io/';
        function getLoginURL(scopes) {
            console.log('https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
            '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
            '&scope=' + encodeURIComponent(scopes.join(' ')) +
            '&response_type=token');
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
              '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
        }
        
        var url = getLoginURL([
            'playlist-modify-public',
            'playlist-modify-private',
            'playlist-read-collaborative'
        ]);

        window.location.href = url;
    }

    followPlaylist (ownerId, playlistId, callback, makePlaylistPublic = true){
        var url = 'https://api.spotify.com/v1/users/' + ownerId + '/playlists/' + playlistId + '/followers';
        var request = $.ajax({
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "Content-Type": "application/json"
            },
            url: url,
            data: {
                public: makePlaylistPublic
            },
            success: function (response) {
                console.log("SUCCESS: " + response);
            }
        });
        console.log(request);
    }
}