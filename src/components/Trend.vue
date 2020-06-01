<template>
  <div id="line-chart"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Trend',
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
      line: null,
      linea1: null,
      linea2: null
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
      var margin = { top: 10, right: 30, bottom: 50, left: 70 }
      that.width = 800 - margin.left - margin.right
      that.height = 740 - margin.top - margin.bottom

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
      that.xAxis = d3.axisBottom()
        .scale(that.x)
      that.svg
        .append('g')
        .attr('transform', 'translate(0,' + that.height + ')')
        .attr('class', 'myXaxis')
        .call(that.xAxis.tickFormat(d3.format('.0f')))
        .selectAll('text')
        .attr('font-size', '1.2rem')
      that.svg
        .selectAll('.myXaxis')
        .append('text')
        .attr('dx', that.width / 2)
        .attr('dy', '4.5rem')
        .attr('x', 6)
        .style('text-anchor', 'end')
        .text('Year')
        .attr('class', 'label')
        .attr('fill', 'black')
        .attr('font-size', '2rem')

      // Add Y axis
      that.y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.n })])
        .range([that.height, 0])
      that.yAxis = d3.axisLeft()
        .scale(that.y)
      that.svg
        .append('g')
        .attr('class', 'myYaxis')
        .call(that.yAxis)
        .selectAll('text')
        .attr('font-size', '1.2rem')
      that.svg
        .selectAll('.myYaxis')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('dx', -(that.height / 2))
        .attr('dy', '-6rem')
        .attr('y', 6)
        .style('text-anchor', 'end')
        .text('Suicides')
        .attr('class', 'label')
        .attr('fill', 'black')
        .attr('font-size', '2rem')

      that.line = d3.line()
        .defined(d => !(!d.n))
        .x(d => that.x(d.y))
        .y(d => that.y(d.n))
        .curve(d3.curveMonotoneX)

      that.linea1 = that.svg
        .append('path')
        .datum(data.filter(that.line.defined()))
        .attr('fill', 'none')
        .attr('d', that.line)

      // Add the line
      that.linea2 = that.svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 3)
        .attr('d', that.line)
    },
    lineUpdate () {
      var that = this
      var data = that.suicidiCountry

      // Add X axis
      that.x
        .domain(d3.extent(data, function (d) { return d.y }))
      that.svg
        .selectAll('.myXaxis')
        .transition()
        .duration(1000)
        .call(that.xAxis)
        .selectAll('.tick')
        .attr('font-size', '1.2rem')

      // Add Y axis
      that.y
        .domain([0, d3.max(data, function (d) { return d.n })])
      that.svg
        .selectAll('.myYaxis')
        .transition()
        .duration(1000)
        .call(that.yAxis)
        .selectAll('.tick')
        .attr('font-size', '1.2rem')

      that.svg
        .selectAll('.label')
        .attr('font-size', '2rem')

      that.line = d3.line()
        .defined(d => !(!d.n))
        .x(d => that.x(d.y))
        .y(d => that.y(d.n))
        .curve(d3.curveMonotoneX)

      that.linea1
        .datum(data.filter(that.line.defined()))
        .transition()
        .duration(600)
        .attr('fill', 'none')
        .attr('d', that.line)

      // Add the line
      that.linea2
        .datum(data)
        .transition()
        .duration(600)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 3)
        .attr('d', that.line)
    }
  }
}
</script>
