import * as d3 from 'd3'
import store from '@/store'

const state = {
  happyness: null,
  happySuic: null
}

const getters = {
  getHappy (state) {
    // console.log('getHappy', state.happyness)
    return state.happyness
  },
  getHappySuic (state) {
    // console.log('getHappySuic', state.happySuic)
    return state.happySuic
  }
}

const actions = {
  init () {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then(async db => {
          await db.transaction(function (tx) {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS happyness (
                            id INTEGER PRIMARY KEY,
                            country TEXT,
                            rank INTEGER
                            )`
            )
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('create table OK')
          })
          await d3.csv('/statics/happyness/happyness.csv')
            .then(async response => {
              await db.transaction(function (tx) {
                tx.executeSql('DELETE FROM happyness', [])
                response.forEach(function (row) {
                  tx.executeSql(`INSERT INTO happyness(
                                  country,
                                  rank
                                  ) VALUES (?,?)`,
                  [row.Country, row['Happiness Rank']],
                  function (tx, resultSet) {
                    // console.log('ok')
                  }, function (error) {
                    reject(error)
                  })
                })
              }, function (error) {
                reject(error)
              }, async function () {
                await actions.updateDb()
                  .then(response => {
                    // console.log('init+update fatto')
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
        .then(async db => {
          await db.transaction(function (tx) {
            tx.executeSql(`UPDATE happyness
                            SET country = 'United States of America'
                            WHERE country = 'United States'
                          `,
            [],
            function (tx, resultSet) {
            }, function (error) {
              reject(error)
            })
            tx.executeSql(`UPDATE happyness
                            SET country = 'Republic of Serbia'
                            WHERE country = 'Serbia'
                          `,
            [],
            function (tx, resultSet) {
            }, function (error) {
              reject(error)
            })
            tx.executeSql(`UPDATE happyness
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
  getCountryHappyFromDb (context) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then((db) => {
          db.transaction(function (tx) {
            tx.executeSql(`SELECT *
                            FROM happyness`,
            [],
            function (tx, resultSet) {
              const happy = []
              for (let r = 0; r < resultSet.rows.length; r++) {
                happy.push({
                  country: resultSet.rows.item(r).country,
                  rank: resultSet.rows.item(r).rank
                })
              }
              context.commit('setHappy', happy)
            }, function (error) {
              reject(error)
            })
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('getCountryHappyFromDb fatto')
            resolve(true)
          })
        })
    })
  },
  getHappySuicFromDb (context) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then((db) => {
          db.transaction(function (tx) {
            tx.executeSql(
              `SELECT country, s.suicidesRate, h.rank
              FROM suicidi s
              INNER JOIN happyness h USING(country)
              WHERE s.year = 2015
              GROUP BY country`,
              [],
              function (tx, resultSet) {
                const a = []
                for (let r = 0; r < resultSet.rows.length; r++) {
                  a.push({
                    country: resultSet.rows.item(r).country,
                    rate: resultSet.rows.item(r).suicidesRate,
                    rank: resultSet.rows.item(r).rank
                  })
                }
                context.commit('setHappySuic', a)
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

const mutations = {
  setHappy (state, value) {
    // console.log('setHappy', value)
    state.happyness = value
  },
  setHappySuic (state, value) {
    // console.log('setHappySuic', value)
    state.happySuic = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
