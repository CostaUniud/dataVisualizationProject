<template>
  <div id="pie"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'PieAge',
  props: {
    fieldYear: Number
  },
  data () {
    return {
      svg: null,
      radius: null
    }
  },
  async mounted () {
    var that = this

    setTimeout(async function () {
      await that.getAgeFromDb(1986)
        .then(response => {
          that.pie()
        })
    }, 1000)
  },
  watch: {
    fieldYear: async function () {
      await this.getAgeFromDb(this.fieldYear)
        .then(response => {
          this.pieUpdate()
        })
    }
  },
  computed: {
    ...mapGetters({
      age: 'suicidi/getAge'
    })
  },
  methods: {
    ...mapActions({
      getAgeFromDb: 'suicidi/getAgeFromDb'
    }),
    pie () {
      // set the dimensions and margins of the graph
      var width = 450
      var height = 450
      var margin = 40

      // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
      this.radius = Math.min(width, height) / 2 - margin

      // append the svg object to the div called 'pie'
      this.svg = d3.select('#pie')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      // Create dummy data
      var data = { a: this.age['5-14 years'], b: this.age['15-24 years'], c: this.age['25-34 years'], d: this.age['35-54 years'], e: this.age['55-74 years'], f: this.age['75+ years'] }

      // set the color scale
      var color = d3.scaleOrdinal()
        .domain(data)
        .range(d3.schemeTableau10)

      // Compute the position of each group on the pie:
      var pie = d3.pie()
        .value(function (d) { return d.value })
      var dataReady = pie(d3.entries(data))

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      this.svg.selectAll('whatever')
        .data(dataReady)
        .enter()
        .append('path')
        .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(this.radius)
        )
        .attr('fill', function (d) { return (color(d.data.key)) })
    },
    pieUpdate () {
      // Create dummy data
      var data = { a: this.age['5-14 years'], b: this.age['15-24 years'], c: this.age['25-34 years'], d: this.age['35-54 years'], e: this.age['55-74 years'], f: this.age['75+ years'] }

      // set the color scale
      var color = d3.scaleOrdinal()
        .domain(data)
        .range(d3.schemeTableau10)

      // Compute the position of each group on the pie:
      var pie = d3.pie()
        .value(function (d) { return d.value })
      var dataReady = pie(d3.entries(data))

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      this.svg.selectAll('whatever')
        .data(dataReady)
        .enter()
        .append('path')
        .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(this.radius)
        )
        .attr('fill', function (d) { return (color(d.data.key)) })
    }
  }
}
</script>
