import React, {Component} from 'react';
import * as d3 from 'd3';
import {createElement as fauxCreateElement} from 'react-faux-dom';


class Chart extends Component {

    render() {
        var data = this.props.data
        var margin = {top: 20, right: 20, bottom: 30, left: 50}
        var width = 960 - margin.left - margin.right
        var height = 500 - margin.top - margin.bottom

        var parseDate = d3.timeParse('%d-%b-%y')

        var x = d3.scaleTime()
            .range([0, width])

        var y = d3.scaleLinear()
            .range([height, 0])

        var xAxis = d3.axisBottom()
            .scale(x)


        var yAxis = d3.axisLeft()
            .scale(y)

        var line = d3.line()
            .x(function (d) { return x(d.date) })
            .y(function (d) { return y(d.close) })

        var node = fauxCreateElement('svg')
        var svg = d3.select(node)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        data.forEach(function (d) {
            d.date = parseDate(d.date)
            d.close = +d.close
        })

        x.domain(d3.extent(data, function (d) { return d.date }))
        y.domain(d3.extent(data, function (d) { return d.close }))

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Price ($)')

        svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line)

        return node.toReact()
    }
}

export default Chart;