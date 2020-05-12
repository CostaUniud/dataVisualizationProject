import * as d3 from 'd3'
import store from '@/store'

const state = {
  happyness: null
}

const getters = {
  getHappy (state) {
    // console.log('getHappy', state.happyness)
    return state.happyness
  }
}

const actions = {
  init (context) {
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
              }, async function () {
                resolve(true)
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
  }
}

const mutations = {
  setHappy (state, value) {
    // console.log('setHappy', value)
    state.happyness = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
