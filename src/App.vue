<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  async beforeMount () {
    this.$q.loading.show({ message: 'Fetch data...' })
    await this.start()
    await this.init()
      .finally(() => {
        this.$q.loading.hide()
      })
  },
  methods: {
    ...mapActions({
      start: 'db/start',
      init: 'suicidi/init'
    })
  }
}
</script>
