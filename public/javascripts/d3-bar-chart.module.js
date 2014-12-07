/**
 * @link http://bl.ocks.org/biovisualize/5372077
 */
(function () {
    'use strict';

    d3.custom = {};

    d3.custom.barChart = function module() {

        var margin   = {top: 20, right: 20, bottom: 40, left: 40},
            canvas   = {width: 500, height: 500},
            chart    = {width: 500, height: 500},
            gap      = 0,
            ease     = 'cubic-in-out',
            duration = 500,
            svg;

        var dispatch = d3.dispatch('customHover');

        function exports(_selection) {

            _selection.each(function (_data) {

                chart.width  = canvas.width  - margin.left - margin.right;
                chart.height = canvas.height - margin.top  - margin.bottom;

                var xScale = d3.scale.ordinal()
                    .domain(_data.map(function (d, i) { return d.timestamp; }))
                    .rangeRoundBands([0, chart.width], .1);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(_data, function(d, i){ return d.value; })])
                    .range([chart.height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .tickFormat(function (d) { return moment(d.timestamp).format('HH:mm:ss'); })
                    .orient('bottom');

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left');

                // Setup bar chart svg element
                if (!svg) {
                    svg = d3.select(this)
                        .append('svg')
                        .classed('chart', true);
                    var container = svg.append('g').classed('container-group', true);
                    container.append('g').classed('chart-group', true);
                    container.append('g').classed('x-axis-group axis', true);
                    container.append('g').classed('y-axis-group axis', true);
                }
                svg.transition()
                    .duration(duration).attr({width: canvas.width, height: canvas.height});
                svg.select('.container-group')
                    .attr({transform: 'translate(' + margin.left + ',' + margin.top + ')'});

                // Create X axis
                svg.select('.x-axis-group.axis')
                    .transition()
                    .duration(duration)
                    .ease(ease)
                    .attr({transform: 'translate(0,' + (chart.height) + ')'})
                    .call(xAxis);

                // Create Y axis
                svg.select('.y-axis-group.axis')
                    .transition()
                    .duration(duration)
                    .ease(ease)
                    .call(yAxis);

                var gapSize  = xScale.rangeBand() / 100 * gap;
                var barWidth = xScale.rangeBand() - gapSize;

                // Data join
                var bars = svg.select('.chart-group')
                    .selectAll('.bar')
                    .data(_data);

                // Enter
                bars.enter().append('rect')
                    .classed('bar', true)
                    .attr({
                        x     : function (d) { return xScale(d.timestamp); },
                        width : barWidth,
                        y     : function (d, i) { return yScale(d.value); },
                        height: function (d, i) { return chart.height - yScale(d.value); }
                    })
                    .on('mouseover', dispatch.customHover);

                // Both Enter & Update ?
                bars
                    .transition()
                    .duration(duration)
                    .ease(ease)
                    .attr({
                        width : barWidth,
                        x     : function(d, i) { return xScale(d.timestamp) + gapSize/2; },
                        y     : function(d, i) { return yScale(d.value); },
                        height: function(d, i) { return chart.height - yScale(d.value); }
                    });

                // Exit
                bars.exit().transition().style({opacity: 0}).remove();

                duration = 500;
            });
        }
        exports.width = function (_x) {

            if (!arguments.length) { return canvas.width; }
            canvas.width = parseInt(_x);
            return this;
        };
        exports.height = function (_x) {

            if (!arguments.length) { return canvas.height; }
            canvas.height = parseInt(_x);
            duration = 0;
            return this;
        };
        exports.gap = function (_x) {

            if (!arguments.length) { return gap; }
            gap = _x;
            return this;
        };
        exports.ease = function(_x) {

            if (!arguments.length) { return ease; }
            ease = _x;
            return this;
        };
        d3.rebind(exports, dispatch, 'on');
        return exports;
    };
})();