const state = {
  db: null,
  name: 'suicidesDB',
  version: '1.0',
  description: 'A suicides db',
  dimesion: 2 * 1024 * 1024
}

const getters = {
  getDb (state) {
    // console.log('getDb', state.db)
    return state.db
  }
}

const actions = {
  open () {
    return new Promise((resolve) => {
      resolve(state.db)
    })
  },
  start (context) {
    return new Promise((resolve) => {
      const db = openDatabase(state.name, state.version, state.description, state.dimesion)
      context.commit('setDb', db)
      resolve(db)
    })
  }
}

const mutations = {
  setDb (state, value) {
    console.log('setDb', value)
    state.db = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
