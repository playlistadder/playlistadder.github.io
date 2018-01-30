
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

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'Configs/config.json', true);
        xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

function setUpSpotifyWrapper(config) {
    var authToken = getCookie('authToken');
    if (authToken){
        spotify = new spotifyWebApi(config.clientId, config.url + 'callback/', authToken);
        showView('home');
        $('.nav-item').click(showClickedView);
    } else {
        spotify = new spotifyWebApi(config.clientId, config.url + 'callback/');
        showView('not-logged-in');
        $('#loginButton').click(function() { spotify.login([1,2,3,8]); });
    }
    $('.playlist-btn').click(runId);
}

$(document).ready(function () {
    loadJSON(function (response) {
        var config = JSON.parse(response);
        setUpSpotifyWrapper(config[0]);
    });
});