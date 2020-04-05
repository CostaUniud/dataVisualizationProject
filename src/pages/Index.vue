<template>
  <q-page class="flex flex-center">
    <!-- <q-virtual-scroll :items="arresti" separator>
      <template v-slot="{ item, index }">
        <q-item :key="index" clickable>
          <q-item-section>
            <q-item-label>
              {{ item.arresteename }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll> -->
    <div ref="myDiv"></div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'PageIndex',
  data () {
    return {
      data: []
    }
  },
  async mounted () {
    // var that = this
    this.initDataLeague()
    // await d3.csv('/statics/marriage/both_sexes.csv')
    //   .then(res => {
    //     console.log(res[0])
    //   })
    //   .catch(error => {
    //     console.log('csv error:', error)
    //   })

    // await this.initData()
    //   .then(res => {
    //     for (let index = 0; index < that.arresti.length; index++) {
    //       const dataElement = that.arresti[index].age
    //       that.data.push(dataElement)
    //     }

    //     that.$refs.myDiv.append(that.createBarChart())
    //   })
    //   .catch(error => {
    //     console.log('arresti error:', error)
    //   })
  },
  computed: {
    ...mapGetters({
      arresti: 'arresti/getArresti',
      league: 'calcio/getLeague'
    })
  },
  methods: {
    ...mapActions({
      initData: 'arresti/fetch',
      initDataLeague: 'calcio/fetch'
    }),
    createBarChart () {
      const width = 420

      // function to scale to fit
      const x = d3.scaleLinear()
        .domain([0, d3.max(this.data)])
        .range([0, width])

      const y = d3.scaleBand()
        .domain(d3.range(this.data.length))
        .range([0, 20 * this.data.length])

      const svg = d3.create('svg')
        .attr('width', width)
        .attr('height', y.range()[1])
        .attr('font-family', 'sans-serif')
        .attr('font-size', '10')
        .attr('text-anchor', 'end')

      const bar = svg.selectAll('g')
        .data(this.data)
        .join('g')
        .attr('transform', (d, i) => `translate(0, ${y(i)})`)

      console.log('x', x)
      bar.append('rect')
        .attr('fill', 'steelblue')
        .attr('width', x)
        .attr('height', y.bandwidth() - 1)

      bar.append('text')
        .attr('fill', 'white')
        .attr('x', d => x(d) - 3)
        .attr('y', y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .text(d => d)

      return svg.node()
    }
  }
}
</script>
