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
  select_channel: state => state.user.select_channel,
  channels: state => state.channel.channels
}
export default getters
