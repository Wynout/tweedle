/**
 * Although Socket.IO exposes an io variable on the window,
 * it's better to encapsulate it in AngularJS's Dependency Injection system.
 * So, we'll start by writing a service to wrap the socket object returned by Socket.IO.
 * This is awesome, because it will make it much easier to test our controller later.
 * @link http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('socket', socket);

    socket.$inject = ['socketFactory'];

    /* @ngInject */
    function socket(socketFactory) {

        //var socket = io.connect(config.tweetStreamUrl);
        var socket = io.connect('http://localhost:3000');

        var service = socketFactory({
            ioSocket: socket
        });

        activate();

        return service;
        ///////////////

        function activate() {

            /*
            socket.on('connecting', function () {

                $mdToast.show({
                    template : '<md-toast>Connecting</md-toast>',
                    hideDelay: config.toast.hideDelay,
                    position : config.toast.position
                });
            });

            socket.on('connect', function () {

                $mdToast.show({
                    template : '<md-toast>Connected</md-toast>',
                    hideDelay: config.toast.hideDelay,
                    position : config.toast.position
                });
            });

            socket.on('disconnect', function () {

                $mdToast.show({
                    template : '<md-toast>Disconnected</md-toast>',
                    hideDelay: config.toast.hideDelay,
                    position : config.toast.position
                });
            });

            socket.on('reconnecting', function () {

                $mdToast.show({
                    template : '<md-toast>Attempting to reconnect</md-toast>',
                    hideDelay: config.toast.hideDelay,
                    position : config.toast.position
                });
            });

            socket.on('reconnect', function () {

                $mdToast.show({
                    template : '<md-toast>Reconnected</md-toast>',
                    hideDelay: config.toast.hideDelay,
                    position : config.toast.position
                });
            });

            socket.on('reconnect_failed', function () {

                $mdToast.show({
                    template : '<md-toast>Failed to reconnect</md-toast>',
                    hideDelay: config.toast.hideDelay,
                    position : config.toast.position
                });
            });*/
        }
    }

})();
