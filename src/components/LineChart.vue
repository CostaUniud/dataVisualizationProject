<template>
  <div id="line-chart"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'LineChart',
  props: {
    fieldCountry: String
  },
  data () {
    return {
      svg: null,
      width: null,
      height: null,
      xAxis: null,
      x: null,
      yAxis: null,
      y: null,
      line: null
    }
  },
  watch: {
    fieldCountry: async function () {
      await this.getSuicidiCountryFromDb(this.fieldCountry)
        .then(response => {
          this.lineUpdate()
        })
    },
    dbUpdate: function () {
      this.createLine()
    }
  },
  computed: {
    ...mapGetters({
      suicidiCountry: 'suicidi/getSuicidiCountry',
      dbUpdate: 'db/getDbUpdate'
    })
  },
  methods: {
    ...mapActions({
      getSuicidiCountryFromDb: 'suicidi/getSuicidiCountryFromDb'
    }),
    createLine () {
      var that = this
      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 30, bottom: 30, left: 60 }
      that.width = 860 - margin.left - margin.right
      that.height = 800 - margin.top - margin.bottom

      // append the svg object to the body of the page
      that.svg = d3.select('#line-chart')
        .append('svg')
        .attr('width', that.width + margin.left + margin.right)
        .attr('height', that.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      var data = that.suicidiCountry

      // Add X axis
      that.x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.y }))
        .range([0, that.width])

      that.xAxis = d3.axisBottom().scale(that.x)

      that.svg
        .append('g')
        .attr('transform', 'translate(0,' + that.height + ')')
        .attr('class', 'myXaxis')
        .call(that.xAxis.tickFormat(d3.format('.0f')))
        .append('text')
        .attr('dx', that.width)
        .attr('dy', '-.75em')
        .attr('x', 6)
        .style('text-anchor', 'end')
        .text('Year')
        .attr('fill', 'black')

      // Add Y axis
      that.y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.n })])
        .range([that.height, 0])

      that.yAxis = d3.axisLeft().scale(that.y)

      that.svg
        .append('g')
        .attr('class', 'myYaxis')
        .call(that.yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('dy', '.75em')
        .attr('y', 6)
        .style('text-anchor', 'end')
        .text('Suicides')
        .attr('fill', 'black')

      // Add the line
      that.line = that.svg
        .append('g')
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
          .x(function (d) { return that.x(d.y) })
          .y(function (d) { return that.y(d.n) })
          // .curve(d3.curveMonotoneX) // apply smoothing to the line
        )

      // Dot
      // that.svg.selectAll('.dot')
      //   .data(data)
      //   .enter()
      //   .append('circle')
      //   .attr('class', 'dot')
      //   .attr('cx', function (d) { return that.x(d.y) })
      //   .attr('cy', function (d) { return that.y(d.n) })
      //   .attr('r', 5)
      //   .attr('fill', 'steelblue')
    },
    lineUpdate () {
      var that = this
      var data = that.suicidiCountry

      // Add X axis
      that.x.domain(d3.extent(data, function (d) { return d.y }))
      that.svg.selectAll('.myXaxis')
        .transition()
        .duration(600)
        .call(that.xAxis)

      // Add Y axis
      that.y.domain([0, d3.max(data, function (d) { return d.n })])
      that.svg.selectAll('.myYaxis')
        .transition()
        .duration(600)
        .call(that.yAxis)

      // Add the line
      that.line
        .datum(data)
        .transition()
        .duration(600)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
          .x(function (d) { return that.x(d.y) })
          .y(function (d) { return that.y(d.n) })
        )
    }
  }
}
</script>
