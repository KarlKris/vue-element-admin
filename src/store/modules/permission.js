import { asyncRouters, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param functions
 */
export function filterAsyncRoutes(routes, functions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(functions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, functions)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRouters: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRouters = routes
    state.routes = sortRouters(constantRoutes.concat(routes))
  }
}

const actions = {
  GenerateRoutes({ commit }, functions) {
    return new Promise(resolve => {
      let accessedRoutes
      if (functions.includes('all')) {
        accessedRoutes = asyncRouters || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRouters, functions)
      }
      console.log(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

function sortRouters(array) {
  return array.sort(function(a, b) { return a.sort - b.sort })
}

export default {
  state,
  mutations,
  actions
}
