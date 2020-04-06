import axios from 'axios'

const state = {
  url: 'http://localhost:3128/',
  dati: null
}

const getters = {
  getDati (state) {
    return state.dati
  },
  getDato: (state, getters) => (paramkey) => {
    console.log('getDato', paramkey)
    if (getters.getDati) {
      const found = getters.getDati[paramkey]
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
  setDati (state, value) {
    // console.log('setDati', value)
    state.dati = value
  }
}

const actions = {
  fetch (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.state.url + 'country')
        .then(response => {
          context.commit('setDati', response.data)
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
