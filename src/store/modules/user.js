import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    functions: [],
    select_channel: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_FUNCTIONS: (state, functions) => {
    state.functions = functions
  },
  SET_CHANNEL: (state, channel) => {
    console.log(channel)
    state.select_channel = channel
  }
}

const actions = {
  // user login
  Login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(response => {
        console.log(response)
        commit('SET_TOKEN', response.token)
        setToken(response.token)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  GetInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        if (!response) {
          return reject('Verification failed, please Login again.')
        }
        commit('SET_NAME', response.username)
        commit('SET_AVATAR', response.avatarName)
        commit('SET_FUNCTIONS', response.functions)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  Logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  ResetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // select operator
  SelectChannel({ commit }, select_channel) {
    return new Promise(resolve => {
      commit('SET_OPERATOR', select_channel)
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions
}

