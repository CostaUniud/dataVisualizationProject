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
      // Set the dimensions and margins of the graph
      var margin = { top: 30, right: 30, bottom: 70, left: 100 }
      that.width = 860 - margin.left - margin.right
      that.height = 800 - margin.top - margin.bottom

      // Append the svg object to the body of the page
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

      // Another scale for subgroup position
      that.xSubgroup = d3.scaleBand()
        .padding([0.05])

      // Color palette = one color per subgroup
      that.color = d3.scaleOrdinal()
        .range(['#e41a1c', '#377eb8'])

      that.svg
        .append('text')
        .attr('class', 'label')
        .attr('dx', that.width / 2)
        .attr('dy', '75rem')
        .attr('x', 6)
        .style('text-anchor', 'end')
        .text('Age')
        .attr('fill', 'black')
        .attr('font-size', '2rem')

      that.svg
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('dx', -(that.height / 2))
        .attr('dy', '-8rem')
        .attr('y', 6)
        .style('text-anchor', 'end')
        .text('Suicides')
        .attr('fill', 'black')
        .attr('font-size', '2rem')

      // Legend
      var legend = that.svg
        .selectAll('.legend')
        .data(['Female', 'Male'])
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')')

      legend
        .append('rect')
        .attr('x', that.width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', that.color)

      legend
        .append('text')
        .attr('x', that.width - 24)
        .attr('y', 3.5)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(d => d)

      that.updateBar()
    },
    updateBar () {
      var that = this
      that.data = that.sexAge

      var subgroups = ['male', 'female']
      var groups = ['5-14', '15-24', '25-34', '35-54', '55-74', '75+'] // d3.map(that.data, d => d.age).keys()

      // X axis
      that.x
        .domain(groups)
      that.xAxis
        .transition()
        .duration(750)
        .call(d3.axisBottom(that.x).tickSize(0))
        .selectAll('text')
        .attr('font-size', '1.2rem')

      // Add Y axis
      that.y
        // .domain([0, d3.max(that.data, d => return d.suic)])
        .domain([0, 100000])
      that.yAxis
        // .transition()
        // .duration(500)
        .call(d3.axisLeft(that.y))
        .selectAll('text')
        .attr('font-size', '1.2rem')

      // Another scale for subgroup position
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
        .attr('transform', d => 'translate(' + that.x(d.age) + ',0)')
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
        .attr('x', d => that.xSubgroup(d.key))
        .attr('fill', d => that.color(d.key))
        .transition()
        .duration(750)
        .attr('y', d => that.y(d.value))
        .attr('height', d => that.height - that.y(d.value))
      bars
        .transition()
        .duration(750)
        .attr('y', d => that.y(d.value))
        .attr('height', d => that.height - that.y(d.value))
      bars.exit().remove()
    }
  }
}
</script>
