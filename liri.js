// Liri should take the arguments 
// * my-tweets
// * spotify-this-song
// * movie-this
// * do-what-it-says

//add programs
var dataKeys = require("./keys.js");
var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var argument = process.argv[2];

//function for getting tweets
function getTweets() {
    var client = new Twitter(dataKeys.twitterKeys);

    var params = { screen_name: 'JohnDoe67412610', count: 20 };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {

        if (!error) {
            var data = [];
            for (var i = 0; i < tweets.length; i++) {
                data.push({
                    'created at': tweets[i].created_at,
                    'Tweets': tweets[i].text,
                });
            }
            console.log(JSON.stringify(data, null, 2));
        }
    });
};

if (argument === "my-tweets") {
    getTweets();
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

//function for getting song names

function spotifySong(songName) {

    var spotify = new Spotify({
        id: 'c302112825c54086b64cd358c3c1c5d6',
        secret: '9939b85aa3954e8b8d2d48a8ca6cded1'
    });

    var userSong = process.argv;
    var songName = '';
    var params = songName;

    for (var i = 3; i < userSong.length; i++) {

        if (i > 3 && i < userSong.length) {
            songName = songName + "+" + userSong[i];
        }

        else {
            songName += userSong[i];
        }
    }

    if (songName === '') {
        songName = "The+Sign";
    }

    params = songName;

    spotify.search({ type: 'track', query: params }, function(err, data) {
        if (!err) {
            var songInfo = data.tracks.items;

            for (var i = 0; i < 1; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                        "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                        "Song: " + songInfo[i].name + "\r\n" +
                        "Preview Url: " + songInfo[i].preview_url + "\r\n" +
                        "Album the song is from: " + songInfo[i].album.name + "\r\n";

                    console.log(spotifyResults);
                }
            }
        }
    });
}

if (argument === "spotify-this-song") {
    spotifySong();
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

function getMeMovie() {

    var nodeArgs = process.argv;
    var movieName = "";


    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];
        }
        else {
            movieName += nodeArgs[i];
        }
    }

    if (movieName === undefined) {
        movieName = 'Mr Nobody';
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            var jsonData = JSON.parse(body);

            if (jsonData.Ratings[1]) {
                var tomScore = 'Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value;
            }

            var data =
                'Title: ' + jsonData.Title + "\r\n" +
                'Year: ' + jsonData.Year + "\r\n" +
                'Rated: ' + jsonData.Rated + "\r\n" +
                'IMDB Rating: ' + jsonData.imdbRating + "\r\n" +
                'Country: ' + jsonData.Country + "\r\n" +
                'Language: ' + jsonData.Language + "\r\n" +
                'Plot: ' + jsonData.Plot + "\r\n" +
                'Actors: ' + jsonData.Actors + "\r\n" +
                'Rotten Tomatoes Rating: ' + tomScore;

            console.log(data);
        }
    });
}
if (argument === "movie-this") {
    getMeMovie();
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

//do what it says function

function doWhatItSays() {
    console.log("Looking at random.txt. . . .");
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        }
        else {

            //split data, declare variables
            var dataArr = data.split(',');
            var userCommand = dataArr[0];
            var secondCommand = dataArr[1];
            //if multi-word search
            for (i = 2; i < dataArr.length; i++) {
                secondCommand = secondCommand + "+" + dataArr[i];
            }
            if (dataArr.length === 2) {
                pick(userCommand, secondCommand);
            }
            else if (dataArr.length == 1) {
                pick(userCommand);
            }
        }
    });
}

var pick = function(caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            getTweets();
            break;
        case 'spotify-this-song':
            spotifySong(functionData);
            break;
        case 'movie-this':
            getMeMovie(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
    }
};

if (argument === "do-what-it-says") {
    doWhatItSays();
}
