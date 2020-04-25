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

    <!-- <svg id="map" width="1400" height="800"></svg> -->
    <div id="map"></div>
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
    var p1 = await this.start()
    var p2 = await this.init()
    Promise.all([p1, p2])
      .then(async values => {
        await this.getSuicidiFromDb(2000)
          .then(response => {
            this.mappa()
          })
      })
  },
  mounted () {
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
      init: 'suicidi/init',
      getSuicidiFromDb: 'suicidi/getSuicidiFromDb'
    }),
    async mappa () {
      var width = 1400
      var height = 800

      // The svg
      var svg = d3.select('#map')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      // Map and projection
      var path = d3.geoPath()
      var projection = d3.geoNaturalEarth1()
        .scale(width / 1.5 / Math.PI)
        .center([5, 0])
        .translate([width / 2, height / 2])

      // Data and color scale
      var data = d3.map()
      var colorScale = d3.scaleThreshold()
        .domain([1, 10, 100, 300, 1000, 5000])
        .range(d3.schemeReds[7])

      var tooltip = d3.select('#map')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

      await d3.json('/statics/suicide/world.json')
        .then(world => {
          for (var key in this.suicidi) {
            // for (var k in world.features) {
            //   const country = world.features[k].properties.name
            //   if (key === country) {
            //     console.log(key + ' cè')
            //     break
            //   } else {
            //     console.log('Paese al momento non cè', key)
            //   }
            // }
            data.set(key, +this.suicidi[key])
          }

          const mouseOver = function (d) {
            d3.selectAll('.Country')
              .transition()
              .duration(200)
              .style('opacity', 0.5)
              .style('stroke', 'transparent')
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
              .style('stroke', 'transparent')
            d3.select(this)
              .transition()
              .duration(200)
              .style('stroke', 'transparent')
            tooltip.transition()
              .duration(500)
              .style('opacity', 0)
          }

          const mouseMove = function (d) {
            tooltip.transition()
              .duration(200)
              .style('opacity', 0.9)
            tooltip.html(d.properties.name)
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY - 30) + 'px')
          }

          // Draw the map
          svg.append('g')
            .selectAll('path')
            .data(world.features)
            .enter()
            .append('path')
            // draw each country
            .attr('d', path
              .projection(projection)
            )
            // set the color of each country
            .attr('fill', function (d) {
              d.total = data.get(d.properties.name) || 0
              return colorScale(d.total)
            })
            .style('stroke', 'transparent')
            .attr('class', function (d) { return 'Country' })
            .style('opacity', 0.8)
            .on('mouseover', mouseOver)
            .on('mouseout', mouseLeave)
            .on('mousemove', mouseMove)
        })
    }
  }
}
</script>

<style lang="sass">
.tooltip
  display: block-inline
  position: absolute
  text-align: center
  padding: 7px
  font: 12px sans-serif
  background: #fff
  border: 0px
  pointer-events: none
</style>
