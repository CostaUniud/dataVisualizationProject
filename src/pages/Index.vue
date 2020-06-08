<template>
  <q-page class="flex">
    <Map :fieldYear="fieldYear"/>
    <aside ref="aside">
      <q-scroll-observer @scroll="scrollHandler"/>
      <div class="range-field" v-if="position < (pageHeight * 2 - 250) || (position >= (pageHeight * 4 - 350) && position < (pageHeight * 4 + 200))"> <!-- v-if="position < 1900 || (position >= 3950 && position < 4500)" -->
        <p class="range-field__label">1985</p>
        <q-slider v-model="fieldYear" color="negative" :min="1985" :max="2016" vertical label />
        <p class="range-field__label">2016</p>
      </div>
      <div class="country-field" v-if="position >= (pageHeight * 2 - 250) && position < (pageHeight * 3 - 250)">
        <q-select v-model="fieldCountry" :options="country" label="Country"/>
      </div>
      <div class="country-field" v-if="position >= (pageHeight * 3 - 250) && position < (pageHeight * 4 - 350)">
        <q-select v-model="fieldOrder" :options="order" label="Order By"/>
      </div>
    </aside>
    <section class="total-area" v-if="sex">
      <h2 class="heading-secondary">Total world suicides per year</h2>
      <div class="total-area__main">
        <div class="total-area__number">
          <p><span class="sub-title">Total </span><span class="value">{{ formatMoney(tot) }}</span></p>
          <p class="sex"><span class="sub-title">Male </span><span class="value male">{{ formatMoney(sex.male) }}</span></p>
          <p class="sex"><span class="sub-title">Female </span><span class="value female">{{ formatMoney(sex.female) }}</span></p>
        </div>
        <div class="total-area__plot">
          <SexAge :fieldYear="fieldYear"/>
        </div>
      </div>
    </section>
    <section class="trend-area">
      <h2 class="heading-secondary">Trend suicides per country</h2>
      <div class="trend-area__plot">
        <Trend :fieldCountry="fieldCountry"/>
      </div>
    </section>
    <section class="lollipop-area">
      <h2 class="heading-secondary">Relation suicides/happiness in 2015</h2>
      <div class="lollipop-area__plot">
        <Happy :fieldOrder="fieldOrder"/>
      </div>
    </section>
    <section class="lollipop-area" style="margin-bottom: 10rem">
      <h2 class="heading-secondary">Relation suicides/gdp per year</h2>
      <div class="lollipop-area__plot" style="margin-left: -20rem">
        <PIL :fieldYear="fieldYear"/>
      </div>
    </section>
    <q-separator inset color="gray" />
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
import Trend from '@/components/Trend.vue'
import Happy from '@/components/Happy.vue'
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
      order: [
        'Rank Happiness', // 'Suicides Rate',
        'Alphabetical'
      ],
      position: 0,
      fieldCountry: 'Albania',
      fieldOrder: 'Rank Happiness',
      pageHeight: 0
    }
  },
  components: {
    Map,
    SexAge,
    Trend,
    Happy,
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
      this.pageHeight = window.screen.height
      this.position = getScrollPosition(getScrollTarget(this.$refs.aside))
    }
  }
}
</script>
