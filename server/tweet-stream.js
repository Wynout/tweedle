/*jshint node:true*/
'use strict';

var config      = require('./../config.json'),
    TweetStream = require('node-tweet-stream'),
    twitter     = new TweetStream(config.twitter_api);

module.exports = function (io) {

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
};