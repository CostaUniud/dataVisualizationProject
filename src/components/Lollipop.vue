<template>
  <div id="lollipop"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Lollipop',
  data () {
    return {
      width: null,
      height: null,
      svg: null,
      data: null,
      x: null,
      y: null,
      xAxis: null
    }
  },
  async mounted () {
    await this.init()
  },
  watch: {
    country: async function () {
      var that = this
      await that.getCountryHappyFromDb()
        .then(async () => {
          await that.lollipop()
        })
    }
  },
  computed: {
    ...mapGetters({
      country: 'suicidi/getCountry',
      happySuic: 'happiness/getHappySuic'
    })
  },
  methods: {
    ...mapActions({
      init: 'happiness/init',
      getCountryHappyFromDb: 'happiness/getCountryHappyFromDb',
      getHappySuicFromDb: 'happiness/getHappySuicFromDb'
    }),
    async lollipop () {
      var that = this
      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 30, bottom: 150, left: 60 }
      that.width = 1300 - margin.left - margin.right
      that.height = 800 - margin.top - margin.bottom

      that.svg = d3.select('#lollipop')
        .append('svg')
        .attr('width', that.width + margin.left + margin.right)
        .attr('height', that.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Tooltip
      var tooltip = d3.select('#lollipop')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

      // Get the data
      await this.getHappySuicFromDb()
        .then(response => {
          that.data = that.happySuic
          var a = that.data.map(function (d) { return d.country })
          // X axis
          that.x = d3.scaleBand()
            .domain(that.data.map(function (d) { return d.rank }))
            .range([0, that.width])
            .paddingInner(5)
            .paddingOuter(1)
          that.svg
            .append('g')
            .attr('transform', 'translate(0,' + that.height + ')')
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
            .attr('font-size', '1.5rem')

          that.svg
            .append('text')
            .attr('class', 'label')
            .attr('dx', that.width / 2)
            .attr('dy', '75rem')
            .attr('x', 6)
            .style('text-anchor', 'end')
            .text('Happiness')
            .attr('fill', 'black')
            .attr('font-size', '2rem')

          // Add Y axis
          that.y = d3.scaleLinear()
            .domain([0, 40])
            .range([that.height, 0])
          that.svg
            .append('g')
            .call(d3.axisLeft(that.y))
            .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('dx', -(that.height / 2.3))
            .attr('dy', '-4rem')
            .attr('y', 6)
            .style('text-anchor', 'end')
            .text('Suicides rate')
            .attr('fill', 'black')
            .attr('font-size', '2rem')

          // Lines
          that.svg
            .selectAll('myline')
            .data(that.data)
            .enter()
            .append('line')
            .attr('x1', function (d) { return that.x(d.rank) })
            .attr('x2', function (d) { return that.x(d.rank) })
            .attr('y1', function (d) { return that.y(d.rate) })
            .attr('y2', that.y(0))
            .attr('stroke', 'grey')

          const mouseLeave = function (d) {
            tooltip
              .transition()
              .duration(500)
              .style('opacity', 0)
          }

          const mouseMove = function (d) {
            tooltip
              .transition()
              .duration(200)
              .style('opacity', 1)
            tooltip
              .html('<div>' + d.country + '</div><span>Rank: ' + d.rank + '</span><br><span>Rate: ' + d.rate + '</span>')
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY - 30) + 'px')
          }

          // Circles
          that.svg
            .selectAll('mycircle')
            .data(that.data)
            .enter()
            .append('circle')
            .attr('cx', function (d) { return that.x(d.rank) })
            .attr('cy', function (d) { return that.y(d.rate) })
            .attr('r', '4')
            .style('fill', '#69b3a2')
            .attr('stroke', 'black')
            .on('mouseleave', mouseLeave)
            .on('mousemove', mouseMove)
        })
    }
    // async scatter () {
    //   var that = this
    //   // set the dimensions and margins of the graph
    //   var margin = { top: 10, right: 30, bottom: 50, left: 60 }
    //   that.width = 800 - margin.left - margin.right
    //   that.height = 740 - margin.top - margin.bottom

    //   // append the svg object to the body of the page
    //   that.svg = d3.select('#scatter')
    //     .append('svg')
    //     .attr('width', that.width + margin.left + margin.right)
    //     .attr('height', that.height + margin.top + margin.bottom)
    //     .append('g')
    //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').text('Year')
    //     .attr('fill', 'black')

    //   // Tooltip
    //   var tooltip = d3.select('#scatter')
    //     .append('div')
    //     .attr('class', 'tooltip')
    //     .style('opacity', 0)

    //   // Get the data
    //   await this.getHappySuicFromDb()
    //     .then(response => {
    //       // for (var i = 0; i < that.happy.length; i++) {
    //       //   for (var j = 0; j < that.country.length; j++) {
    //       //     // console.log(i + '.' + j + ' ' + that.country[j] + ' ' + happy[i].Country)
    //       //     if (that.country[j] !== that.happy[i].country) {
    //       //       console.log('NON trovato ' + that.happy[i].country)
    //       //     } else {
    //       //       break
    //       //     }
    //       //   }
    //       // }
    //       // })
    //       that.data = that.getHappySuic
    //       // Add X axis
    //       that.x = d3.scaleLinear()
    //         .domain([160, 0])
    //         .range([0, that.width])
    //       that.xAxis = that.svg.append('g')
    //         .attr('transform', 'translate(0,' + that.height + ')')
    //         .call(d3.axisBottom(that.x))
    //         .append('text')
    //         .attr('class', 'label')
    //         .attr('dx', that.width / 1.7)
    //         .attr('dy', '4.5rem')
    //         .attr('x', 6)
    //         .style('text-anchor', 'end')
    //         .text('Rank happiness')
    //         .attr('fill', 'black')
    //         .attr('font-size', '2rem')

    //       // Add Y axis
    //       that.y = d3.scaleLinear()
    //         .domain([0, 160])
    //         .range([that.height, 0])
    //       that.svg.append('g')
    //         .call(d3.axisLeft(that.y))
    //         .append('text')
    //         .attr('class', 'label')
    //         .attr('transform', 'rotate(-90)')
    //         .attr('dx', -(that.height / 2.3))
    //         .attr('dy', '-4rem')
    //         .attr('y', 6)
    //         .style('text-anchor', 'end')
    //         .text('Suicides rate')
    //         .attr('fill', 'black')
    //         .attr('font-size', '2rem')

    //       const mouseLeave = function (d) {
    //         tooltip.transition()
    //           .duration(500)
    //           .style('opacity', 0)
    //       }

    //       const mouseMove = function (d) {
    //         tooltip.transition()
    //           .duration(200)
    //           .style('opacity', 1)
    //         tooltip.html('<div>' + d.country + '</div><span>Rank: ' + d.rank + '</span><br><span>Rate: ' + d.rate + '</span>')
    //           .style('left', (d3.event.pageX) + 'px')
    //           .style('top', (d3.event.pageY - 30) + 'px')
    //       }

    //       // Add dots
    //       that.svg.append('g')
    //         .selectAll('dot')
    //         .data(that.data)
    //         .enter()
    //         .append('circle')
    //         .attr('cx', function (d) { return that.x(d.rank) })
    //         .attr('cy', function (d) { return that.y(d.rate) })
    //         .attr('r', 5)
    //         .style('fill', '#69b3a2')
    //         .on('mouseleave', mouseLeave)
    //         .on('mousemove', mouseMove)
    //     })
    // },
    // updatePlot () {
    //   var that = this

    //   // Update X axis
    //   that.x
    //     .domain([160, 1 * that.fieldNumber])
    //   that.xAxis
    //     .transition()
    //     .duration(1000)
    //     .call(d3.axisBottom(that.x))

    //   that.svg.selectAll('.label')
    //     .attr('fill', 'black')
    //     .attr('font-size', '2rem')

    //   // Update chart
    //   that.svg.selectAll('circle')
    //     .data(that.data)
    //     .transition()
    //     .duration(1000)
    //     .attr('cx', function (d) { return that.x(d.rank) })
    //     .attr('cy', function (d) { return that.y(d.rate) })
    // },
  }
}
</script>
