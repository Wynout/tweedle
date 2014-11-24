(function () {
    'use strict';

    var controllerId = 'TweetList';

    angular.module('tweetStreamApp')
        .controller(controllerId, ['socket', TweetList]);

    TweetList.$inject = ['socket'];

    function TweetList(socket) {

        var vm = this;

        //vm.tweets = socket.tweets;
        vm.tweets = [];
        vm.count = 0;


        vm.activate = activate;
        vm.title = 'Tweet Stream List';

        activate();

        function activate() {

            socket.on('message', function (data) {

                console.log(data);
                vm.tweets.unshift(data);
                vm.tweets = vm.tweets.splice(0,50);
                vm.count++;
            });
        }
    }
})();