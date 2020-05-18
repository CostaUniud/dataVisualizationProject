<template>
  <q-page class="flex">
    <Map :fieldYear="fieldYear"/>
    <aside ref="aside">
      <q-scroll-observer @scroll="scrollHandler"/>
      <div class="range-field" v-if="position < 1500">
        <p class="range-field__label">1986</p>
        <q-slider v-model="fieldYear" color="negative" :min="1986" :max="2016" vertical label />
        <p class="range-field__label">2016</p>
      </div>
      <div class="country-field" v-if="position >= 1500 && position < 2800">
        <q-select v-model="fieldCountry" :options="country" label="Country"/>
      </div>
      <div class="country-field" v-if="position >= 2800 && position < 3700">
        <q-input v-model.number="fieldNumber" type="number" filled style="max-width: 200px" :rules="[ val => val > 0 && val <= 20 || 'Please use values from 1 to 20']"/>
      </div>
    </aside>
    <section class="flex pie-area justify-center content-center">
      <h2 class="heading-secondary">Total world suicides per year</h2>
      <div class="row">
        <div class="flex col-1 justify-center content-center" style="width: 10rem;">
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
    <section class="line-area">
      <h2 class="heading-secondary">Trend suicides per country</h2>
      <div class="row">
        <div class="col-1 offset-md-3">
          <LineChart :fieldCountry="fieldCountry"/>
        </div>
      </div>
    </section>
    <section class="scatter-area">
      <h2 class="heading-secondary">Relation suicides/happiness in countries</h2>
      <div class="row scatter">
        <div class="col-1 offset-md-3">
          <Scatter :fieldNumber="fieldNumber"/>
        </div>
      </div>
    </section>
    <q-separator inset color="gray" style="height: 1px; margin: 0 20rem"/>
    <section class="methodology">
      <h3 class="heading-tertiary">Methodology</h3>
      <Methodology />
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
import Scatter from '@/components/Scatter.vue'
import Methodology from '@/components/Methodology.vue'
import { scroll } from 'quasar'
const { getScrollTarget, getScrollPosition } = scroll

export default {
  name: 'Index',
  data () {
    return {
      fieldYear: 1986,
      model: null,
      options: [
        'Albania'
      ],
      position: 0,
      fieldCountry: 'Albania',
      fieldNumber: 16
    }
  },
  components: {
    Map,
    PieSex,
    PieAge,
    LineChart,
    Scatter,
    Methodology
  },
  watch: {
    fieldYear: async function () {
      await this.getTotSuicFromDb(this.fieldYear)
    }
  },
  computed: {
    ...mapGetters({
      tot: 'suicidi/getTot',
      country: 'suicidi/getCountry'
    })
  },
  methods: {
    ...mapActions({
      getTotSuicFromDb: 'suicidi/getTotSuicFromDb',
      getCountryFromDb: 'suicidi/getCountryFromDb'
    }),
    formatMoney,
    scrollHandler () {
      this.position = getScrollPosition(getScrollTarget(this.$refs.aside))
    }
  }
}
</script>
