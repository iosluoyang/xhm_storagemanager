const getters = {
  configVersion: state => state.app.configVersion,
  configList: state => state.app.configList,
  accessToken: state => state.user.accessToken,
  refreshToken: state => state.user.refreshToken,
  user: state => state.user.user,
}
export default getters