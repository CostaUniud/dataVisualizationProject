<template>
  <div id="scatter"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Scatter',
  props: {
    fieldNumber: Number
  },
  data () {
    return {
      width: null,
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
          await that.scatter()
        })
    },
    fieldNumber: function () {
      if (this.fieldNumber > 0 && this.fieldNumber <= 20) {
        this.updatePlot()
      }
    }
  },
  computed: {
    ...mapGetters({
      happy: 'happiness/getHappy',
      country: 'suicidi/getCountry',
      getHappySuic: 'happiness/getHappySuic'
    })
  },
  methods: {
    ...mapActions({
      init: 'happiness/init',
      getCountryHappyFromDb: 'happiness/getCountryHappyFromDb',
      getHappySuicFromDb: 'happiness/getHappySuicFromDb'
    }),
    async scatter () {
      var that = this
      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 30, bottom: 30, left: 60 }
      that.width = 860 - margin.left - margin.right
      var height = 800 - margin.top - margin.bottom

      // append the svg object to the body of the page
      that.svg = d3.select('#scatter')
        .append('svg')
        .attr('width', that.width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').text('Year')
        .attr('fill', 'black')

      // Tooltip
      var tooltip = d3.select('#scatter')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

      // Read the data
      await this.getHappySuicFromDb()
        .then(response => {
          // for (var i = 0; i < that.happy.length; i++) {
          //   for (var j = 0; j < that.country.length; j++) {
          //     // console.log(i + '.' + j + ' ' + that.country[j] + ' ' + happy[i].Country)
          //     if (that.country[j] !== that.happy[i].country) {
          //       console.log('NON trovato ' + that.happy[i].country)
          //     } else {
          //       break
          //     }
          //   }
          // }
          // })
          that.data = that.getHappySuic
          // Add X axis
          that.x = d3.scaleLinear()
            .domain([0, 160])
            .range([0, that.width])
          that.xAxis = that.svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(that.x))
            .append('text')
            .attr('dx', that.width)
            .attr('dy', '-.75em')
            .attr('x', 6)
            .style('text-anchor', 'end')
            .text('Rank happiness')
            .attr('fill', 'black')

          // Add Y axis
          that.y = d3.scaleLinear()
            .domain([0, 160])
            .range([height, 0])
          that.svg.append('g')
            .call(d3.axisLeft(that.y))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '.75em')
            .attr('y', 6)
            .style('text-anchor', 'end')
            .text('Suicides rate')
            .attr('fill', 'black')

          const mouseLeave = function (d) {
            tooltip.transition()
              .duration(500)
              .style('opacity', 0)
          }

          const mouseMove = function (d) {
            tooltip.transition()
              .duration(200)
              .style('opacity', 1)
            tooltip.html('<div>' + d.country + '</div><span>' + 'Rank: ' + d.rank + '</span><br><span>' + 'Rate: ' + d.rate + '</span>')
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY - 30) + 'px')
          }

          // Add dots
          that.svg.append('g')
            .selectAll('dot')
            .data(that.data)
            .enter()
            .append('circle')
            .attr('cx', function (d) { return that.x(d.rank) })
            .attr('cy', function (d) { return that.y(d.rate) })
            .attr('r', 5)
            .style('fill', '#69b3a2')
            .on('mouseleave', mouseLeave)
            .on('mousemove', mouseMove)
        })
    },
    updatePlot () {
      var that = this

      // Update X axis
      that.x
        .domain([0, that.fieldNumber * 10])
      that.xAxis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(that.x))

      // Update chart
      that.svg.selectAll('circle')
        .data(that.data)
        .transition()
        .duration(1000)
        .attr('cx', function (d) { return that.x(d.rank) })
        .attr('cy', function (d) { return that.y(d.rate) })
    }
  }
}
</script>
