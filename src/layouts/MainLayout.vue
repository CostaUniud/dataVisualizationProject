<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <img src="statics/logo.png" alt="Uniud logo" class="logo">
        <q-toolbar-title>
          <h1>Suicides in the world</h1>
          <h4 class="heading-quaternary">Visual languages for complex systems's project - University of Udine</h4>
        </q-toolbar-title>
        <div class="q-toolbar-author">
          <span class="q-toolbar-author__name">Pepe Federico, professor</span>
          <span class="q-toolbar-author__name">Costantino Luca, student</span>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container style="padding: 0">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
    }
  }
}
</script>
