require("dotenv").config()
var Twitter = require("twitter")
var Spotify = require("node-spotify-api")
var keys = require("./keys")
var request = require("request")
var fs = require("fs")

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// * `my-tweets`

// * `spotify-this-song`

// * `movie-this`

// * `do-what-it-says`

var argument1 = process.argv[2]
var argument2 = process.argv.slice(3).join("+")

var songQuery;
var movieQuery;

//if argument2 is falsey, then execute the code below 
//and assign the value to our queries
if (!argument2) {
    songQuery = "The+Sign";
    movieQuery = "Mr+Nobody";
}
else {
    songQuery = argument2;
    movieQuery = argument2;
}
console.log(songQuery)
console.log(movieQuery)

switch (argument1) {

    case `my-tweets`:
        myTweets()
        break;

    case `spotify-this-song`:
        spotifyThis(songQuery)
        break;
    case `movie-this`:
        movieThis(movieQuery)
        break;

    case 'do-what-it-says':
        doWhatItSays()
        break;
}


function myTweets() {

    var params = { screen_name: 'AnnaBootcamp' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (let i = 0; i < tweets.length; i++) {
                console.log(`Tweet: ${tweets[i].text}`)
                console.log(`Date: ${tweets[i].created_at}`)
                console.log("------------------------------")

            }
        }
    });

}

function spotifyThis(song) {

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(JSON.stringify(data, null, 2))
        // console.log(data);
    });
}

function movieThis(movie) {
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        var queryResult = JSON.parse(body);
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("The movie's title is: " + queryResult.Title);
            console.log("The movie's release year is: " + queryResult.Year);
            console.log("The movie's IMDB rating is: " + queryResult.imdbRating);
            console.log("The movie's Rotten Tomatoes rating  is: " + queryResult.Ratings[1].Value)
            console.log("The movie's country of production is: " + queryResult.Country)
            console.log("The movie's language: " + queryResult.Language)
            console.log("The movie's plot: " + queryResult.Plot)
            console.log("The movie's actors: " + queryResult.Actors)

        }
    });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        var dataArray = data.split(",")
        
        var action = dataArray[0]
        var title = dataArray[1].split(" ").join("+")
        
        if(action === 'my-tweets'){
            myTweets();
        }
        else if(action === 'spotify-this-song'){
            spotifyThis(title)
        }     
        else if(action === 'movie-this'){
            movieThis(title)
        }
        
    });
}
