import * as d3 from 'd3'
import store from '@/store'

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

const actions = {
  init (context, payload) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then(async db => {
          db.transaction(function (tx) {
            // tx.executeSql('DELETE FROM suicidi', [])
            tx.executeSql(`CREATE TABLE IF NOT EXISTS suicidi (
                            id INTEGER PRIMARY KEY,
                            country TEXT,
                            year INTEGER,
                            sex TEXT,
                            age TEXT,
                            suicides INTEGER,
                            population INTEGER,
                            suicidesRate REAL,
                            countryYear TEXT,
                            hdi REAL,
                            gdpYear REAL,
                            gpdCapita INTEGER,
                            generation TEXT
                            )
                          `)
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('create table OK')
          })
          await d3.csv('/statics/suicide/master.csv')
            .then(async response => {
              await db.transaction(function (tx) {
                response.forEach(function (row) {
                  // console.log(row)
                  tx.executeSql(`INSERT INTO suicidi(
                                  country,
                                  year,
                                  sex,
                                  age,
                                  suicides,
                                  population,
                                  suicidesRate,
                                  countryYear,
                                  hdi,
                                  gdpYear,
                                  gpdCapita,
                                  generation
                                  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
                                `,
                  [row.country, row.year, row.sex, row.age, row.suicides, row.population, row['suicides/100k pop'], row['country-year'], row['HDI for year'], row['" gdp_for_year ($) "'], row['gdp_per_capita ($)'], row.generation],
                  function (tx, resultSet) {
                    // console.log('resultSet', resultSet)
                  }, function (error) {
                    reject(error)
                  })
                })
              }, function (error) {
                reject(error)
              }, function () {
                // context.commit('setParametri', json)
                resolve(true)
              })
              // await db.transaction(function (tx) {
              //   let campi = Object.keys(json)
              //   for (let i = 0; i < campi.length; i++) {
              //     let campo = campi[i]
              //     tx.executeSql(`INSERT INTO parametri VALUES (?,?)`, [campo, JSON.stringify(json[campo])],
              //       function (tx, resultSet) {
              //       }, function (error) {
              //         reject(error)
              //       })
              //   }
              // }, function (error) {
              //   reject(error)
              // }, function () {
              //   context.commit('setParametri', json)
              //   resolve(true)
              // })
            })
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getFromDb (context) {
    // return new Promise((resolve, reject) => {
    //   store.dispatch('db/open')
    //     .then((db) => {
    //       db.transaction(function (tx) {
    //         tx.executeSql(
    //           'SELECT * FROM parametri', [],
    //           function (tx, resultSet) {
    //             let parametri = {}
    //             for (let r = 0; r < resultSet.rows.length; r++) {
    //               parametri[resultSet.rows.item(r).dominio] = JSON.parse(resultSet.rows.item(r).valore)
    //             }
    //             context.commit('setParametri', parametri)
    //           }, function (error) {
    //             reject(error)
    //           })
    //       }, function (error) {
    //         reject(error)
    //       }, function () {
    //         // console.log('getFromDb transaction ok')
    //         resolve(true)
    //       })
    //     })
    // })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
