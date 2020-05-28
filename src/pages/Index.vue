<template>
  <q-page class="flex">
    <Map :fieldYear="fieldYear"/>
    <aside ref="aside">
      <q-scroll-observer @scroll="scrollHandler"/>
      <div class="range-field" v-if="position < 1500 || (position > 3800 && position < 4500)">
        <p class="range-field__label">1985</p>
        <q-slider v-model="fieldYear" color="negative" :min="1985" :max="2016" vertical label />
        <p class="range-field__label">2016</p>
      </div>
      <div class="country-field" v-if="position >= 1500 && position < 2800">
        <q-select v-model="fieldCountry" :options="country" label="Country"/>
      </div>
      <!-- <div class="country-field" v-if="position >= 2800 && position < 3700">
        <q-input v-model.number="fieldNumber" type="number" filled style="max-width: 200px" :rules="[ val => val > 0 && val <= 20 || 'Please use values from 1 to 20']"/>
      </div> -->
    </aside>
    <section class="flex pie-area" v-if="sex">
      <h2 class="heading-secondary" style="left: 50%; transform: translate(-50%, 0);">Total world suicides per year</h2>
      <div class="row" style="margin-top: 7rem">
        <div class="col-1 offset-md-3" style="width: 10rem;">
          <p><span class="sub-title">Total </span><span class="value">{{ formatMoney(tot) }}</span></p>
          <p class="sex"><span class="sub-title">Male </span><span class="value male">{{ formatMoney(sex.male) }}</span></p>
          <p class="sex"><span class="sub-title">Female </span><span class="value female">{{ formatMoney(sex.female) }}</span></p>
        </div>
        <div class="col-1 offset-md-6">
          <SexAge :fieldYear="fieldYear"/>
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
    <section class="lollipop-area">
      <h2 class="heading-secondary">Relation suicides/happiness in 2015</h2>
      <div class="row lollipop">
        <div class="col-1 offset-md-2">
          <Lollipop />
        </div>
      </div>
    </section>
    <section class="lollipop-area">
      <h2 class="heading-secondary">Relation suicides/gdp per year</h2>
      <div class="row lollipop">
        <div class="col-1">
          <PIL :fieldYear="fieldYear"/>
        </div>
      </div>
    </section>
    <q-separator inset color="gray" style="height: 1px; margin: 0 20rem"/>
    <section class="methodology">
      <Methodology />
    </section>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatMoney } from '@/utils/bt.js'
import Map from '@/components/Map.vue'
import SexAge from '@/components/SexAge.vue'
import LineChart from '@/components/LineChart.vue'
import Lollipop from '@/components/Lollipop.vue'
import PIL from '@/components/PIL.vue'
import Methodology from '@/components/Methodology.vue'
import { scroll } from 'quasar'
const { getScrollTarget, getScrollPosition } = scroll

export default {
  name: 'Index',
  data () {
    return {
      fieldYear: 1985,
      model: null,
      options: [
        'Albania'
      ],
      position: 0,
      fieldCountry: 'Albania'
    }
  },
  components: {
    Map,
    SexAge,
    LineChart,
    Lollipop,
    Methodology,
    PIL
  },
  watch: {
    fieldYear: async function () {
      await this.getTotSuicFromDb(this.fieldYear)
      await this.getSexFromDb(this.fieldYear)
    }
  },
  computed: {
    ...mapGetters({
      tot: 'suicidi/getTot',
      country: 'suicidi/getCountry',
      sex: 'suicidi/getSex'
    })
  },
  methods: {
    ...mapActions({
      getTotSuicFromDb: 'suicidi/getTotSuicFromDb',
      getSexFromDb: 'suicidi/getSexFromDb',
      dbUpdate: 'db/getDbUpdate'
    }),
    formatMoney,
    scrollHandler () {
      this.position = getScrollPosition(getScrollTarget(this.$refs.aside))
    }
  }
}
</script>
