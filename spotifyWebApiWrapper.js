class spotifyWebApi {
    constructor (token){
        var self = this;
        if (token == null) {
            //handle login
        } else {
            this.accessToken = token;
            this.getLogedInUserInfo().done(function (data) {self.userInfo = data});
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
            'playlist-read-collaborative',
            'user-library-read'
        ]);

        window.location.href = url;
    }

    getLogedInUserInfo() {
        var url = 'https://api.spotify.com/v1/me';
        var request = $.ajax({
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.accessToken
            },
            url: url
        });
        return request;
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
            }
        });
        return request;
    }

    createPlaylist (playlistName, playlistDescription = "", isPlaylistPublic = true, isPlaylistCollaborative = false, userId = null){
        if (userId === null && this.userInfo == null){
            return Promise.reject(new Error('No userId, are you logged in?'));
        } else if (userId === null) {
            userId = this.userInfo.id;
        }
        var url = 'https://api.spotify.com/v1/users/' + userId + '/playlists';
        var jsonData = JSON.stringify({
            name: playlistName,
            public: isPlaylistPublic,
            collaborative: isPlaylistCollaborative,
            description: playlistDescription
        });
        var request = $.ajax({
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "Content-Type": "application/json"
            },
            url: url,
            dataType: "json",
            data: jsonData
        });
        return request;
    }

    addTracksToPlaylist(playlistId, spotifyTrackUris, addAtPosition = 0, userId = null){
        if (userId === null && this.userInfo == null){
            return Promise.reject(new Error('No userId, are you logged in?'));
        } else if (userId === null) {
            userId = this.userInfo.id;
        }
        var url = 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks'
            + '?uris=' + spotifyTrackUris;
        var request = $.ajax({
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "Content-Type": "application/json"
            },
            url: url,
        })
        return request;
    }

    getLikedMusic (numberOfSongs = 20, offsetFromMostRecent = 0, countryCode = null) {
        var url = 'https://api.spotify.com/v1/me/tracks?limit=' + numberOfSongs 
            + '&offset=' + offsetFromMostRecent 
            + (countryCode ? '&market=' + countryCode : '');
        var request = $.ajax({
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.accessToken
            },
            url: url,
        })
        return request;
    }
}