<template>
  <div>
<!--    <v-toolbar-title class="mr-16">-->
<!--      <router-link :to="{ name: 'home'}">Каталог</router-link>-->
<!--    </v-toolbar-title>-->
<!--    <v-toolbar-title>-->
<!--      <router-link :to="{ name: 'uploadVideo'}">Загрузить видео</router-link>-->
<!--    </v-toolbar-title>-->
<!--    <v-toolbar-title class="float-right">-->
<!--      <router-link :to="{ name: 'user'}">User {{ currentUsername }}</router-link>-->
<!--    </v-toolbar-title>-->
    <v-toolbar-title class="float-right">
      <div v-if="isLoggedUser === false">
        <router-link :to="{ name: 'login'}">login</router-link>
      </div>
      <div v-else>
        <v-btn v-on:click="logoutUser()">logout</v-btn>
      </div>
    </v-toolbar-title>
    <v-toolbar-title class="float-right">
      <div v-if="isLoggedUser === true">
<!--        <router-link :to="{ name: 'playlist', query: {PL: 'LL'}}" class="subtitle-2"> <span-->
<!--            class="subtitle-2">Liked video</span>-->
<!--        </router-link>-->
      </div>
    </v-toolbar-title>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
// import SearchRow from "./SearchRow";

export default {
  name: "Navigation",
  data() {
    return {
      userid: {type: String, default: ""},
    }
  },
  methods: {
    ...mapActions({
      logout: "authMod/logout",
    }),
    ...mapGetters({
      isLogged: "authMod/isLoggedIn",
      getUser: "authMod/getCurrentUser",
      getCurrentUser: "authMod/getCurrentUser"
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
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>