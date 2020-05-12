<template>
  <div id="pie-sex"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'PieSex',
  props: {
    fieldYear: Number
  },
  data () {
    return {
      svg: null,
      radius: null,
      tooltip: null
    }
  },
  watch: {
    fieldYear: async function () {
      await this.getSexFromDb(this.fieldYear)
        .then(response => {
          this.pieUpdate()
        })
    },
    dbUpdate: async function () {
      this.pie()
    }
  },
  computed: {
    ...mapGetters({
      sex: 'suicidi/getSex',
      dbUpdate: 'db/getDbUpdate'
    })
  },
  methods: {
    ...mapActions({
      getSexFromDb: 'suicidi/getSexFromDb'
    }),
    pie () {
      var that = this
      // set the dimensions and margins of the graph
      var width = 600
      var height = 570
      var margin = 90

      // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
      this.radius = Math.min(width, height) / 2 - margin
      // Tooltip
      this.tooltip = d3.select('#pie-sex')
        .append('div')
        .attr('class', 'tooltip-pie')
        .style('opacity', 0)
      // Legend
      var keys = ['Male', 'Female']
      var colorLegend = d3.scaleOrdinal()
        .domain(keys)
        .range(['#05B2DC', '#D72483'])

      const mouseLeave = function (d) {
        that.tooltip.transition()
          .duration(500)
          .style('opacity', 0)
      }

      const mouseMove = function (d) {
        that.tooltip.transition()
          .duration(200)
          .style('opacity', 1)
        that.tooltip.html('<span>' + Math.round((d.data.value / (that.sex.male + that.sex.female)) * 100) + '%</span>')
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px')
      }

      // append the svg object to the div called 'pie'
      this.svg = d3.select('#pie-sex')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      // Create dummy data
      var data = { a: this.sex.male, b: this.sex.female }

      // set the color scale
      var color = d3.scaleOrdinal()
        .domain(data)
        .range(['#05B2DC', '#D72483'])

      // Compute the position of each group on the pie:
      var pie = d3.pie()
        .value(function (d) { return d.value })
      var dataReady = pie(d3.entries(data))

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      this.svg.selectAll('sex')
        .data(dataReady)
        .enter()
        .append('path')
        .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(this.radius)
        )
        .attr('fill', function (d) { return (color(d.data.key)) })
        .on('mouseleave', mouseLeave)
        .on('mousemove', mouseMove)

      // Draw the legend
      var size = 20
      this.svg.selectAll('mydots')
        .data(keys)
        .enter()
        .append('rect')
        .attr('x', 230)
        .attr('y', function (d, i) { return i * (size + 5) - 20 })
        .attr('width', size)
        .attr('height', size)
        .style('fill', function (d) { return colorLegend(d) })
      this.svg.selectAll('mylabels')
        .data(keys)
        .enter()
        .append('text')
        .attr('x', 230 + size * 1.2)
        .attr('y', function (d, i) { return i * (size + 5) + (size / 2) - 20 })
        .style('fill', 'black')
        .text(function (d) { return d })
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle')
    },
    pieUpdate () {
      var that = this
      // Create dummy data
      var data = { a: this.sex.male, b: this.sex.female }

      // set the color scale
      var color = d3.scaleOrdinal()
        .domain(data)
        .range(['#05B2DC', '#D72483'])

      // Compute the position of each group on the pie:
      var pie = d3.pie()
        .value(function (d) { return d.value })
      var dataReady = pie(d3.entries(data))

      const mouseLeave = function (d) {
        that.tooltip.transition()
          .duration(500)
          .style('opacity', 0)
      }

      const mouseMove = function (d) {
        that.tooltip.transition()
          .duration(200)
          .style('opacity', 1)
        that.tooltip.html('<span>' + Math.round((d.data.value / (that.sex.male + that.sex.female)) * 100) + '%</span>')
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px')
      }

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      this.svg.selectAll('sex')
        .data(dataReady)
        .enter()
        .append('path')
        .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(this.radius)
        )
        .attr('fill', function (d) { return (color(d.data.key)) })
        .on('mouseleave', mouseLeave)
        .on('mousemove', mouseMove)
    }
  }
}
</script>
