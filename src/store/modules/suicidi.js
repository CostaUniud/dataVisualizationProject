const state = {
  suicidi: null
}

const getters = {
  getSuicidi (state) {
    // console.log('getSuicidi', state.suicidi)
    return state.suicidi
  },
  getSuicidio: (state, getters) => (paramkey) => {
    console.log('getSuicidio', paramkey)
    if (getters.getSuicidi) {
      const found = getters.getSuicidi[paramkey]
      if (found) {
        return found
      } else {
        return null
      }
    }
    return null
  }
  // getValSuicidio: (state, getters) => (paramkey) => {
  //   console.log('getValSuicidio', paramkey)
  //   if (getters.getSuicidio('arresteename')) {
  //     return getters.getSuicidio('arresteename')[paramkey]
  //   }
  //   return false
  // }
}

const mutations = {
  setSuicidi (state, value) {
    // console.log('setSuicidi', value)
    state.suicidi = value
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
