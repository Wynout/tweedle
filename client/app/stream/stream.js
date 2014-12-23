(function () {
    'use strict';

    angular
        .module('app.stream')
        .controller('Stream', Stream);

    Stream.$inject = ['$scope', 'socket', 'logger'];

    /* @ngInject */
    function Stream($scope, socket, logger) {
        /* jshint validthis:true */

        var vm = this;
        vm.data     = [];
        vm.tweets   = [];
        vm.count    = 0;
        vm.title    = 'Live Tweet Stream List';
        vm.settings = {
            profilePicturesEnabled: false
        };

        activate();
        ///////////

        function activate() {

            socket.on('tweet', function (tweet) {

                //console.log(tweet);
                vm.tweets.unshift(tweet);
                vm.tweets = vm.tweets.splice(0,50);
                vm.count++;
            });

            socket.on('tweet-count-minute-history', function (data) {

                vm.data = data;
            });
            logger.info('Activated Twitter Stream View');
        }

        vm.hovered = function (d) {

            console.log(d);
            //vm.barValue = d;
            //$scope.$apply();
        };

    }

})();
