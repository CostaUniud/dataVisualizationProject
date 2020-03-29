import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

// Add a request interceptor
axios.interceptors.request.use(request => {
  console.log(request)
  return request
}, function (error) {
  console.log('axios.interceptors.request > error response:', error)
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(response => {
  return response
}, function (error) {
  console.log('axios.interceptors.response > error response:', error)
  return Promise.reject(error)
})
