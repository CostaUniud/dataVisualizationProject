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
  init () {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then(async db => {
          db.transaction(function (tx) {
            tx.executeSql('DELETE FROM suicidi', [])
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
                  [row.country, row.year, row.sex, row.age, row.suicides_no, row.population, row['suicides/100k pop'], row['country-year'], row['HDI for year'], row[' gdp_for_year ($) '], row['gdp_per_capita ($)'], row.generation],
                  function (tx, resultSet) {
                  }, function (error) {
                    reject(error)
                  })
                })
              }, function (error) {
                reject(error)
              }, async function () {
                await actions.updateDb()
                  .then(response => {
                    resolve(true)
                  })
                  .catch(error => {
                    reject(error)
                  })
              })
            })
            .catch(error => {
              reject(error)
            })
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  updateDb () {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then(db => {
          db.transaction(function (tx) {
            tx.executeSql(`UPDATE suicidi
                            SET country = 'Russia'
                            WHERE country = 'Russian Federation'
                          `,
            [],
            function (tx, resultSet) {
            }, function (error) {
              reject(error)
            })
            tx.executeSql(`UPDATE suicidi
                            SET country = 'United States of America'
                            WHERE country = 'United States'
                          `,
            [],
            function (tx, resultSet) {
            }, function (error) {
              reject(error)
            })
            tx.executeSql(`UPDATE suicidi
                            SET country = 'Republic of Serbia'
                            WHERE country = 'Serbia'
                          `,
            [],
            function (tx, resultSet) {
            }, function (error) {
              reject(error)
            })
            tx.executeSql(`UPDATE suicidi
                            SET country = 'South Korea'
                            WHERE country = 'Republic of Korea'
                          `,
            [],
            function (tx, resultSet) {
            }, function (error) {
              reject(error)
            })
            tx.executeSql(`UPDATE suicidi
                            SET country = 'The Bahamas'
                            WHERE country = 'Bahamas'
                          `,
            [],
            function (tx, resultSet) {
            }, function (error) {
              reject(error)
            })
            tx.executeSql(`UPDATE suicidi
                            SET country = 'Mauritania'
                            WHERE country = 'Mauritius'
                          `,
            [],
            function (tx, resultSet) {
            }, function (error) {
              reject(error)
            })
          }, function (error) {
            reject(error)
          }, function () {
            resolve(true)
          })
        })
    })
  },
  getSuicidiFromDb (context, year) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then((db) => {
          db.transaction(function (tx) {
            tx.executeSql(
              `SELECT countryYear, country, SUM(suicidesRate)
                FROM suicidi
                WHERE year = ?
                GROUP BY countryYear`,
              [year],
              function (tx, resultSet) {
                const suicidi = {}
                for (let r = 0; r < resultSet.rows.length; r++) {
                  suicidi[resultSet.rows.item(r).country] = resultSet.rows.item(r)['SUM(suicidesRate)']
                }
                context.commit('setSuicidi', suicidi)
              }, function (error) {
                reject(error)
              })
          }, function (error) {
            reject(error)
          }, function () {
            resolve(true)
          })
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
