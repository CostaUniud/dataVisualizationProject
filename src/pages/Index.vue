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

    <svg id="map" width="1400" height="800"></svg>
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
        .domain([1, 10, 100, 300, 1000, 5000])
        .range(d3.schemeReds[7])

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
          // const mouseOver = function (d) {
          //   d3.selectAll('.Country')
          //     .transition()
          //     .duration(200)
          //     .style('opacity', 0.5)
          //   d3.select(this)
          //     .transition()
          //     .duration(200)
          //     .style('opacity', 1)
          //     .style('stroke', 'black')
          // }

          // const mouseLeave = function (d) {
          //   d3.selectAll('.Country')
          //     .transition()
          //     .duration(200)
          //     .style('opacity', 0.8)
          //   d3.select(this)
          //     .transition()
          //     .duration(200)
          //     .style('stroke', 'transparent')
          // }

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
              // console.log(d.properties.name)
              d.total = data.get(d.properties.name) || 0
              return colorScale(d.total)
            })
            .style('stroke', 'transparent')
            .attr('class', function (d) { return 'Country' })
            .style('opacity', 0.8)
            // .on('mouseover', mouseOver)
            // .on('mouseleave', mouseLeave)
        })
    }
  }
}
</script>

<style lang="sass" scoped>
svg
  border: 1px solid black
</style>
