/**
 * @link http://bl.ocks.org/biovisualize/5372077
 */
(function () {
    'use strict';

    d3.custom = {};

    d3.custom.barChart = function module() {

        var canvas     = {width: 500, height: 300},
            margin     = {top: 20, right: 20, bottom: 40, left: 40},
            chart    = {
                width : canvas.width  - margin.left - margin.right,
                height: canvas.height - margin.top  - margin.bottom
            },
            ease       = 'cubic-in-out',
            duration   = 500,
            gap        = 0,
            timeFormat = 'mm[m]:ss[s]',
            svg;

        var dispatch = d3.dispatch('customHover');
        d3.rebind(exports, dispatch, 'on');

        return exports;

        ///////////////

        function exports(_selection) {

            _selection.each(function (_data) {

                _data = formatTimestamp(_data, timeFormat);

                var xScale = d3.scale.ordinal()
                    .domain(_data.map(function (d, i) { return d.timestamp; }))
                    .rangeRoundBands([0, chart.width], .1);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(_data, function(d, i){ return d.value; })])
                    .range([chart.height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left');

                // Setup bar chart svg element
                if (!svg) {
                    svg = d3.select(this)
                        .append('svg')
                        .classed('chart', true)
                        .attr('width', canvas.width)
                        .attr('height', canvas.height)
                        .call(responsivefy); // Enables responsive charting

                    var container = svg.append('g').classed('container-group', true);
                    container.append('g').classed('chart-group', true);
                    container.append('g').classed('x-axis-group axis', true);
                    container.append('g').classed('y-axis-group axis', true);
                }
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

            // not used:
            /*
            this.gap = function (_x) {

                if (!arguments.length) { return gap; }
                gap = _x;
                return this;
            };
            this.ease = function(_x) {

                if (!arguments.length) { return ease; }
                ease = _x;
                return this;
            };
            */
        }
    };


    function formatTimestamp(_data, format) {

        format = !!format ? format : 'HH:mm:ss';

        _data.map(function (d) {

            if (typeof d.timestamp !=='number') {
                return d;
            }
            d.timestamp = moment(d.timestamp).format(format);
            return d;
        });
        return _data;
    }


    /**
     * Responsive D3 Charting
     * @link http://www.brendansudol.com/posts/responsive-d3/
     */
    function responsivefy(svg) {

        // get container + svg aspect ratio
        var container = d3.select(svg.node().parentNode),
            width     = parseInt(svg.style('width'), 10),
            height    = parseInt(svg.style('height'), 10),
            aspect    = width / height;

        // add viewBox and preserveAspectRatio properties,
        // and call resize so that svg resizes on inital page load
        svg.attr('viewBox', '0 0 ' + width + ' ' + height)
            .attr('preserveAspectRatio', 'xMinYMid')
            .call(resize);

        // to register multiple listeners for same event type,
        // you need to add namespace, i.e., 'click.foo'
        // necessary if you call invoke this function for multiple svgs
        // api docs: https://github.com/mbostock/d3/wiki/Selections#on
        d3.select(window).on('resize.' + container.attr('id'), resize);

        // get width of container and resize svg to fit it
        function resize() {

            var targetWidth = parseInt(container.style('width'), 10);
            svg.attr('width', targetWidth);
            svg.attr('height', Math.round(targetWidth / aspect));
        }
    }
})();