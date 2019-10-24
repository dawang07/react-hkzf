import React from 'react'
import axios from 'axios'
import { BASE_URL } from './url'
import { getToken } from '../utils/token'

//设置基地址
axios.defaults.baseURL = BASE_URL

// 把axios设置全局,给React.Component的原型添加一个属性
React.Component.prototype.$axios = axios

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    const token = getToken()
    if (token) {
      config.headers.Authorization = token    //在请求头中添加token
    }
    // 在发送请求之前做些什么
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

export { axios }
