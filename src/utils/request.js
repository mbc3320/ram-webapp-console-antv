import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN, APP_LANGUAGE } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 从 localStorage 获取 language
  const lang = storage.get(APP_LANGUAGE)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['RAM-TICKET'] = token
  }
  // set default content-type as application/json
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  if (lang) {
    switch (lang) {
      case 'zh-CN':
        config.headers['Accept-Language'] = 'zh-CN,zh;q=0.5'
        break
      case 'en-US':
        config.headers['Accept-Language'] = 'en-US,en;q=0.5'
        break
    }
  }

  // transform form data as json string
  config.transformRequest = [function (data) {
    const requestBody = JSON.stringify({
      timestamp: new Date().getTime(),
      sign: 'nosign',
      data: data
    })
    return requestBody
  }]

  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
    const res = response.data

    // if the custom code is not 0, it is judged as an error.
    if (res.code !== 0) {
      let msg
      if (res.code === 9001 || res.code === 10102) {
        msg = res.msg + ': ' + res.data
      } else {
        msg = res.msg
      }
      notification.error({
        message: res.code,
        description: msg
      })

      /**
       * 401:未登录;
       * 10003：Ticket不存在
       * 10004:Ticket已失效
       */
      if (res.code === 401 || res.code === 10003 || res.code === 10004) {
        notification.error({
          message: '错误',
          description: '会话超时，请重新登录'
        })
        store.dispatch('LocalLogout').then(() => {
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
      return Promise.reject(res)
    } else {
      return res
    }
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
