import VueRouter from 'vue-router';

import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage';
import AdminPage from '../views/AdminPage';

function routes(store) {
  return {
    home: {
      name: 'home',
      path: '/',
      component: HomePage,
    },
    admin: {
      name: 'admin',
      path: '/admin',
      component: AdminPage,
      beforeEnter: (to, from, next) => {
        if (store.getters['authMod/isLoggedIn']) {
          next();
        } else {
          next({name: 'login'});
        }
      },
    },
    login: {
      name: 'login',
      path: '/login',
      component: LoginPage,
      beforeEnter: (to, from, next) => {
        if (store.getters['authMod/isLoggedIn']) {
          next({name: 'uploadVideo'});
        } else {
          next();
        }
      },
    },
  };
}

export function useVueRouter(app) {
  app.use(VueRouter);
}

export {routes};

let routerModule = (function () {
  let instance;
  let createInstance = function (store) {
    return new VueRouter({
      mode: 'history',
      routes: [
        routes(store).home,
        // routes(store).user,
        // routes(store).uploadVideo,
        routes(store).login,
        // routes(store).search,
        routes(store).admin,
      ],
    });
  }

  return {
    getInstance: function (store) {
      return instance || (instance = createInstance(store));
    }
  }
})();

export default routerModule;

