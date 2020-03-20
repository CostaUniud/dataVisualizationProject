import axios from 'axios'

const state = {
  arresti: null
}

const getters = {
  getArresti (state) {
    // console.log('getArresti', state.arresti)
    return state.arresti
  }
  // getArresto: (state, getters) => (paramkey) => {
  //   console.log('getArresto', paramkey)
  //   if (getters.getParametri) {
  //     let found = getters.getParametri[paramkey]
  //     if (found) {
  //       return found
  //     } else {
  //       return null
  //     }
  //   }
  //   return null
  // },
  // getValArresto: (state, getters) => (paramkey) => {
  //   console.log('getValArresto', paramkey)
  //   if (getters.getArresto('arresteename')) {
  //     return getters.getArresto('arresteename')[paramkey]
  //   }
  //   return false
  // }
}

const mutations = {
  setArresti (state, value) {
    // console.log('setArresti', value)
    state.arresti = value
  }
}

const actions = {
  fetch (context, payload) {
    return new Promise((resolve, reject) => {
      axios.get('https://www.dallasopendata.com/resource/sdr7-6v3j.json', payload)
        .then(async response => {
          const json = response.data
          context.commit('setArresti', json)
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
