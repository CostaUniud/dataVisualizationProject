<template>
  <div id="scatter"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Scatter',
  data () {
    return {
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
    }
  },
  computed: {
    ...mapGetters({
      happy: 'happyness/getHappy',
      country: 'suicidi/getCountry',
      getHappySuic: 'happyness/getHappySuic'
    })
  },
  methods: {
    ...mapActions({
      init: 'happyness/init',
      getCountryHappyFromDb: 'happyness/getCountryHappyFromDb',
      getHappySuicFromDb: 'happyness/getHappySuicFromDb'
    }),
    async scatter () {
      var that = this
      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 30, bottom: 30, left: 60 }
      var width = 860 - margin.left - margin.right
      var height = 800 - margin.top - margin.bottom

      // append the svg object to the body of the page
      var svg = d3.select('#scatter')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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
          var data = that.getHappySuic
          // Add X axis
          var x = d3.scaleLinear()
            .domain([160, 1])
            .range([0, width])
          var xAxis = svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x))

          // Add Y axis
          var y = d3.scaleLinear()
            .domain([0, 160])
            .range([height, 0])
          svg.append('g')
            .call(d3.axisLeft(y))

          // Add dots
          svg.append('g')
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) { return x(d.rank) })
            .attr('cy', function (d) { return y(d.rate) })
            .attr('r', 5)
            .style('fill', '#69b3a2')

          // A function that update the plot for a given xlim value
          function updatePlot () {
            // Get the value of the button
            // xlim = this.value

            // Update X axis
            // x.domain([3, xlim])
            xAxis.transition().duration(1000).call(d3.axisBottom(x))

            // Update chart
            svg.selectAll('circle')
              .data(data)
              .transition()
              .duration(1000)
              .attr('cx', function (d) { return x(d.rank) })
              .attr('cy', function (d) { return y(d.rate) })
          }

          // Add an event listener to the button created in the html part
          d3.select('#buttonXlim').on('input', updatePlot)
        })
    }
  }
}
</script>
