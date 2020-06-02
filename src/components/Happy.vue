<template>
  <div id="lollipop"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Happy',
  props: {
    fieldOrder: String
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
      array: null,
      order: null
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
    },
    fieldOrder: async function () {
      var that = this
      await that.getHappySuicFromDb(that.fieldOrder)
        .then(() => {
          that.updateLolli()
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
      that.tooltip = d3.select('#lollipop')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

      // Get the data
      await this.getHappySuicFromDb('Rank Happiness')
        .then(response => {
          // X axis
          that.x = d3.scaleBand()
            .range([0, that.width])
            .paddingInner(5)
            .paddingOuter(1)
          that.xAxis = that.svg
            .append('g')
            .attr('transform', 'translate(0,' + that.height + ')')

          that.svg
            .append('text')
            .attr('class', 'label-happy')
            .attr('dx', that.width / 2)
            .attr('dy', '75rem')
            .attr('x', 6)
            .style('text-anchor', 'end')
            .text('Happiness')
            .attr('fill', 'black')
            .attr('font-size', '2rem')

          // Add Y axis
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
        })

      that.updateLolli()
    },
    updateLolli () {
      var that = this

      switch (that.fieldOrder) {
        case 'Rank Happiness':
          that.order = 'rank'
          break
        case 'Suicides Rate':
          that.order = 'rate'
          break
        case 'Alphabetical':
          that.order = 'country'
          break
        default:
          that.order = 'rank'
          break
      }

      that.data = that.happySuic
      var a = that.data.map(d => d.country)

      that.x
        .domain(that.data.map(d => d[that.order]))
      that.xAxis
        .transition()
        .duration(1000)
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

      if (that.order === 'country') {
        that.svg
          .selectAll('.label-happy')
          .transition()
          .duration(500)
          .text('Country')
      } else {
        that.svg
          .selectAll('.label-happy')
          .transition()
          .duration(500)
          .text('Happiness')
      }

      // Add Y axis
      that.y
        .domain([0, 60])
      that.yAxis
        .call(d3.axisLeft(that.y))

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
          .html('<div>' + d.country + '</div><span>Rank: ' + d.rank + '</span><br><span>Rate: ' + d.rate + '</span>')
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px')
      }

      // Lines
      var lines = that.svg
        .selectAll('.myLine')
        .data(that.data)
      lines.exit().remove()
      lines
        .enter()
        .append('line')
        .attr('class', 'myLine')
        .merge(lines)
        .transition()
        .duration(500)
        .attr('x1', d => that.x(d[that.order]))
        .attr('x2', d => that.x(d[that.order]))
        .attr('y1', d => that.y(d.rate))
        .attr('y2', that.y(0))
        .attr('stroke', 'grey')
      // Circles
      var circles = that.svg
        .selectAll('circle')
        .data(that.data)
      circles.exit().remove()
      circles
        .enter()
        .append('circle')
        .on('mouseleave', mouseLeave)
        .on('mousemove', mouseMove)
        .merge(circles)
        .transition()
        .duration(500)
        .attr('cx', d => that.x(d[that.order]))
        .attr('cy', d => that.y(d.rate))
        .attr('r', '4')
        .style('fill', '#69b3a2')
        .attr('stroke', 'black')
    }
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
  }
}
</script>
