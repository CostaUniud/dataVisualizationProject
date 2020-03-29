import axios from 'axios'

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
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          'x-rapidapi-host': 'sportsop-soccer-sports-open-data-v1.p.rapidapi.com',
          'x-rapidapi-key': '32635a14e9msh017992a1d3fd0d3p11358bjsn7425cd04f53e'
        }
      }
      axios.get('https://sportsop-soccer-sports-open-data-v1.p.rapidapi.com/v1/leagues', config)
        .then(async response => {
          const json = response.data
          context.commit('setLeague', json)
          resolve(json)
        })
        .catch(error => {
          reject(error)
        })
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
