import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
  username: 'default',
  user: {
    id: '',
    username: '',
    loggedIn: false,
    accessToken: '',
    refreshToken: '',
  },
};

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
};
