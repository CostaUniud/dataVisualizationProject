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
import { mapGetters } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'PageIndex',
  data () {
    return {
      data: []
    }
  },
  mounted () {
    var that = this

    // brutto... è da fare con una promise probabilmente
    setTimeout(function () {
      for (let index = 0; index < that.arresti.length; index++) {
        const dataElement = that.arresti[index].age
        that.data.push(dataElement)
      }

      that.$refs.myDiv.append(that.createBarChart())
    }, 1000)
  },
  computed: {
    ...mapGetters({
      arresti: 'arresti/getArresti'
    })
  },
  methods: {
    createBarChart () {
      // Create an empty (detached) chart container.
      const div = d3.create('div')

      // Apply some styles to the chart container.
      div.style('font', '10px sans-serif')
      div.style('text-align', 'right')
      div.style('color', 'white')

      // Define the initial (empty) selection for the bars.
      const bar = div.selectAll('div')

      // Bind this selection to the data (computing enter, update and exit).
      const barUpdate = bar.data(this.data)

      // Join the selection and the data, appending the entering bars.
      const barNew = barUpdate.join('div')

      // Apply some styles to the bars.
      barNew.style('background', 'steelblue')
      barNew.style('padding', '3px')
      barNew.style('margin', '1px')

      // Set the width as a function of data.
      barNew.style('width', d => `${d * 10}px`)

      // Set the text of each bar as the data.
      barNew.text(d => d)

      // Return the chart container.
      return div.node()
    }
  }
}
</script>
