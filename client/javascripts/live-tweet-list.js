(function () {
    'use strict';

    var controllerId = 'LiveTweetList';

    angular.module('tweetStreamApp')
        .controller(controllerId, LiveTweetList);

    LiveTweetList.$inject = ['socket'];

    function LiveTweetList(socket) {

        /*jshint validthis: true*/
        var vm = this;

        vm.tweets = [];
        vm.count  = 0;
        vm.title  = 'Live Tweet Stream List';
        vm.settings = {
            profilePicturesEnabled: false
        };

        activate();

        ///////////

        function activate() {

            socket.on('tweet', function (tweet) {

                console.log(tweet);
                vm.tweets.unshift(tweet);
                vm.tweets = vm.tweets.splice(0,50);
                vm.count++;
            });
        }
    }
})();