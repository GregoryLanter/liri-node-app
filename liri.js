var dotenv = require("dotenv");
const result = dotenv.config();

if (result.error) {
    console.log(result.error)
}
var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");

var choice = process.argv[2].toLowerCase();

var searchTerm = "";
if (process.argv.length > 3) {
    searchTerm = process.argv[3].toLowerCase();
}
const lineBreak = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
const crlf = "\n";
var textLine = "";

command(choice);

function command(choice) {
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
        case "do-what-it-says":
            doIt();
            break;
        default:
            console.log("I do not know " + choice + " means. Please use 'concert-this', 'movie-this', 'spotify-this-song' or 'do-what-it-says'")
    }
}
function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split("\n");
        for (var i = 0; i < dataArr.length; i++) {
            var line = dataArr[i];
            choice = line.substr(0, line.indexOf(","));
            searchTerm = line.substr(line.indexOf(",") + 1, line.length);
            searchTerm = searchTerm.replace(/"/g, '');
            command(choice);
        }

    });
}

function concert() {
    var omdbVal = keys.band.id;
    var queryUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                textLine = searchTerm + " is playing at:" + crlf;
                textLine += "Venue: " + response.data[i].venue.name + crlf;
                textLine += "Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country + crlf;
                textLine += "Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY h:mm a") + crlf;
                textLine += lineBreak + crlf;
                writeFile(textLine);
                /*console.log(searchTerm + " is playing at:")
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country);
                console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY h:mm a"));
                console.log(lineBreak);*/
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
            textLine = "Title: " + response.data.Title + crlf;
            textLine += "Year: " + response.data.Year + crlf;
            textLine += "IMDB Rating: " + response.data.Ratings[0].Value + crlf;
            textLine += "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + crlf;
            textLine += "Country: " + response.data.Country + crlf;
            textLine += "Langage: " + response.data.Language + crlf;
            textLine += "Plot: " + response.data.Plot + crlf;
            textLine += "Actors: " + response.data.Actors + crlf;
            textLine += lineBreak + crlf;
            writeFile(textLine);
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
            textLine += "Artist: " + userSong[i].artists[0].name + crlf;
            textLine += "Song Name: " + userSong[i].name + crlf;
            textLine += "Preview Link: " + userSong[i].preview_url + crlf;
            textLine += "Album: " + userSong[i].album.name + crlf;
            textLine += lineBreak + crlf;
            writeFile(textLine);
        }
    });
}

function writeFile(newTexeLine) {
    console.log(newTexeLine);
    fs.appendFile("log.txt", (newTexeLine), function (error) {
        if (error) {
            console.log(error);
        }
    });
}