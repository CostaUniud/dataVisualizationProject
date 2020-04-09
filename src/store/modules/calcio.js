import axios from 'axios'

const state = {
  url: 'http://localhost:3128/',
  country: null,
  league: null,
  match: null,
  player: null,
  playerAttributes: null,
  team: null,
  teamAttributes: null
}

const getters = {
  getCountry (state) {
    return state.country
  },
  getLeague (state) {
    return state.league
  },
  getMatch (state) {
    return state.match
  },
  getPlayer (state) {
    return state.player
  },
  getPlayerAttributes (state) {
    return state.playerAttributes
  },
  getTeam (state) {
    return state.team
  },
  getTeamAttributes (state) {
    return state.teamAttributes
  },
  getDato: (state, getters) => (paramkey) => {
    console.log('getDato', paramkey)
    if (getters.getCountry) {
      const found = getters.getCountry[paramkey]
      if (found) {
        return found
      } else {
        return null
      }
    }
    return null
  }
}

const mutations = {
  setCountry (state, value) {
    // console.log('setCountry', value)
    state.country = value
  },
  setLeague (state, value) {
    // console.log('setLeague', value)
    state.league = value
  },
  setMatch (state, value) {
    // console.log('setMatch', value)
    state.match = value
  },
  setPlayer (state, value) {
    // console.log('setPlayer', value)
    state.player = value
  },
  setPlayerAttributes (state, value) {
    // console.log('setPlayerAttributes', value)
    state.playerAttributes = value
  },
  setTeam (state, value) {
    // console.log('setTeam', value)
    state.team = value
  },
  setTeamAttributes (state, value) {
    // console.log('setTeamAttributes', value)
    state.teamAttributes = value
  }
}

const actions = {
  fetchCountry (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.state.url + 'country')
        .then(response => {
          context.commit('setCountry', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchLeague (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.state.url + 'league')
        .then(response => {
          context.commit('setLeague', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchMatch (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.state.url + 'match')
        .then(response => {
          context.commit('setMatch', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchPlayer (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.state.url + 'player')
        .then(response => {
          context.commit('setPlayer', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchPlayerAttributes (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.state.url + 'player-attributes')
        .then(response => {
          context.commit('setPlayerAttributes', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchTeam (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.state.url + 'team')
        .then(response => {
          context.commit('setTeam', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchTeamAttributes (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.state.url + 'team-attributes')
        .then(response => {
          context.commit('setTeamAttributes', response.data)
          resolve(response.data)
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
