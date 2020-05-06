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
    <section class="pie-area">
      <PieSex :fieldYear="fieldYear"/>
      <PieAge :fieldYear="fieldYear"/>
    </section>
  </q-page>
</template>

<script>
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
  computed: {
  },
  methods: {
  }
}
</script>
