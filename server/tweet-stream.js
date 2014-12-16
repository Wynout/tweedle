/*jshint node:true*/
'use strict';

var config      = require('./../config.json'),
    TweetStream = require('node-tweet-stream');
    var twitter     = new TweetStream(config.twitter_api);
var moment = require('moment');

module.exports = function (io) {

    var minutes = [],
        lastRecordedMinute = -1;


    /**
    * Setup Twitter Stream
    */
    twitter.on('tweet', function (tweet) {

        incrementMinuteHistory();
        io.emit('tweet', tweet);
        console.log(tweet.text)
    });
    twitter.track('sydney');


    /**
     * Setup Socket Events
     */
    io.on('connection', function (socket) {

        console.log('Client connected:', socket.handshake.address, socket.handshake.time);
    });
    io.on('error', function (error) {

        console.log('Twitter error:', error);
    });

    function initialize() {

        var now              = moment(),
            minuteExact      = [now.year(), now.month(), now.date(), now.hour(), now.minute(), 0],
            currentTimestamp = moment(minuteExact).valueOf(); // timestamp of current minute, exact (seconds 0)

        for (var i = 0; i < 60; i++) {

            var timestamp = moment(currentTimestamp).subtract(59 - i, 'minutes').valueOf();
            minutes.push({
                timestamp: timestamp,
                value    : 0,
                minute   : i
            });
        }
    }
    initialize();


    function getCurrentMinute() {

        return parseInt(moment().format('m'), 10);
    }


    function incrementMinuteHistory() {

        var currentMinute = getCurrentMinute();
        console.log('currentMinute = ', currentMinute);

        // init last recorded minute
        if (lastRecordedMinute<0) {
            lastRecordedMinute = currentMinute;
            console.info('init last recorded minute: ', lastRecordedMinute);
        }

        // need to reset counter of current minute
        if (lastRecordedMinute!==currentMinute) {
            console.log('need to reset counter of current minute');

            var now = moment();
            var minuteTimestamp = moment([now.year(), now.month(), now.date(), now.hour(), now.minute(), 0]).valueOf(); // timestamp of current minute, exact (seconds 0)
            console.log(minuteTimestamp);

            minutes[currentMinute].timestamp = moment(minuteTimestamp).valueOf();
            minutes[currentMinute].value = 0;
        }

        // increment counter current minute
        minutes[currentMinute].value += 1;
        minutes[currentMinute].minute = currentMinute;
        lastRecordedMinute = currentMinute;
    }

    //http://plnkr.co/edit/47kbn8auHiVHuyMTb9yd?p=preview
    function getMinuteHistory() {

        var left = [], right = [], history = [];
        var currentMinute = getCurrentMinute();

        if (currentMinute===59) {

            history = minutes;
        } else {
            left    = minutes.slice(currentMinute + 1);
            right   = minutes.slice(0, currentMinute + 1);
            history = left.concat(right);
        }
        return history;
    }


    // Send minute history
    setInterval(function () {

        io.emit('tweet-count-minute-history', getMinuteHistory());

    }, 1000);

};