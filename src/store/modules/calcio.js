const state = {
  league: null
}

const getters = {
  getLeague (state) {
    return state.league
  }
}

const mutations = {
  setLeague (state, value) {
    console.log('setLeague', value)
    state.league = value
  }
}

const actions = {
  fetch (context) {
    const database = new sqlite3.Database('../../statics/soccer/soccer_database.sqlite', sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error(err.message)
      }
      console.log(database)
      console.log('Connected to the soccer_database.')
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
