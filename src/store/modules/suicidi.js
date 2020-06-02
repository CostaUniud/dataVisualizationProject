import * as d3 from 'd3'
import store from '@/store'

const state = {
  suicidi: null,
  sex: null,
  age: null,
  tot: null,
  suicidiCountry: null,
  country: null,
  pil: null,
  sexAge: null
}

const getters = {
  getSuicidi (state) {
    // console.log('getSuicidi', state.suicidi)
    return state.suicidi
  },
  getSex (state) {
    // console.log('getSex', state.sex)
    return state.sex
  },
  getAge (state) {
    // console.log('getAge', state.age)
    return state.age
  },
  getTot (state) {
    // console.log('getTot', state.tot)
    return state.tot
  },
  getSuicidiCountry (state) {
    // console.log('getSuicidiCountry', state.suicidiCountry)
    return state.suicidiCountry
  },
  getCountry (state) {
    // console.log('getCountry', state.country)
    return state.country
  },
  getPil (state) {
    // console.log('getPil', state.pil)
    return state.pil
  },
  getSexAge (state) {
    // console.log('getSexAge', state.sexAge)
    return state.sexAge
  }
}

const mutations = {
  setSuicidi (state, value) {
    // console.log('setSuicidi', value)
    state.suicidi = value
  },
  setSex (state, value) {
    // console.log('setSex', value)
    state.sex = value
  },
  setAge (state, value) {
    // console.log('setAge', value)
    state.age = value
  },
  setTot (state, value) {
    // console.log('setTot', value)
    state.tot = value
  },
  setSuicidiCountry (state, value) {
    // console.log('setSuicidiCountry', value)
    state.suicidiCountry = value
  },
  setCountry (state, value) {
    // console.log('setCountry', value)
    state.country = value
  },
  setPil (state, value) {
    // console.log('setPil', value)
    state.pil = value
  },
  setSexAge (state, value) {
    // console.log('setSexAge', value)
    state.sexAge = value
  }
}

const actions = {
  init () {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then(async db => {
          await db.transaction(function (tx) {
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
                            )`
            )
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('create table OK')
          })
          await d3.csv('/statics/suicide/master.csv')
            .then(async response => {
              await db.transaction(function (tx) {
                tx.executeSql('DELETE FROM suicidi', [])
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
                                  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
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
            tx.executeSql(`UPDATE suicidi
            SET country = 'Dominican Republic'
            WHERE country = 'Dominica'
            `)
            tx.executeSql(`UPDATE suicidi
            SET country = 'Mauritania'
            WHERE country = 'Mauritius'
            `)
            tx.executeSql(`UPDATE suicidi
            SET country = 'Republic of Serbia'
            WHERE country = 'Serbia'
            `)
            tx.executeSql(`UPDATE suicidi
            SET country = 'Russia'
            WHERE country = 'Russian Federation'
            `)
            tx.executeSql(`UPDATE suicidi
            SET country = 'South Korea'
            WHERE country = 'Republic of Korea'
            `)
            tx.executeSql(`UPDATE suicidi
            SET country = 'The Bahamas'
            WHERE country = 'Bahamas'
            `)
            tx.executeSql(`UPDATE suicidi
            SET country = 'United States of America'
            WHERE country = 'United States'
            `)
            tx.executeSql(
              `CREATE VIEW IF NOT EXISTS y
              AS
              SELECT DISTINCT year
              FROM suicidi
              ORDER BY year`)
            tx.executeSql(
              `CREATE VIEW IF NOT EXISTS c
              AS
              SELECT DISTINCT country
              FROM suicidi
              ORDER BY country`)
            tx.executeSql(
              `CREATE VIEW IF NOT EXISTS countrYear
              AS
              SELECT *
              FROM c
              CROSS JOIN y`)
            tx.executeSql(
              `SELECT *
              FROM countrYear`,
              [],
              function (tx, resultSet) {
                for (let r = 0; r < resultSet.rows.length; r++) {
                  tx.executeSql(`INSERT INTO suicidi(
                                  country,
                                  year
                                  ) VALUES (?,?)`,
                  [resultSet.rows.item(r).country, resultSet.rows.item(r).year])
                }
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
              `SELECT country, SUM(suicidi.suicides) AS somma_suicidi, SUM(suicidi.population) AS somma_popolazione
              FROM suicidi
              WHERE year = ?
              GROUP BY country`,
              [year],
              function (tx, resultSet) {
                const suicidi = {}
                for (let r = 0; r < resultSet.rows.length; r++) {
                  suicidi[resultSet.rows.item(r).country] = Math.round(((resultSet.rows.item(r).somma_suicidi / resultSet.rows.item(r).somma_popolazione) * 100000))
                }
                context.commit('setSuicidi', suicidi)
              }, function (error) {
                reject(error)
              })
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('getSuicidiFromDb fatto')
            resolve(true)
          })
        })
    })
  },
  getSexFromDb (context, year) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then((db) => {
          db.transaction(function (tx) {
            tx.executeSql(
              `SELECT sex, SUM(suicidi.suicides) AS somma_suicidi
              FROM suicidi
              WHERE year = ?
              GROUP BY sex`,
              [year],
              function (tx, resultSet) {
                const sex = {}
                for (let r = 0; r < resultSet.rows.length; r++) {
                  sex[resultSet.rows.item(r).sex] = resultSet.rows.item(r).somma_suicidi
                }
                context.commit('setSex', sex)
              }, function (error) {
                reject(error)
              })
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('getSexFromDb fatto')
            resolve(true)
          })
        })
    })
  },
  getAgeFromDb (context, year) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then((db) => {
          db.transaction(function (tx) {
            tx.executeSql(
              `SELECT age, SUM(suicidi.suicides) AS somma_suicidi
              FROM suicidi
              WHERE year = ?
              GROUP BY age`,
              [year],
              function (tx, resultSet) {
                const age = {}
                for (let r = 0; r < resultSet.rows.length; r++) {
                  age[resultSet.rows.item(r).age] = resultSet.rows.item(r).somma_suicidi
                }
                context.commit('setAge', age)
              }, function (error) {
                reject(error)
              })
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('getAgeFromDb fatto')
            resolve(true)
          })
        })
    })
  },
  getTotSuicFromDb (context, year) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then((db) => {
          db.transaction(function (tx) {
            tx.executeSql(
              `SELECT SUM(suicidi.suicides) AS somma_suicidi
              FROM suicidi
              WHERE year = ?`,
              [year],
              function (tx, resultSet) {
                context.commit('setTot', resultSet.rows.item(0).somma_suicidi)
              }, function (error) {
                reject(error)
              })
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('getTotSuicFromDb fatto')
            resolve(true)
          })
        })
    })
  },
  getSuicidiCountryFromDb (context, country) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then((db) => {
          db.transaction(function (tx) {
            tx.executeSql(
              `SELECT year, SUM(suicidi.suicides) AS somma_suicidi
              FROM suicidi
              WHERE country = ?
              GROUP BY year`,
              [country],
              function (tx, resultSet) {
                const suicidi = []
                for (let r = 0; r < resultSet.rows.length; r++) {
                  suicidi.push(
                    {
                      y: resultSet.rows.item(r).year,
                      n: resultSet.rows.item(r).somma_suicidi
                    }
                  )
                }
                context.commit('setSuicidiCountry', suicidi)
              }, function (error) {
                reject(error)
              })
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('getSuicidiCountryFromDb fatto')
            resolve(true)
          })
        })
    })
  },
  getCountryFromDb (context) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then((db) => {
          db.transaction(function (tx) {
            tx.executeSql(
              `SELECT DISTINCT country
              FROM suicidi`,
              [],
              function (tx, resultSet) {
                const country = []
                for (let r = 0; r < resultSet.rows.length; r++) {
                  country.push(resultSet.rows.item(r).country)
                }
                context.commit('setCountry', country)
              }, function (error) {
                reject(error)
              })
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('getCountryFromDb fatto')
            resolve(true)
          })
        })
    })
  },
  getPilFromDb (context, year) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then((db) => {
          db.transaction(function (tx) {
            tx.executeSql(
              `SELECT country, SUM(suicidi.suicides) AS somma_suicidi, SUM(suicidi.population) AS somma_popolazione, gdpYear
              FROM suicidi
              WHERE year = ?
              GROUP BY country
              ORDER BY length(gdpYear), gdpYear ASC`,
              [year],
              function (tx, resultSet) {
                const a = []
                for (let r = 0; r < resultSet.rows.length; r++) {
                  if (resultSet.rows.item(r).gdpYear !== null) {
                    a.push({
                      country: resultSet.rows.item(r).country,
                      rate: Math.round(((resultSet.rows.item(r).somma_suicidi / resultSet.rows.item(r).somma_popolazione) * 100000)),
                      gdpYear: resultSet.rows.item(r).gdpYear
                    })
                  }
                }
                context.commit('setPil', a)
              }, function (error) {
                reject(error)
              })
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('getPilFromDb fatto')
            resolve(true)
          })
        })
    })
  },
  getSexAgeFromDb (context, year) {
    return new Promise((resolve, reject) => {
      store.dispatch('db/open')
        .then((db) => {
          db.transaction(function (tx) {
            tx.executeSql(
              `SELECT age, sex, SUM(suicidi.suicides) AS somma_suicidi
              FROM suicidi
              WHERE year = ?
              GROUP BY age, sex`,
              [year],
              function (tx, resultSet) {
                const a = []
                for (let r = 0; r < resultSet.rows.length; r++) {
                  if (resultSet.rows.item(r).sex !== null) {
                    a.push({
                      sex: resultSet.rows.item(r).sex,
                      age: resultSet.rows.item(r).age.replace(' years', ''),
                      suic: resultSet.rows.item(r).somma_suicidi
                    })
                  }
                }
                context.commit('setSexAge', a)
              }, function (error) {
                reject(error)
              })
          }, function (error) {
            reject(error)
          }, function () {
            // console.log('getSexAgeFromDb fatto')
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
