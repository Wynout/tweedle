/*
 @link http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
 Although Socket.IO exposes an io variable on the window, it's better to encapsulate it in AngularJS's Dependency Injection system. So, we'll start by writing a service to wrap the socket object returned by Socket.IO. This is awesome, because it will make it much easier to test our controller later.
*/
(function () {
    'use strict';

    var serviceId = 'socket';

    angular.module('tweetStreamApp')
        .factory(serviceId, ['$rootScope', socket]);

    function socket($rootScope) {

        var socket = io.connect('http://localhost:3000');
        var service = {
            on: on,
            emit: emit,
            tweets: [{msg: 'a'}, {msg: 'b'}, {msg: 'c'}, {msg: 'd'}]
        };

        return service;
        ///////////////

        function on(eventName, callback) {

            socket.on(eventName, function () {

                var args = arguments;
                $rootScope.$apply(function () {

                    callback.apply(socket, args);
                });
            });
        }

        function emit(eventName, data, callback) {

            socket.emit(eventName, data, function () {

                var args = arguments;
                $rootScope.$apply(function () {

                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    }
})();