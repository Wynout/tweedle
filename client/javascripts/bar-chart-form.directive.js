/**
 * Bar Chart Form directive, based on
 * @link http://bl.ocks.org/biovisualize/5372077
 */
(function () {
    'use strict';

    angular.module('tweetStreamApp')
        .directive('barChartForm', barChartForm);

    barChartForm.$inject = [];

    function barChartForm() {

        var directive = {
            restrict: 'E',
            replace: true,
            controller: function ($scope) {

                $scope.update = function (d, i) { $scope.data = randomData(); };
                function randomData() {

                    return d3.range(~~(Math.random()*50)+1).map(function (d, i) { return ~~(Math.random()*1000); });
                }
            },
            template:
            '<div class="form">' +
                'Height: {{vm.options.height}}px<br />' +
                '<input type="range" ng-model="vm.options.height" min="100" max="800"/>' +
                'Width: {{vm.options.width}}px<br />' +
                '<input type="range" ng-model="vm.options.width" min="100" max="1200"/>' +
                '<br /><button ng-click="update()">Update Data</button>' +
                '<br />Hovered bar data: {{vm.barValue}}' +
            '</div>'
        };

        return directive;
    }
})();