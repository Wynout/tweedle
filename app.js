var config      = require('./config.json'),
    app         = require('express')(),
    server      = require('http').createServer(app),
    io          = require('socket.io')(server),
    express     = require('express'),
    TweetStream = require('node-tweet-stream'),
    twitter     = new TweetStream(config.twitter_api);

/**
 * Setup Express
 */
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {

    res.redirect('/index.html')
});


/**
 * Setup Twitter Stream
 */
twitter.on('tweet', function (tweet) {

    io.emit('tweet', tweet);
    console.log(tweet.text)
});
twitter.track('hong kong');


/**
 * Setup Socket Events
 */
io.on('connection', function (socket) {

    console.log('Client connected:', socket.handshake.address, socket.handshake.time);
});
io.on('error', function (error) {

    console.log('Twitter error:', error);
});


/**
 * Start listening op port 3000
 */
server.listen(3000);
