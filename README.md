#liri-node-app
Language Interpretation and Recognition Interface

##Demo
https://youtu.be/-uvX8KKySBI

##Features
liri-node-app is a node.js app tht interfaces with 3 apis, spotify, omdb and bandsintown. I used axios to make asychronous calls for the OMDB and bandsintown for spotify I use the spotify api itself. Since we are calling APIS we need API keys. To keep these secure we put them in a .env file and require "dotenv" to call the data up. The key here is to include the .env file in your gitignore file so the keys are not put into your public github repository. I also use fs to log the results from the call to a file and to read a file in to operate in "batch mode".

##Operation 
The program is meant to be run at the command line. You can do this by calling node liri.js *OPTIONS PARAMETER*
####Options
spotify-this-song: will call spofity API with the track option.
movie-this: will call OMDB API to get info back on the move you enter
concert-this: will call bandsintown to get concert info
do-what-it-says: will read random.txt and do the commands in the file
commands in the file should be made up of the above options
####PARAMETER
spotify-this-song: should be the song you want information on
movie-this: should be the movie you want information on
concert-this: should be the band/artist you want information on
*note all parameters with more than one word should be closed in quotes. I did not write a function to take the command line parameters and make them into the string. but you could using the slice and join functions on arrays.

##results 
####Spotify:
Artist, Song Name, Preview Link, Album and a seperator line
####OMDB
Title, Year, IMDB Rating, Rotten Tomatoes Rating, Country, Language, Plot, Actors and a seperator line
####BANDSINTOWN
name of the band, Venue, Location, Date and a seperator line
*Each seperator line is a diffent character to more easily spot changes in the ouput
