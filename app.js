var config  = require('./config.json'),
    app     = require('express')(),
    server  = require('http').createServer(app),
    io      = require('socket.io')(server),
    express = require('express'),
    Twitter = require('node-tweet-stream')



//////////////////////////////////////////////////////////////
var t       = new Twitter(config.twitter_api);
io.on('connection', function (socket) {

    console.log('on connection event');
});

t.track('hong kong');

setTimeout(function () {

    //t.untrack('hong kong');
}, 30000);

t.on('tweet', function (tweet) {

    io.emit('message', tweet);
    console.log(tweet.text)
});
//////////////////////////////////////////////////////////////

// Serves static content
app.use(express.static(__dirname + '/public'));

// Redirects to index.html
app.get('/', function (req, res) {

    res.redirect('/index.html')
});
//}, 1000);





// Start listening op port 3000
server.listen(3000);
