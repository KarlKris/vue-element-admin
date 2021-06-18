import { addOperator, editOperator, deleteOperator } from '@/api/operator'

const getDefaultState = () => {
  return {
    operators: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_OPERATORS: (state, operators) => {
    state.operators = operators
  },
  ADD_OPERATOR: (state, operator) => {
    state.operators = state.operators.concat(operator)
  },
  EDIT_OPERATOR: (state, operator) => {
    var i = -1
    for (var index in state.operators) {
      const o = state.operators[index]
      console.log(o)
      if (o.id === operator.id) {
        i = index
        break
      }
    }
    if (i >= 0) {
      state.operators[i] = operator
    }
  },
  DELETE_OPERATOR: (state, operatorId) => {
    var i = -1
    for (var index in state.operators) {
      const o = state.operators[index]
      console.log(o)
      if (o.id === operatorId) {
        i = index
        break
      }
    }
    if (i >= 0) {
      state.operators.splice(i, 1)
    }
  }
}

const actions = {
  // 玩家权限内运营商
  SetOperators({ commit }, operators) {
    commit('SET_OPERATORS', operators)
  },
  AddOperator({ commit }, operator) {
    return new Promise((resolve, reject) => {
      addOperator(operator).then(res => {
        commit('ADD_OPERATOR', res)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  EditOperator({ commit }, operator) {
    return new Promise((resolve, reject) => {
      editOperator(operator).then(res => {
        commit('EDIT_OPERATOR', res)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  deleteOperator({ commit }, operatorId) {
    return new Promise((resolve, reject) => {
      deleteOperator(operatorId).then(res => {
        commit('DELETE_OPERATOR', res)
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
