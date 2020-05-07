<template>
  <q-page class="flex">
    <Map :fieldYear="fieldYear"/>
    <aside>
      <div class="range-field"> <!-- v-if="!visible" -->
        <p class="range-field__label">1986</p>
        <q-slider v-model="fieldYear" color="negative" :min="1986" :max="2016" vertical label />
        <p class="range-field__label">2016</p>
      </div>
    </aside>
    <section class="flex pie-area justify-center content-center">
      <div class="row">
        <div class="flex col-1 justify-center content-center offset-md-2">
          <p>{{ formatMoney(tot) }}</p>
        </div>
        <div class="col-1 offset-md-2">
          <PieSex :fieldYear="fieldYear"/>
        </div>
        <div class="col-1 offset-md-4">
          <PieAge :fieldYear="fieldYear"/>
        </div>
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

export default {
  name: 'Index',
  data () {
    return {
      fieldYear: 1986
    }
  },
  components: {
    Map,
    PieSex,
    PieAge
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
    formatMoney
  }
}
</script>
