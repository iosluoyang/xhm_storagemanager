const getters = {
  configData: state => state.app.configData,
  accessToken: state => state.user.accessToken,
  refreshToken: state => state.user.refreshToken,
  user: state => state.user.user,
}
export default getters