//set up my dotenv file to hide my keys
var dotenv = require("dotenv");
const result = dotenv.config();

//cath any errors
if (result.error) {
    console.log(result.error)
}

// set up my required files
// keys used for api keys
var keys = require("./keys.js");
//axios used for 2 api calls(movie and concert)
var axios = require("axios");
//moment used to format date  and time
var moment = require('moment');
//fs used for text file input and output
var fs = require("fs");

//get the third parm passed from the command line 
var choice = process.argv[2].toLowerCase();

//init variables
var searchTerm = "";
var count = -1;
var dataArr = [];
var line = "";
var goSub = "";

//make a dirrent line break for each section to its easier to see the sections in the output
const concertLineBreak = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
const movieLineBreak = "=======================================================================================";
const songLineBreak = "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^";

// line feed constant
const crlf = "\n";
var textLine = "";

//if there is a forth parameter grab it to use
if (process.argv.length > 3) {
    searchTerm = process.argv[3].toLowerCase();
}

//call the function pass in the command line arg for which part we are dealing with
command(choice);

function command(choice) {
    // goto the section we are using
    switch (choice) {
        //spotify
        case "spotify-this-song":
            // set up the spotify object to make the api call
            // no axios here
            var Spotify = require("node-spotify-api");
            var spotify = new Spotify(keys.spotify);

            // if no song is passed in use the sign
            if (searchTerm == "") {
                searchTerm = "The Sign";
            }
            //userQuery = searchTerm;
            spotify.search({ type: "track", query: searchTerm }, function (err, data) {
                //log any errors from spotify
                if (err) {
                    console.log(err);
                }

                // set results in the variable userSong to make it easier to use
                var userSong = data.tracks.items;
                //var artist = "";
                //loop through results and display to console log and a text file
                for (i = 0; i < userSong.length; i++) {
                    //set up a string variable called textLine
                    //for the first line we need to overwrite the variable
                    //other lines should concatenate
                    textLine = "Artist: " + userSong[i].artists[0].name + crlf;
                    textLine += "Song Name: " + userSong[i].name + crlf;
                    textLine += "Preview Link: " + userSong[i].preview_url + crlf;
                    textLine += "Album: " + userSong[i].album.name + crlf;
                    //add the linebreak specific to songs
                    textLine += songLineBreak + crlf;
                    // call routine to write
                    writeFile(textLine);
                }
                //in case we are in do-what-it-says-mode
                // call setSearch to call the routine again with the next line
                //after this line is complete
                count++;
                setSearch();
            });
            break;
        case "movie-this":
            //movie time!!!
            //if no movie name use Mr Nobody!! I hear its good.
            if (searchTerm == "") {
                searchTerm = "Mr Nobody";
            }

            //set up my omdb key to use in the api call
            var omdbVal = keys.omdb.id;
            var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=" + omdbVal;

            //use axios to call the API
            axios.get(queryUrl).then(
                function (response) {
                    //set up a string variable called textLine
                    //for the first line we need to overwrite the variable
                    //other lines should concatenate
                    textLine = "Title: " + response.data.Title + crlf;
                    textLine += "Year: " + response.data.Year + crlf;
                    textLine += "IMDB Rating: " + response.data.Ratings[0].Value + crlf;
                    //if it doesnt have a rotten tomatoes rating skip it do not error out
                    if (response.data.Ratings.length > 1) {
                        textLine += "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + crlf;
                    }
                    textLine += "Country: " + response.data.Country + crlf;
                    textLine += "Langage: " + response.data.Language + crlf;
                    textLine += "Plot: " + response.data.Plot + crlf;
                    textLine += "Actors: " + response.data.Actors + crlf;
                    textLine += movieLineBreak + crlf;
                    //send it to function to write to console.log and to text file
                    writeFile(textLine);

                    count++;
                    setSearch();
                });
            break;
        case "concert-this":
            var omdbVal = keys.band.id;
            var queryUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";

            axios.get(queryUrl).then(
                function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        //set up a string variable called textLine
                        //for the first line we need to overwrite the variable
                        //other lines should concatenate

                        textLine = searchTerm + " is playing at:" + crlf;
                        textLine += "Venue: " + response.data[i].venue.name + crlf;
                        textLine += "Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country + crlf;
                        textLine += "Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY h:mm a") + crlf;
                        textLine += concertLineBreak + crlf;
                        writeFile(textLine);
                    }
                    //doIt(count++);
                    //in case we are in do-what-it-says-mode
                    // call setSearch to call the routine again with the next line
                    //after this line is complete

                    count++;
                    setSearch();

                })
                //log any errors
                .catch(function (error) {
                    console.log(error);
                });
            break;
        case "do-what-it-says":
            console.log("here");
            fs.readFile("random.txt", "utf8", function (error, data) {
                //log any errors
                if (error) {
                    return console.log(error);
                }
                dataArr = data.split("\n");
                // call setSearch to call the routine with the first line
                //after this line is complete

                count++;
                setSearch();

            });

            break;
        default:
            // let use know we did not understand what they entered
            console.log("I do not know " + choice + " means. Please use 'concert-this', 'movie-this', 'spotify-this-song' or 'do-what-it-says'")
    }


    function setSearch() {
        //get next line of the do-what-it-says file (random.txt)
        if (count < dataArr.length && dataArr.length > 0) {
            line = dataArr[count];
            var goSub = line.substr(0, line.indexOf(","));
            searchTerm = line.substr(line.indexOf(",") + 1, line.length);
            searchTerm = searchTerm.replace(/"/g, '').trim();
            command(goSub);
        }
    }

}

//below is the same code in functions
// in an attempt to handle possible asychronos issues
// i tried to call it recursive so the other lines of random.txt fire in correct order

/*function readIt(count) {
    if (count == 0) {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            dataArr = data.split("\n");
            doIt(count)
        });
    }
}

function doIt(count) {
    //for (var i = 0; i < dataArr.length; i++) {
    console.log(count);
    console.log(dataArr.length);
    if (count < dataArr.length && dataArr.length > 0) {
        var line = dataArr[count];
        writeFile(line);
        choice = line.substr(0, line.indexOf(","));
        searchTerm = line.substr(line.indexOf(",") + 1, line.length);
        searchTerm = searchTerm.replace(/"/g, '');
        command(choice);
    }//);
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
                textLine += concertLineBreak + crlf;
                writeFile(textLine);
            }
            doIt(count++);
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
            if (response.data.Ratings.length > 1) {
                textLine += "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + crlf;
            }
            textLine += "Country: " + response.data.Country + crlf;
            textLine += "Langage: " + response.data.Language + crlf;
            textLine += "Plot: " + response.data.Plot + crlf;
            textLine += "Actors: " + response.data.Actors + crlf;
            textLine += movieLineBreak + crlf;
            writeFile(textLine);
            doIt(count++);
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
            textLine += songLineBreak + crlf;
            writeFile(textLine);
        }
        doIt(count++);
    });
}
*/
function writeFile(newTexeLine) {
    console.log(newTexeLine);
    fs.appendFile("log.txt", (newTexeLine), function (error) {
        if (error) {
            console.log(error);
        }
    });
}