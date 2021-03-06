class spotifyWebApi {
    constructor (clientId, redirectUri, token = null){
        var self = this;
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        if (token != null) {
            this.accessToken = token;
            this.getLogedInUserInfo().done(function (data) {self.userInfo = data});
        }
    }

    login(listOfPermissions = []) {
        var self = this;
        var permissions = ['playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private', 'streaming', 'ugc-image-upload', 'user-follow-modify', 'user-follow-read', 'user-library-read', 'user-library-modify', 'user-read-private', 'user-read-birthdate', 'user-read-email', 'user-top-read', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'user-read-recently-played'];
        var requestedPermissions = [];
        listOfPermissions.forEach(function(permission){
            if (permission >= permissions.length || permission < 0){
                console.log("login: permission index out of range, permissions must be in within: [0, " + permissions.length + "].")
            } else {
                requestedPermissions.push(permissions[permission]);
            }
        });

        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + self.clientId +
              '&redirect_uri=' + encodeURIComponent(self.redirectUri) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
        }
        
        var url = getLoginURL(listOfPermissions.length === 0 ? permissions : requestedPermissions);

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
        if (userId === null && this.userInfo === null){
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
        if (userId === null && this.userInfo === null){
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

    search(query, listOfTypes, numberOfSongs = 20, searchResultsOffset = 0, countryCode = null){
        var types = ['album','artist','playlist','track'];
        var selectedtypes = [];
        listOfTypes.forEach(function(typeIndex){
            if (typeIndex >= types.length || typeIndex < 0){
                console.log("search: type index out of range, types must be in within: [0, " + types.length + "].")
            } else {
                selectedtypes.push(types[typeIndex]);
            }
        });
        var url = 'https://api.spotify.com/v1/search?q=' + this.buildQuerry(query)
            + '&type=' + selectedtypes.join('%2C')
            + '&limit=' + numberOfSongs
            + '&offset=' + searchResultsOffset
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

    //for now this simply encodes the query
    buildQuerry (query){
        var ecodedQuery = encodeURIComponent(query);
        return ecodedQuery;
    }

    getPlaybackInfo() {
        var url = 'https://api.spotify.com/v1/me/player';
        var request = $.ajax({
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.accessToken
            },
            url: url,
        })
        return request;
    }

    pausePlayback() {
        var url = '	https://api.spotify.com/v1/me/player/pause';
        var request = $.ajax({
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.accessToken
            },
            url: url,
        })
        return request;
    }

    playPlayback() {
        var url = '	https://api.spotify.com/v1/me/player/play';
        var request = $.ajax({
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.accessToken
            },
            url: url,
        })
        return request;
    }

    nextPlayback () {
        var url = '	https://api.spotify.com/v1/me/player/next';
        var request = $.ajax({
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.accessToken
            },
            url: url,
        })
        return request;
    }

    previousPlayback () {
        var url = '	https://api.spotify.com/v1/me/player/previous';
        var request = $.ajax({
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.accessToken
            },
            url: url,
        })
        return request;
    }
}