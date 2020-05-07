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
      radius: null
    }
  },
  async mounted () {
    var that = this
    setTimeout(async function () {
      await that.getSexFromDb(1986)
        .then(response => {
          that.pie()
        })
    }, 1000)
  },
  watch: {
    fieldYear: async function () {
      await this.getSexFromDb(this.fieldYear)
        .then(response => {
          this.pieUpdate()
        })
    }
  },
  computed: {
    ...mapGetters({
      sex: 'suicidi/getSex'
    })
  },
  methods: {
    ...mapActions({
      getSexFromDb: 'suicidi/getSexFromDb'
    }),
    pie () {
      // set the dimensions and margins of the graph
      var width = 450
      var height = 450
      var margin = 40

      // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
      this.radius = Math.min(width, height) / 2 - margin

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
