const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  functions: state => state.user.functions,
  permission_routes: state => state.permission.routes,
  addRouters: state => state.permission.addRouters,
  select_operator: state => state.user.select_operator,
  operators: state => state.operator.operators
}
export default getters
