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
      var margin = { top: 10, right: 100, bottom: 150, left: 60 }
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
        .attr('dx', that.width / 2)
        .attr('dy', '75rem')
        .attr('x', 6)
        .style('text-anchor', 'end')
        .text('Gdp')
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
        .attr('dx', -(that.height / 2.3))
        .attr('dy', '-5rem')
        .attr('y', 6)
        .style('text-anchor', 'end')
        .text('Suicides rate')
        .attr('fill', 'black')
        .attr('font-size', '2rem')

      that.updateLollipop()
    },
    updateLollipop () {
      var that = this
      that.data = that.pil
      var a = that.data.map(function (d) { return d.country })

      // X axis
      that.x
        .domain(that.data.map(function (d) { return d.gdpYear }))
      that.xAxis
        .transition()
        .duration(500)
        // .call(d3.axisBottom(that.x))
        // .append('g')
        // .attr('transform', 'translate(0,' + that.height + ')')
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
        // .transition()
        // .duration(1000)
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
        .attr('x1', function (d) { return that.x(d.gdpYear) })
        .attr('x2', function (d) { return that.x(d.gdpYear) })
        .attr('y1', function (d) { return that.y(d.rate) })
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
        .attr('cx', function (d) { return that.x(d.gdpYear) })
        .attr('cy', function (d) { return that.y(d.rate) })
        .attr('r', 4)
        .style('fill', '#69b3a2')
        .attr('stroke', 'black')
    }
    // lollipop () {
    //   var that = this
    //   // set the dimensions and margins of the graph
    //   var margin = { top: 10, right: 30, bottom: 150, left: 60 }
    //   that.width = 1300 - margin.left - margin.right
    //   that.height = 800 - margin.top - margin.bottom

    //   that.svg = d3.select('#pil')
    //     .append('svg')
    //     .attr('width', that.width + margin.left + margin.right)
    //     .attr('height', that.height + margin.top + margin.bottom)
    //     .append('g')
    //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    //   // Tooltip
    //   var tooltip = d3.select('#pil')
    //     .append('div')
    //     .attr('class', 'tooltip')
    //     .style('opacity', 0)

    //   that.data = that.pil
    //   var a = that.data.map(function (d) { return d.country })
    //   // X axis
    //   that.x = d3.scaleBand()
    //     .domain(that.data.map(function (d) { return d.gdpYear }))
    //     .range([0, that.width])
    //     .paddingInner(5)
    //     .paddingOuter(1)
    //   that.xAxis = that.svg
    //     .append('g')
    //     .attr('transform', 'translate(0,' + that.height + ')')
    //     .call(d3.axisBottom(that.x).tickFormat(
    //       function (d, i) {
    //         if (a[i] === 'United States of America') {
    //           return 'U.S.A.'
    //         }
    //         return a[i]
    //       })
    //     )
    //     .selectAll('text')
    //     .attr('transform', 'translate(-10,0)rotate(-45)')
    //     .style('text-anchor', 'end')
    //     .attr('font-size', '1.3rem')

    //   that.svg
    //     .append('text')
    //     .attr('class', 'label')
    //     .attr('dx', that.width / 2)
    //     .attr('dy', '75rem')
    //     .attr('x', 6)
    //     .style('text-anchor', 'end')
    //     .text('Gdp')
    //     .attr('fill', 'black')
    //     .attr('font-size', '2rem')

    //   // Add Y axis
    //   that.y = d3.scaleLinear()
    //     .domain([0, 50])
    //     .range([that.height, 0])
    //   that.svg
    //     .append('g')
    //     .call(d3.axisLeft(that.y))
    //     .append('text')
    //     .attr('class', 'label')
    //     .attr('transform', 'rotate(-90)')
    //     .attr('dx', -(that.height / 2.3))
    //     .attr('dy', '-4rem')
    //     .attr('y', 6)
    //     .style('text-anchor', 'end')
    //     .text('Suicides rate')
    //     .attr('fill', 'black')
    //     .attr('font-size', '2rem')

    //   // Lines
    //   that.svg.selectAll('myline')
    //     .data(that.data)
    //     .enter()
    //     .append('line')
    //     .attr('x1', function (d) { return that.x(d.gdpYear) })
    //     .attr('x2', function (d) { return that.x(d.gdpYear) })
    //     .attr('y1', function (d) { return that.y(d.rate) })
    //     .attr('y2', that.y(0))
    //     .attr('stroke', 'grey')

    //   const mouseLeave = function (d) {
    //     tooltip.transition()
    //       .duration(500)
    //       .style('opacity', 0)
    //   }

    //   const mouseMove = function (d) {
    //     tooltip.transition()
    //       .duration(200)
    //       .style('opacity', 1)
    //     tooltip.html('<div>' + d.country + '</div><span>Gdp: ' + d.gdpYear + '</span><br><span>Suicides rate: ' + d.rate + '</span>')
    //       .style('left', (d3.event.pageX) + 'px')
    //       .style('top', (d3.event.pageY - 30) + 'px')
    //   }

    //   // Circles
    //   that.svg.selectAll('mycircle')
    //     .data(that.data)
    //     .enter()
    //     .append('circle')
    //     .attr('cx', function (d) { return that.x(d.gdpYear) })
    //     .attr('cy', function (d) { return that.y(d.rate) })
    //     .attr('r', '4')
    //     .style('fill', '#69b3a2')
    //     .attr('stroke', 'black')
    //     .on('mouseleave', mouseLeave)
    //     .on('mousemove', mouseMove)
    // }
  }
}
</script>
