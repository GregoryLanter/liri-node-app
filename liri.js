var dotenv = require("dotenv");
const result = dotenv.config();

if (result.error) {
    console.log(result.error)
}

var choice = process.argv[2].toLowerCase();
var searchTerm = process.argv[3].toLowerCase();

switch (choice) {
    case "spotify-this-song":
        spotify();
        break;
    case "movie-this":
        omdb();
        break;
}
function omdb() {
var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=331ebb59";

// This line is just to help us debug against the actual URL.
console.log(queryUrl);

axios.get(queryUrl).then(
  function(response) {
    console.log("Release Year: " + response.data.Year);
  }
);

}

function spotify() {
    var keys = require("./keys.js");
    var axios = require("axios");
    var Spotify = require("node-spotify-api");
    var spotify = new Spotify(keys.spotify);

    userQuery = searchTerm;
    spotify.search({ type: "track", query: userQuery }, function (err, data) {
        if (err) {
            console.log(err);
        }

        var userSong = data.tracks.items;
        var artist = "";
        for (i = 0; i < userSong.length; i++) {
            console.log("Artist: " + userSong[i].artists[0].name);
            console.log("Song Name: " + userSong[i].name);
            console.log("Preview Link: " + userSong[i].preview_url);
            console.log("Album: " + userSong[i].album.name);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        }
    });
}