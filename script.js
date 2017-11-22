
var spotify = null;
var urlHash = {};

function parseURLHash () {
    var search = location.hash.substring(1);
    urlHash = search?JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
                     function(key, value) { return key===""?value:decodeURIComponent(value) }):{}
}

function showCurrentView () {
    urlHash['access_token'] ? $('#home').show() : $('#not-logged-in').show();
}

function createRecentlyLikedPlaylist (){
    if (spotify !== null) {
        var requestLikedMusic = spotify.getLikedMusic();
        requestLikedMusic.done(function (data) {
            var spotifyTrackUris = '';
            data.items.forEach(function(item) {
                if (spotifyTrackUris !== ''){
                    spotifyTrackUris += ',';
                }
                spotifyTrackUris += item.track.uri;
            }, this);
            createNewPlaylistAndAddMusic('Most recently liked songs as of ' + new Date(), spotifyTrackUris);
        });
    } else {
        console.log('Please login to spotify to use this feature');
    }
}

function createNewPlaylistAndAddMusic (playlistName, spotifyTrackUris){
    var createNewPlaylist = spotify.createPlaylist(playlistName);
    createNewPlaylist.done(function (data) {
        spotify.addTracksToPlaylist(data.id, spotifyTrackUris);
    })
}

$(document).ready(function () {
    spotify = new spotifyWebApi();
    parseURLHash();
    showCurrentView();
    $('#loginButton').click(spotify.login);
});