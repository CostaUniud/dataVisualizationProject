<template>
  <section class="map-area">
    <div class="row">
      <div class="col-2">
        <div class="map-area__description">
          <p class="map-area__description-year">{{ fieldYear }}</p>
          <q-table
            ref="myTable"
            class="map-area__description-table"
            :data="dataTable"
            :columns="columns"
            row-key="country"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
            flat
          >
            <template v-slot:header-cell="props">
              <q-th :props="props">
                <b class="text-weight-bold text-h5">{{ props.col.label }}</b>
              </q-th>
            </template>
          </q-table>
        </div>
      </div>
      <div class="col-9">
        <div id="map"></div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Map',
  props: {
    fieldYear: Number
  },
  data () {
    return {
      width: 1400,
      height: 800,
      svg: null,
      path: null,
      projection: null,
      colorScale: null,
      columns: [
        { name: 'country', align: 'left', label: 'Country', field: 'country', sortable: true },
        { name: 'rate', label: 'Rate (suicides/100k)', field: 'rate', sortable: true }
      ],
      dataTable: [],
      pagination: {
        page: 1,
        rowsPerPage: 7
      }
    }
  },
  watch: {
    dbUpdate: async function () {
      await this.mappa()
    },
    fieldYear: async function () {
      await this.getSuicidiFromDb(this.fieldYear)
        .then(response => {
          this.updateMap()
        })
    }
  },
  computed: {
    ...mapGetters({
      suicidi: 'suicidi/getSuicidi',
      dbUpdate: 'db/getDbUpdate'
    })
  },
  methods: {
    ...mapActions({
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
        .domain([0, 5, 10, 15])
        .range(d3.schemeReds[7])
      // Tooltip
      var tooltip = d3.select('#map')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
      // Legend
      var keys = ['No data', '< 5', '5 - 9', '10 - 14', '≥ 15']
      var color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeReds[7])

      await d3.json('/statics/suicide/world.json')
        .then(world => {
          for (var key in that.suicidi) {
            if (!isNaN(that.suicidi[key])) {
              that.dataTable.push({
                country: key,
                rate: that.suicidi[key]
              })
            }
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
            tooltip
              .transition()
              .duration(200)
              .style('opacity', 1)
            tooltip
              .html('<span>' + d.properties.name + '</span><br><span>' + (isNaN(d.total) ? 'No data' : d.total) + '</span>')
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY - 70) + 'px')
          }

          // Draw the map
          that.svg
            .append('g')
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
              d.total = data.get(d.properties.name)
              if (isNaN(d.total)) {
                return '#B8B8B9'
              }
              return that.colorScale(d.total)
            })
            .style('stroke', 'transparent')
            .attr('class', d => 'Country')
            .style('opacity', 0.8)
            .on('mouseover', mouseOver)
            .on('mouseout', mouseLeave)
            .on('mousemove', mouseMove)
          // Draw the legend
          var size = 20
          that.svg
            .selectAll('mydots')
            .data(keys)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', (d, i) => 600 + i * (size + 5))
            .attr('width', size)
            .attr('height', size)
            .style('fill', function (d) {
              if (d === 'No data') {
                return '#B8B8B9'
              }
              return color(d)
            })
          that.svg.selectAll('mylabels')
            .data(keys)
            .enter()
            .append('text')
            .attr('x', 0 + size * 1.2)
            .attr('y', (d, i) => 600 + i * (size + 5) + (size / 2))
            .style('fill', 'black')
            .text(d => d)
            .attr('text-anchor', 'left')
            .style('alignment-baseline', 'middle')
        })
    },
    updateMap () {
      var that = this
      var data = d3.map()
      that.dataTable = []

      for (var key in that.suicidi) {
        if (!isNaN(that.suicidi[key])) {
          that.dataTable.push({
            country: key,
            rate: that.suicidi[key]
          })
        }
        data.set(key, that.suicidi[key])
      }

      that.svg.selectAll('path')
        .attr('fill', function (d) {
          d.total = data.get(d.properties.name)
          if (isNaN(d.total)) {
            return '#B8B8B9'
          }
          return that.colorScale(d.total)
        })

      this.$refs.myTable.pagination.page = 1
    }
  }
}
</script>
