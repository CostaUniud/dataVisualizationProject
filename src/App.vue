<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      visible: false
    }
  },
  async beforeMount () {
    var that = this

    that.$q.loading.show({ message: 'Get data from db...' })
    await that.start()
    await that.init()
      .then(async response => {
        await that.getSuicidiFromDb(1986) // Utili per la mappa
        await that.getTotSuicFromDb(1986) // Utili per il numero totale di suicidi nel mondo
        await that.getSexFromDb(1986) // Grafico a torta sesso
        await that.getAgeFromDb(1986) // Grafico a torta età
        await that.getCountryFromDb() // Per il q-select del LineChart
        await that.getSuicidiCountryFromDb('Albania') // LineChart
        that.dbUpdate(true)
      })
      .finally(() => {
        that.$q.loading.hide()
        that.visible = true
      })
  },
  methods: {
    ...mapMutations({
      dbUpdate: 'db/setDbUpdate'
    }),
    ...mapActions({
      start: 'db/start',
      init: 'suicidi/init',
      getSuicidiFromDb: 'suicidi/getSuicidiFromDb',
      getTotSuicFromDb: 'suicidi/getTotSuicFromDb',
      getSexFromDb: 'suicidi/getSexFromDb',
      getAgeFromDb: 'suicidi/getAgeFromDb',
      getCountryFromDb: 'suicidi/getCountryFromDb',
      getSuicidiCountryFromDb: 'suicidi/getSuicidiCountryFromDb'
    })
  }
}
</script>
