$(document).ready(function () {
    var spotify = new spotifyWebApi();
    $('#loginButton').click(spotify.login);
});