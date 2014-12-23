(function () {
    'use strict';

    angular
        .module('app.stream')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    /* @ngInject */
    function appRun(routehelper) {

        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {

        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/stream/stream.html',
                    controller: 'Stream',
                    controllerAs: 'vm',
                    title: 'stream title'
                }
            }
        ];
    }

})();
