
var spotify = null;

function getCurrentViewFromHash (){
    return location.hash.substring(1);
}

function getCookie(name) {
    var cookiestring = RegExp(""+name+"[^;]+").exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

function showView(view) {
    $('main .view').hide();
    $('#' + view + '.view').show();
}

function showCurrentView() {
    showView(getCurrentViewFromHash());
}

function runId() {
    eval(this.id+'();');
}

function showClickedView() {
    showView(this.id);
    if ($('#hamburgerButton').is(':visible')){
        $('.navbar-toggler-icon').click();
    }
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
    var authToken = getCookie('authToken');
    if (authToken){
        spotify = new spotifyWebApi('441a4822a4e64231b66d281c7d20810b', 'https://playlistadder.github.io/callback/', authToken);
        showView('home');
        $('.nav-item').click(showClickedView);
    } else {
        spotify = new spotifyWebApi('441a4822a4e64231b66d281c7d20810b', 'https://playlistadder.github.io/callback/');
        showView('not-logged-in');
        $('#loginButton').click(function() { spotify.login([1,2,3,8]); });
    }
    $('.playlist-btn').click(runId);
});