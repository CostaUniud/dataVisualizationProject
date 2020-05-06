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
    <Pie :fieldYear="fieldYear"/>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import Map from '@/components/Map.vue'
import Pie from '@/components/Pie.vue'

export default {
  name: 'Index',
  data () {
    return {
      fieldYear: 1986
    }
  },
  components: {
    Map,
    Pie
  },
  async beforeMount () {
    await this.start()
      .then(async response => {
        await this.init()
      })
  },
  computed: {
  },
  methods: {
    ...mapActions({
      start: 'db/start',
      init: 'suicidi/init'
    })
  }
}
</script>
