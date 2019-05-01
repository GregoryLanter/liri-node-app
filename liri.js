var dotenv = require("dotenv");
const result = dotenv.config();

if (result.error) {
    console.log(result.error)
}
var keys = require("./keys.js");
var axios = require("axios");

var choice = process.argv[2].toLowerCase();

var searchTerm = "";
if (process.argv.length > 3) {
    searchTerm = process.argv[3].toLowerCase();
}
var lineBreak = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
switch (choice) {
    case "spotify-this-song":
        song();
        break;
    case "movie-this":
        omdb();
        break;
    case "concert-this":
        concert();
        break;
}
function concert() {
    var omdbVal = keys.band.id;
    var queryUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log(searchTerm + " is playing at:")
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country);
                console.log("Date: " + response.data[i].datetime);
                console.log(lineBreak);
            }
        }
    );

}
function omdb() {
    if (searchTerm == "") {
        searchTerm = "Mr Nobody";
    }
    var omdbVal = keys.omdb.id;
    var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=" + omdbVal;

    axios.get(queryUrl).then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("OMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Langage: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log(lineBreak);
        }
    );

}

function song() {
    var Spotify = require("node-spotify-api");
    var spotify = new Spotify(keys.spotify);
    if (searchTerm == "") {
        searchTerm = "The Sign";
    }
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