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
      height: null
    }
  },
  async mounted () {
    var that = this
    setTimeout(async function () {
      await that.getSuicidiCountryFromDb('Albania')
        .then(response => {
          that.line()
        })
    }, 1000)
  },
  watch: {
    fieldCountry: async function () {
      console.log('entro')
      await this.getSuicidiCountryFromDb(this.fieldCountry)
        .then(response => {
          this.lineUpdate()
        })
    }
  },
  computed: {
    ...mapGetters({
      suicidiCountry: 'suicidi/getSuicidiCountry'
    })
  },
  methods: {
    ...mapActions({
      getSuicidiCountryFromDb: 'suicidi/getSuicidiCountryFromDb'
    }),
    line () {
      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 30, bottom: 30, left: 60 }
      this.width = 1560 - margin.left - margin.right
      this.height = 800 - margin.top - margin.bottom

      // append the svg object to the body of the page
      this.svg = d3.select('#line-chart')
        .append('svg')
        .attr('width', this.width + margin.left + margin.right)
        .attr('height', this.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      var data = this.suicidiCountry

      // Add X axis
      var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.y }))
        .range([0, this.width])
      this.svg
        .append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3.axisBottom(x))

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.n })])
        .range([this.height, 0])
      this.svg.append('g')
        .call(d3.axisLeft(y))

      // Add the line
      this.svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
          .x(function (d) { return x(d.y) })
          .y(function (d) { return y(d.n) })
          // .curve(d3.curveMonotoneX) // apply smoothing to the line
        )
    },
    lineUpdate () {
      var data = this.suicidiCountry

      // Add X axis
      var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.y }))
        .range([0, this.width])
      this.svg
        .append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3.axisBottom(x))

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.n })])
        .range([this.height, 0])
      this.svg
        .append('g')
        .call(d3.axisLeft(y))

      // Add the line
      this.svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
          .x(function (d) { return x(d.y) })
          .y(function (d) { return y(d.n) })
        )
    }
  }
}
</script>
