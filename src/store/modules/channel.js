import { addChannel, editChannel, deleteChannel } from '@/api/channel'

const getDefaultState = () => {
  return {
    channels: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_CHANNELS: (state, channels) => {
    state.channels = channels
  },
  ADD_CHANNEL: (state, channel) => {
    state.channels = state.channels.concat(channel)
  },
  EDIT_CHANNEL: (state, channel) => {
    var i = -1
    for (var index in state.channels) {
      const o = state.channels[index]
      console.log(o)
      if (o.id === channel.id) {
        i = index
        break
      }
    }
    if (i >= 0) {
      state.channels[i] = channel
    }
  },
  DELETE_CHANNEL: (state, channelId) => {
    var i = -1
    for (var index in state.channels) {
      const o = state.channels[index]
      console.log(o)
      if (o.id === channelId) {
        i = index
        break
      }
    }
    if (i >= 0) {
      state.channels.splice(i, 1)
    }
  }
}

const actions = {
  // 玩家权限内运营商
  SetChannels({ commit }, channels) {
    commit('SET_CHANNELS', channels)
  },
  AddChannel({ commit }, channel) {
    return new Promise((resolve, reject) => {
      addChannel(channel).then(res => {
        commit('ADD_CHANNEL', res)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  EditChannel({ commit }, channel) {
    return new Promise((resolve, reject) => {
      editChannel(channel).then(res => {
        commit('EDIT_CHANNEL', res)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  deletChannel({ commit }, channelId) {
    return new Promise((resolve, reject) => {
      deleteChannel(channelId).then(res => {
        commit('DELETE_CHANNEL', res)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
