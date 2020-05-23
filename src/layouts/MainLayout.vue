<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          <h1>Suicides in the world</h1>
          <h4 class="heading-quaternary">Visual languages for complex systems's project - University of Udine</h4>
        </q-toolbar-title>
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
