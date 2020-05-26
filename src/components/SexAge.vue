<template>
  <div id="sex-age"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'SexAge',
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
      tooltip: null,
      xSubgroup: null,
      color: null
    }
  },
  watch: {
    fieldYear: async function () {
      await this.getSexAgeFromDb(this.fieldYear)
        .then(response => {
          this.updateBar()
        })
    },
    dbUpdate: async function () {
      this.bar()
    }
  },
  computed: {
    ...mapGetters({
      sexAge: 'suicidi/getSexAge',
      dbUpdate: 'db/getDbUpdate'
    })
  },
  methods: {
    ...mapActions({
      getSexAgeFromDb: 'suicidi/getSexAgeFromDb'
    }),
    bar () {
      var that = this
      // set the dimensions and margins of the graph
      var margin = { top: 30, right: 30, bottom: 70, left: 60 }
      that.width = 860 - margin.left - margin.right
      that.height = 800 - margin.top - margin.bottom

      // append the svg object to the body of the page
      that.svg = d3.select('#sex-age')
        .append('svg')
        .attr('width', that.width + margin.left + margin.right)
        .attr('height', that.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Initialize the X axis
      that.x = d3.scaleBand()
        .range([0, that.width])
        .padding(0.2)
      that.xAxis = that.svg
        .append('g')
        .attr('transform', 'translate(0,' + that.height + ')')

      // Initialize the Y axis
      that.y = d3.scaleLinear()
        .range([that.height, 0])
      that.yAxis = that.svg
        .append('g')
        .attr('class', 'myYaxis')

      // Another scale for subgroup position?
      that.xSubgroup = d3.scaleBand()
        .padding([0.05])

      // color palette = one color per subgroup
      that.color = d3.scaleOrdinal()
        .range(['#e41a1c', '#377eb8'])

      that.updateBar()
    },
    updateBar () {
      var that = this
      that.data = that.sexAge

      var subgroups = ['male', 'female']
      var groups = d3.map(that.data, function (d) { return d.age }).keys()

      // X axis
      that.x
        .domain(groups)
      that.xAxis
        .transition()
        .duration(750)
        .call(d3.axisBottom(that.x).tickSize(0))

      // Add Y axis
      that.y
        // .domain([0, d3.max(that.data, function (d) { return d.suic })])
        .domain([0, 100000])
      that.yAxis
        // .transition()
        // .duration(500)
        .call(d3.axisLeft(that.y))

      // Another scale for subgroup position?
      that.xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, that.x.bandwidth()])

      // Map data to existing bars
      var barGroups = that.svg
        .selectAll('g.layer')
        .data(that.data)
      barGroups
        .enter()
        .append('g')
        .classed('layer', true)
        .attr('transform', function (d) { return 'translate(' + that.x(d.age) + ',0)' })
      barGroups.exit().remove()

      var bars = that.svg
        .selectAll('g.layer')
        .selectAll('rect')
        .data(function (d) {
          return subgroups.map(function (key) {
            return { key: d.sex, value: d.suic }
          })
        })
      bars
        .enter()
        .append('rect')
        .attr('width', that.xSubgroup.bandwidth())
        .attr('x', function (d) { return that.xSubgroup(d.key) })
        .attr('fill', function (d) { return that.color(d.key) })
        .transition()
        .duration(750)
        .attr('y', function (d) { return that.y(d.value) })
        .attr('height', function (d) { return that.height - that.y(d.value) })
      bars
        .transition()
        .duration(750)
        .attr('y', function (d) { return that.y(d.value) })
        .attr('height', function (d) { return that.height - that.y(d.value) })
      bars.exit().remove()
    }
  }
}
</script>
