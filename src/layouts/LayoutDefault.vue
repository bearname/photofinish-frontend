<template>
  <v-app>
    <v-card
        class="mx-auto overflow-hidden"
        width="100%"
        height="100%"
    >
      <v-container v-if="isLoggedUser === true">
        <v-row>
          <v-col :cols="12">
            <v-app-bar
                color="deep-purple"
                dark
            >
              <!--        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>-->
              <v-toolbar-title class="mr-16">
                <router-link :to="{ name: 'home'}">
                  Каталог
                </router-link>
              </v-toolbar-title>
              <!--        <v-toolbar-title>-->
              <!--          <router-link :to="{ name: 'uploadVideo'}">Загрузить видео</router-link>-->
              <!--        </v-toolbar-title>-->
              <!--        <v-toolbar-title class="float-right">-->
              <!--          <router-link :to="{ name: 'user'}">User {{ currentUsername }}</router-link>-->
              <!--        </v-toolbar-title>-->
              <v-toolbar-title class="float-right">
                <div v-if="isLoggedUser === false">
                  <router-link :to="{ name: 'login'}">login</router-link>
                </div>
                <div v-else>
                  <span v-on:click="logoutUser()">logout</span>
                </div>
              </v-toolbar-title>
              <v-toolbar-title class="float-right">
                <div v-if="isLoggedUser === true">
                  <router-link :to="{ name: 'admin'}" class="subtitle-2"> <span
                      class="subtitle-2">Admin</span>
                  </router-link>
                </div>
              </v-toolbar-title>
            </v-app-bar>

          </v-col>
        </v-row>
      </v-container>

<!--      <v-navigation-drawer-->
<!--          v-model="drawer"-->
<!--          absolute-->
<!--          temporary-->
<!--      >-->
<!--        <v-list-->
<!--            nav-->
<!--            dense-->
<!--        >-->
<!--          <v-list-item-group-->
<!--              active-class="deep-purple&#45;&#45;text text&#45;&#45;accent-4"-->
<!--          >-->
<!--&lt;!&ndash;            <router-link :to="{ name: 'home'}">&ndash;&gt;-->
<!--&lt;!&ndash;              <v-list-item>&ndash;&gt;-->
<!--&lt;!&ndash;                <v-list-item-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                  <v-icon>mdi-home</v-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                </v-list-item-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                <v-list-item-title class="lighten-1">Catalog</v-list-item-title>&ndash;&gt;-->
<!--&lt;!&ndash;              </v-list-item>&ndash;&gt;-->
<!--&lt;!&ndash;            </router-link>&ndash;&gt;-->
<!--&lt;!&ndash;            <router-link v-if="isLoggedUser === true" :to="{ name: 'playlist', query: {PL: 'LL'}}" class="subtitle-2">&ndash;&gt;-->
<!--&lt;!&ndash;              <v-list-item>&ndash;&gt;-->
<!--&lt;!&ndash;                <v-list-item-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                  <v-icon>mdi-like-outline</v-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                </v-list-item-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                <v-list-item-title class="subtitle-2">Liked video</v-list-item-title>&ndash;&gt;-->
<!--&lt;!&ndash;              </v-list-item>&ndash;&gt;-->
<!--&lt;!&ndash;            </router-link>&ndash;&gt;-->
<!--&lt;!&ndash;            <router-link v-if="isLoggedUser === true" :to="{ name: 'playlist', query: {PL: 'LL'}}" class="subtitle-2">&ndash;&gt;-->
<!--&lt;!&ndash;              <v-list-item>&ndash;&gt;-->
<!--&lt;!&ndash;                <v-list-item-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                  <v-icon>mdi-like-outline</v-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                </v-list-item-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                <v-list-item-title class="subtitle-2">Liked video</v-list-item-title>&ndash;&gt;-->
<!--&lt;!&ndash;              </v-list-item>&ndash;&gt;-->
<!--&lt;!&ndash;            </router-link>&ndash;&gt;-->
<!--&lt;!&ndash;            <v-list-item>&ndash;&gt;-->
<!--&lt;!&ndash;              <v-list-item-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                <v-icon>mdi-account</v-icon>&ndash;&gt;-->
<!--&lt;!&ndash;              </v-list-item-icon>&ndash;&gt;-->
<!--&lt;!&ndash;              <v-list-item-title>Account</v-list-item-title>&ndash;&gt;-->
<!--&lt;!&ndash;            </v-list-item>&ndash;&gt;-->
<!--            <div v-if="isLoggedUser === true && playlists !== null">-->
<!--              <v-toolbar-title v-for="playlist in playlists"-->
<!--                               v-bind:key="playlist.id">-->
<!--&lt;!&ndash;                <router-link :to="{ name: 'playlist', query: {PL: playlist.id}}" class="subtitle-2"> <span&ndash;&gt;-->
<!--&lt;!&ndash;                    class="subtitle-2">{{ playlist.name }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;                </router-link>&ndash;&gt;-->
<!--              </v-toolbar-title>-->
<!--            </div>-->
<!--          </v-list-item-group>-->
<!--        </v-list>-->
<!--      </v-navigation-drawer>-->
      <v-main>
        <Alert/>
        <router-view></router-view>
      </v-main>
    </v-card>

  </v-app>
</template>

<script>
import Alert from "../components/Alert";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "LayoutDefault",
  components: {
    Alert,
  },
  async created() {
  },
  data() {
    return {
      drawer: false,
      userid: {type: String, default: ""},
      playlists: null,
    }
  },
  methods: {
    ...mapActions({
      logout: "authMod/logout",
    }),
    ...mapGetters({
      isLogged: "authMod/isLoggedIn",
      getUser: "authMod/getCurrentUser",
      getCurrentUser: "authMod/getCurrentUser",
    }),
    logoutUser() {
      this.logout()
      this.isLoggedUser()
    },
  },
  computed: {
    user() {
      return this.getUser(this.userid);
    },
    currentUsername: function () {
      const currentUser = this.getCurrentUser();
      return currentUser.username;
    },
    isLoggedUser() {
      return this.isLogged()
    }
  },
}
</script>

<style scoped>
a:link {
  color: #ffffff;
  background-color: transparent;
  text-decoration: none;
}

a:visited {
  /*color: #ffffff;*/
  background-color: transparent;
  text-decoration: none;
}

a:hover {
  /*color: #ffffff;*/
  background-color: transparent;
  text-decoration: underline;
}

a:active {
  /*color: #ffffff;*/
  background-color: transparent;
  text-decoration: underline;
}
</style>