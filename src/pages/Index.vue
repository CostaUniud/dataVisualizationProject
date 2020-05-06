<template>
  <q-page class="flex">
    <Map/>
    <Pie/>
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
