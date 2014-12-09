/*jshint node:true*/
'use strict';

var config      = require('./../config.json'),
    TweetStream = require('node-tweet-stream');
    //var twitter     = new TweetStream(config.twitter_api);
var moment = require('moment');

module.exports = function (io) {

    ///**
    // * Setup Twitter Stream
    // */
    //twitter.on('tweet', function (tweet) {
    //
    //    io.emit('tweet', tweet);
    //    console.log(tweet.text)
    //});
    //twitter.track('hong kong');


    /**
     * Setup Socket Events
     */
    io.on('connection', function (socket) {

        console.log('Client connected:', socket.handshake.address, socket.handshake.time);
    });
    io.on('error', function (error) {

        console.log('Twitter error:', error);
    });


    // Send test data for client D3 graph
    var data = [
        {timestamp: 1417879285622, value: 1},
        {timestamp: 1417879286622, value: 2},
        {timestamp: 1417879287621, value: 3},
        {timestamp: 1417879288623, value: 4},
        {timestamp: 1417879289625, value: 5}
    ];
    setInterval(function () {

        data = data.slice(1);
        data.push({timestamp: moment().utc().valueOf(), value: Math.round(Math.random()*100)});
        io.emit('tweet-count-history', data);
        //console.log(data);
    }, 2000);

};