const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  user_id: state => state.user.user_id,
  user_name: state => state.user.user_name,
  card_num: state => state.user.card_num,
  password: state => state.user.password,
  user_img: state => state.user.user_img
}
export default getters
