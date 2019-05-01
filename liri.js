var dotenv = require("dotenv");
const result = dotenv.config();
 
if (result.error) {
  console.log(result.error)
}
 
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

userQuery = "walk this way";
spotify.search({type: "track", query: userQuery}, function(err, data) {
    if (err) {
        console.log(err);
    }

    var userSong = data.tracks.items;
    var artist = "";
    for(i=0; i<userSong.length;i++){
        console.log("Artist: " + userSong[i].artists[0].name);
        console.log("Song Name: " + userSong[i].name);
        console.log("Preview Link: " + userSong[i].preview_url);
        console.log("Album: " + userSong[i].album.name);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    }
});