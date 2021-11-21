import Vuex from 'vuex';
import authModule from './authStore/index.js';
import eventsModule from './eventsStore/index.js';
import userModule from './userStore/index.js';

import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';

const modules = {
  eventsMod: eventsModule,
  authMod: authModule,
  userMod: userModule,
};

const plugins = [
  createPersistedState({
    getState: (key) => Cookies.getJSON(key),
    setState: (key, state) => Cookies.set(key, state, {expires: 3, secure: true}),
  }),
];

export function useVuex(app) {
  app.use(Vuex);
}

let store;

export function createStore() {
  if (store == null && store === undefined) {
    store = new Vuex.Store({
      state: {},
      mutations: {},
      actions: {},
      modules: modules,
      plugins: plugins,
    });
  }

  return store;
}