<template>
  <q-page class="flex">
    <Map :fieldYear="fieldYear"/>
    <aside ref="aside">
      <q-scroll-observer @scroll="scrollHandler"/>
      <div class="range-field" v-if="position < 1500"> <!-- v-if="!visible" -->
        <p class="range-field__label">1986</p>
        <q-slider v-model="fieldYear" color="negative" :min="1986" :max="2016" vertical label />
        <p class="range-field__label">2016</p>
      </div>
      <div class="range-field" v-else>
        <q-select v-model="fieldCountry" :options="options" label="Country"/>
      </div>
    </aside>
    <section class="flex pie-area justify-center content-center">
      <div class="row">
        <div class="flex col-1 justify-center content-center offset-md-2">
          <p>{{ formatMoney(tot) }}</p>
        </div>
        <div class="col-1 offset-md-1">
          <PieSex :fieldYear="fieldYear"/>
        </div>
        <div class="col-1 offset-md-4">
          <PieAge :fieldYear="fieldYear"/>
        </div>
      </div>
    </section>
    <section class="flex line-area justify-center content-center">
      <div class="row">
        <LineChart :fieldCountry="fieldCountry"/>
      </div>
    </section>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatMoney } from '@/utils/bt.js'
import Map from '@/components/Map.vue'
import PieSex from '@/components/Sex.vue'
import PieAge from '@/components/Age.vue'
import LineChart from '@/components/LineChart.vue'
import { scroll } from 'quasar'
const { getScrollTarget, getScrollPosition } = scroll // setScrollPosition

export default {
  name: 'Index',
  data () {
    return {
      fieldYear: 1986,
      model: null,
      options: [
        'Albania', 'Italy'
      ],
      position: 0,
      fieldCountry: 'Albania'
    }
  },
  components: {
    Map,
    PieSex,
    PieAge,
    LineChart
  },
  async mounted () {
    var that = this

    setTimeout(async function () {
      await that.getTotSuicFromDb(1986)
    }, 1000)
  },
  watch: {
    fieldYear: async function () {
      await this.getTotSuicFromDb(this.fieldYear)
    }
  },
  computed: {
    ...mapGetters({
      tot: 'suicidi/getTot'
    })
  },
  methods: {
    ...mapActions({
      getTotSuicFromDb: 'suicidi/getTotSuicFromDb'
    }),
    formatMoney,
    scrollHandler () {
      // console.log(getScrollPosition(getScrollTarget(this.$refs.aside)))
      this.position = getScrollPosition(getScrollTarget(this.$refs.aside))
    }
  }
}
</script>
