import React from 'react'
import axios from 'axios'
import { BASE_URL } from './url'

//设置基地址
axios.defaults.baseURL = BASE_URL

// 把axios设置全局,给React.Component的原型添加一个属性
React.Component.prototype.$axios = axios
