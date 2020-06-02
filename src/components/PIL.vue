<template>
  <div id="pil"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'PIL',
  props: {
    fieldYear: Number
  },
  data () {
    return {
      width: null,
      height: null,
      svg: null,
      data: null,
      x: null,
      y: null,
      xAxis: null,
      tooltip: null
    }
  },
  watch: {
    country: async function () {
      var that = this
      await that.getPilFromDb(1985)
        .then(() => {
          that.lolli()
        })
    },
    fieldYear: async function () {
      var that = this
      await that.getPilFromDb(that.fieldYear)
        .then(response => {
          that.updateLollipop()
        })
    }
  },
  computed: {
    ...mapGetters({
      country: 'suicidi/getCountry',
      pil: 'suicidi/getPil'
    })
  },
  methods: {
    ...mapActions({
      getPilFromDb: 'suicidi/getPilFromDb'
    }),
    lolli () {
      var that = this
      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 40, bottom: 150, left: 250 }
      that.width = 1700 - margin.left - margin.right
      that.height = 800 - margin.top - margin.bottom

      that.svg = d3.select('#pil')
        .append('svg')
        .attr('width', that.width + margin.left + margin.right)
        .attr('height', that.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Tooltip
      that.tooltip = d3.select('#pil')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

      // Initialize the X axis
      that.x = d3.scaleBand()
        .range([0, that.width])
        .paddingInner(7)
        .paddingOuter(1)
      that.xAxis = that.svg
        .append('g')
        .attr('transform', 'translate(0,' + that.height + ')')

      that.svg
        .append('text')
        .attr('class', 'label')
        .attr('dx', that.width / 2.3)
        .attr('dy', '75rem')
        .attr('x', 6)
        .text('Gross domestic product')
        .attr('fill', 'black')
        .attr('font-size', '2rem')

      // Initialize the Y axis
      that.y = d3.scaleLinear()
        .range([that.height, 0])
      that.yAxis = that.svg
        .append('g')
        .attr('class', 'myYaxis')

      that.svg
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('dx', -(that.height / 1.7))
        .attr('dy', '-5rem')
        .attr('y', 6)
        .text('Suicides rate')
        .attr('fill', 'black')
        .attr('font-size', '2rem')

      that.updateLollipop()
    },
    updateLollipop () {
      var that = this
      that.data = that.pil
      var a = that.data.map(d => d.country)

      // X axis
      that.x
        .domain(that.data.map(d => d.gdpYear))
      that.xAxis
        .transition()
        .duration(500)
        .call(d3.axisBottom(that.x).tickFormat(
          function (d, i) {
            if (a[i] === 'United States of America') {
              return 'U.S.A.'
            }
            return a[i]
          })
        )
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')
        .attr('font-size', '1.3rem')

      // Add Y axis
      that.y
        .domain([0, 50])
      that.yAxis
        .call(d3.axisLeft(that.y))

      // variable u: map data to existing circle
      var j = that.svg
        .selectAll('.myLine')
        .data(that.data)

      j.exit().remove()

      // update lines
      j
        .enter()
        .append('line')
        .attr('class', 'myLine')
        .merge(j)
        .transition()
        .duration(500)
        .attr('x1', d => that.x(d.gdpYear))
        .attr('x2', d => that.x(d.gdpYear))
        .attr('y1', d => that.y(d.rate))
        .attr('y2', that.y(0))
        .attr('stroke', 'grey')

      const mouseLeave = function (d) {
        that.tooltip
          .transition()
          .duration(500)
          .style('opacity', 0)
      }

      const mouseMove = function (d) {
        that.tooltip
          .transition()
          .duration(200)
          .style('opacity', 1)
        that.tooltip
          .html('<div>' + d.country + '</div><span>Gdp: ' + d.gdpYear + '</span><br><span>Suicides rate: ' + d.rate + '</span>')
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px')
      }

      // variable u: map data to existing circle
      var u = that.svg
        .selectAll('circle')
        .data(that.data)

      u.exit().remove()

      // update circle
      u
        .enter()
        .append('circle')
        .on('mouseleave', mouseLeave)
        .on('mousemove', mouseMove)
        .merge(u)
        .transition()
        .duration(500)
        .attr('cx', d => that.x(d.gdpYear))
        .attr('cy', d => that.y(d.rate))
        .attr('r', 4)
        .style('fill', '#69b3a2')
        .attr('stroke', 'black')
    }
  }
}
</script>
