<template>
  <q-page class="flex flex-center">
    <!-- <q-virtual-scroll
      style="max-height: 90vh"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="listSuicidi"
      separator>
      <template v-slot="{ item, index }">
        <q-item :key="index" v-if="item.country === 'Albania'">
          <q-item-section>
            <q-item-label>{{ item.country }}</q-item-label>
            <q-item-label>{{ item.year }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll> -->

    <svg id="map" width="1200" height="600"></svg>
  </q-page>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Index',
  data () {
    return {
      listSuicidi: []
    }
  },
  async beforeMount () {
    // await d3.json('/statics/suicide/suicides.json')
    //   .then(res => {
    //     this.setSuicidi(res)
    //   })
    //   .catch(error => {
    //     console.log('csv error:', error)
    //   })
    // this.listSuicidi = this.suicidi
    // Object.freeze(this.listSuicidi)
    await this.start()
    this.init()
  },
  mounted () {
    // The svg
    var svg = d3.select('svg'),
      width = +svg.attr('width'),
      height = +svg.attr('height')

    // Map and projection
    var path = d3.geoPath()
    var projection = d3.geoNaturalEarth1()
      .scale(width / 1.3 / Math.PI)
      .center([0, 20])
      .translate([width / 2, height / 2])

    // Data and color scale
    var data = d3.map()
    var colorScale = d3.scaleThreshold()
      .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
      .range(d3.schemeBlues[7])

    // Load external data and boot
    var p1 = d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
    var p2 = d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv')

    Promise.all([p1, p2])
      .then(d => {
        d[1].forEach(function (row) {
          data.set(row.code, +row.pop)
        })

        const mouseOver = function (d) {
          d3.selectAll('.Country')
            .transition()
            .duration(200)
            .style('opacity', 0.5)
          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 1)
            .style('stroke', 'black')
        }

        const mouseLeave = function (d) {
          d3.selectAll('.Country')
            .transition()
            .duration(200)
            .style('opacity', 0.8)
          d3.select(this)
            .transition()
            .duration(200)
            .style('stroke', 'transparent')
        }

        // Draw the map
        svg.append('g')
          .selectAll('path')
          .data(d[0].features)
          .enter()
          .append('path')
          // draw each country
          .attr('d', path
            .projection(projection)
          )
          // set the color of each country
          .attr('fill', function (d) {
            d.total = data.get(d.id) || 0
            return colorScale(d.total)
          })
          .style('stroke', 'transparent')
          .attr('class', function (d) { return 'Country' })
          .style('opacity', 0.8)
          .on('mouseover', mouseOver)
          .on('mouseleave', mouseLeave)
      })
  },
  computed: {
    ...mapGetters({
      suicidi: 'suicidi/getSuicidi'
    })
  },
  methods: {
    ...mapMutations({
      setSuicidi: 'suicidi/setSuicidi'
    }),
    ...mapActions({
      start: 'db/start',
      setSuicidi: 'suicidi/setSuicidi',
      init: 'suicidi/init'
    })
  }
}
</script>

<style lang="sass" scoped>
svg
  border: 1px solid black
</style>
