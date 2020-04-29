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
    <main>
      <div>
        <q-slider v-if="!visible" v-model="fieldYear" :min="1986" :max="2016"/>
        <div id="map"></div>
        <q-inner-loading :showing="visible">
          <q-spinner-ball color="primary" size="10em"/>
        </q-inner-loading>
      </div>
    </main>
  </q-page>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Index',
  data () {
    return {
      listSuicidi: [],
      visible: false,
      fieldYear: 1986,
      width: 1400,
      height: 800,
      svg: null,
      path: null,
      projection: null,
      colorScale: null
    }
  },
  async beforeMount () {
    this.visible = true
    var p1 = await this.start()
    var p2 = await this.init()
    Promise.all([p1, p2])
      .then(async values => {
        await this.getSuicidiFromDb(1986)
          .then(response => {
            this.mappa()
          })
      })
  },
  mounted () {
  },
  watch: {
    fieldYear: async function () {
      await this.getSuicidiFromDb(this.fieldYear)
        .then(response => {
          this.updateMap()
        })
    }
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
      var that = this
      // The svg
      that.svg = d3.select('#map')
        .append('svg')
        .attr('width', that.width)
        .attr('height', that.height)

      // Map and projection
      that.path = d3.geoPath()
      that.projection = d3.geoNaturalEarth1()
        .scale(that.width / 1.5 / Math.PI)
        .center([5, 0])
        .translate([that.width / 2, that.height / 2])

      // Data and color scale
      var data = d3.map()
      that.colorScale = d3.scaleThreshold()
        .domain([5, 10, 15])
        .range(d3.schemeReds[7])
      // Tooltip
      var tooltip = d3.select('#map')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
      // Legend
      var keys = ['< 5.0', '5.0 - 9.9', '10.0 - 14.9', '≥ 15.0']
      var color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeReds[7])

      await d3.json('/statics/suicide/world.json')
        .then(world => {
          for (var key in that.suicidi) {
            data.set(key, that.suicidi[key])
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
              .style('opacity', 0.8)
              .style('stroke', 'transparent')
            tooltip.transition()
              .duration(500)
              .style('opacity', 0)
          }

          const mouseMove = function (d) {
            tooltip.transition()
              .duration(200)
              .style('opacity', 1)
            tooltip.html(d.properties.name + '<br>' + (d.total === 0 ? 'No data' : d.total))
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY - 30) + 'px')
          }

          // Draw the map
          that.svg.append('g')
            .selectAll('path')
            .data(world.features)
            .enter()
            .append('path')
            // draw each country
            .attr('d', that.path
              .projection(that.projection)
            )
            // set the color of each country
            .attr('fill', function (d) {
              d.total = data.get(d.properties.name) || 0
              if (d.total === 0) {
                return 'gray'
              }
              return that.colorScale(d.total)
            })
            .style('stroke', 'transparent')
            .attr('class', function (d) { return 'Country' })
            .style('opacity', 0.8)
            .on('mouseover', mouseOver)
            .on('mouseout', mouseLeave)
            .on('mousemove', mouseMove)
          // Draw the legend
          var size = 20
          that.svg.selectAll('mydots')
            .data(keys)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', function (d, i) { return 600 + i * (size + 5) })
            .attr('width', size)
            .attr('height', size)
            .style('fill', function (d) { return color(d) })
          that.svg.selectAll('mylabels')
            .data(keys)
            .enter()
            .append('text')
            .attr('x', 0 + size * 1.2)
            .attr('y', function (d, i) { return 600 + i * (size + 5) + (size / 2) })
            .style('fill', 'black')
            .text(function (d) { return d })
            .attr('text-anchor', 'left')
            .style('alignment-baseline', 'middle')
        })

      this.visible = false
    },
    updateMap () {
      var that = this

      var data = d3.map()
      for (var key in that.suicidi) {
        data.set(key, that.suicidi[key])
      }

      that.svg.selectAll('path')
        .attr('fill', function (d) {
          d.total = data.get(d.properties.name) || 0
          if (d.total === 0) {
            return 'gray'
          }
          return that.colorScale(d.total)
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
  pointer-events: none
</style>
