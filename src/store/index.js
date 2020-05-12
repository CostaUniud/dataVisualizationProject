import Vue from 'vue'
import Vuex from 'vuex'

import db from './modules/db'
import suicidi from './modules/suicidi'
import happyness from './modules/happyness'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default new Vuex.Store({
  modules: {
    db,
    suicidi,
    happyness
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV
})
