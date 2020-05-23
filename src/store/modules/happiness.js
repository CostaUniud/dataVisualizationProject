import * as d3 from 'd3'
import store from '@/store'

const state = {
  happiness: null,
  happySuic: null
}

const getters = {
  getHappy (state) {
    // console.log('getHappy', state.happiness)
    return state.happiness
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
            tx.executeSql(`CREATE TABLE IF NOT EXISTS happiness (
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
          await d3.csv('/statics/happiness/happiness.csv')
            .then(async response => {
              await db.transaction(function (tx) {
                tx.executeSql('DELETE FROM happiness', [])
                response.forEach(function (row) {
                  tx.executeSql(`INSERT INTO happiness(
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
            tx.executeSql(`UPDATE happiness
                            SET country = 'United States of America'
                            WHERE country = 'United States'
                          `,
            [],
            function (tx, resultSet) {
            }, function (error) {
              reject(error)
            })
            tx.executeSql(`UPDATE happiness
                            SET country = 'Republic of Serbia'
                            WHERE country = 'Serbia'
                          `,
            [],
            function (tx, resultSet) {
            }, function (error) {
              reject(error)
            })
            tx.executeSql(`UPDATE happiness
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
                            FROM happiness`,
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
              `SELECT country, SUM(s.suicides) AS somma_suicidi, SUM(s.population) AS somma_popolazione, h.rank
              FROM suicidi s
              INNER JOIN happiness h USING(country)
              WHERE s.year = 2015
              GROUP BY country
              ORDER BY h.rank DESC`,
              [],
              function (tx, resultSet) {
                const a = []
                for (let r = 0; r < resultSet.rows.length; r++) {
                  a.push({
                    country: resultSet.rows.item(r).country,
                    rate: Math.round(((resultSet.rows.item(r).somma_suicidi / resultSet.rows.item(r).somma_popolazione) * 100000)),
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
    state.happiness = value
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
