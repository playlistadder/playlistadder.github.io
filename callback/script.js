function parseURLHash () {
    var search = location.hash.substring(1);
    var urlHash = search?JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
                     function(key, value) { return key===""?value:decodeURIComponent(value) }):{}
    return urlHash;
}

$(document).ready(function(){
    urlHash = parseURLHash();
    var authExpiresIn = 1000*urlHash.expires_in;
    var authToken = urlHash.access_token;
    var cookieExpiryDate = new Date((new Date()).valueOf() + authExpiresIn);
    document.cookie = "authToken=" + authToken + ";path=/;expires=" + cookieExpiryDate.toUTCString();
    window.location.replace('https://playlistadder.github.io/');
})