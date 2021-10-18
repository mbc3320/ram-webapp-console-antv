import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    ticket: '',
    name: '',
    welcome: '',
    avatar: '',
    roleList: [],
    accessList: [],
    info: null
  },

  mutations: {
    SET_TOKEN: (state, ticket) => {
      state.ticket = ticket
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roleList) => {
      state.roleList = roleList
    },
    SET_ACCESSES (state, accessList) {
      state.accessList = accessList
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          storage.set(ACCESS_TOKEN, response.data.ticket, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', response.data.ticket)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data.userDetail
          if (result.roleList && result.accessList.length > 0) {
            commit('SET_ROLES', result.roleList)
            commit('SET_ACCESSES', result.accessList)
          }
          commit('SET_INFO', result)
          commit('SET_NAME', { name: result.nickName, welcome: welcome() })
          commit('SET_AVATAR', '')

          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ACCESSES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    },
    LocalLogout ({ commit, state }) {
      return new Promise((resolve) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ACCESSES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
      })
    }

  }
}

export default user
