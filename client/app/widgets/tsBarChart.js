/**
 * Bar Chart directive, based on
 * @link http://bl.ocks.org/biovisualize/5372077
 */
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('tsBarChart', tsBarChart);

    tsBarChart.$inject = ['d3'];

    /* @ngInject */
    function tsBarChart(d3) {
        // Usage:
        // <ts-bar-chart data="vm.data" hovered="vm.hovered(args)"></ts-bar-chart>
        // Creates:
        // <div class="chart ng-isolate-scope" data="vm.data" hovered="vm.hovered(args)">
        //     <svg class="chart" width="1024" height="250">...</svg>
        // </div>

        var chart = d3.custom.barChart();
        var directive = {
            restrict: 'E',
            replace : true,
            template: '<div class="chart"></div>',
            scope: {
                width  : '=width',
                height : '=height',
                data   : '=data',
                hovered: '&hovered'
            },
            link        : linkFunction,
            controller  : BarChartController,
            controllerAs: 'vm'
        };

        return directive;
        /////////////////

        function linkFunction(scope, element, attributes) {

            var chartElement = d3.select(element[0]);
            chart.on('barHover', function (d, i) {

                scope.hovered({args:d});
            });

            scope.$watch('data', function (newVal) {

                chartElement.datum(newVal).call(chart);
            }, true);
        }
    }


    /**
     * Note: The directive's controller is outside the directive's closure.
     * Why?: This style eliminates issues where the injection gets created as unreachable code after a return.
     */
    BarChartController.$inject = ['$scope'];

    /* @ngInject */
    function BarChartController($scope) {

        // Injecting $scope just for comparison
        /* jshint validthis:true */
        var vm = this;
    }
})();
