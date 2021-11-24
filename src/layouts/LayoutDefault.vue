<template>
  <v-app>
    <v-container v-if="isLoggedUser === true">
      <v-row>
        <v-col :cols="12">
          <v-app-bar
              dark
          >
            <v-toolbar-title class="mr-6">
              <router-link :to="{ name: 'home'}">
                <span class="link">Home</span>
              </router-link>
            </v-toolbar-title>
            <v-toolbar-title class="mr-6" v-if="isLoggedUser === true">
              <router-link :to="{ name: 'admin'}">
                <span class="link">Admin</span>
              </router-link>
            </v-toolbar-title>
            <v-toolbar-title class="mr-6">
              <router-link v-if="isLoggedUser === false" :to="{ name: 'login'}">
                <span class="link">Login</span>
              </router-link>
              <span v-else class="link" v-on:click="logoutUser()">Logout</span>
            </v-toolbar-title>
          </v-app-bar>
        </v-col>
      </v-row>
    </v-container>
    <v-main v-if="isShow">
      <Alert/>
      <router-view :key="$router"></router-view>
    </v-main>
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
      userid: {type: String, default: ""},
      playlists: null,
      isShow: true,
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
      this.isShow = !this.isShow;
      this.isShow = !this.isShow;
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

<style>

body {
  min-width: 320px;
}

.lb-modal-close {
  top: 0;
  right: 0;
  padding: 12px;
  position: absolute;
}

@media (max-width: 1208px) {
  .lb-modal-close {
    top: unset;
    right: unset;
    bottom: 0;
    left: 0;
    padding: 12px;
    position: absolute;
  }
}

.lb-modal-close > div {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background: 0 0;
  border: 0;
  cursor: pointer;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}


body.lb-disable-scrolling {
  overflow: hidden
}

.lightboxOverlay {
  top: 0;
  left: 0;
  position: fixed;
  overflow: hidden;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, .5);
  filter: alpha(Opacity=80);
  opacity: .8;
}

.lightbox-container {
  display: flex;
  align-items: center
}

.lightbox {
  text-align: center;
  line-height: 0;
  position: absolute;
  margin: 0;
  width: 100%;
  z-index: 10000;
  font-weight: 400;
  outline: 0;
}

.lightbox .lb-image {
  display: block;
  height: auto;
  max-width: inherit;
  max-height: none;
  border-radius: 3px;
}

.lightbox a img {
  border: none
}

.pointer:hover {
  cursor: pointer;
}

.lb-outerContainer {
  position: relative;
  width: max-content;
  margin: 0 auto;
  border-radius: 4px;
  background-color: #fff
}

.lb-outerContainer:after {
  content: "";
  display: table;
  clear: both
}

.lb-loader {
  top: 43%;
  height: 25%;
  width: 100%
}

.lb-cancel {
  display: block;
  width: 32px;
  height: 32px;
  margin: 0 auto;
  background: url(/images/vendor/lightbox2/dist/loading.gif?2299ad0b3f63413f026dfec20c205b8f) no-repeat
}

.lb-nav {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 10
}

.lb-container > .nav {
  left: 0
}

.lb-nav a {
  outline: 0;
  background-image: url(data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==)
}

.lb-next, .lb-prev {
  height: 100%;
  cursor: pointer;
  display: block
}

.lb-nav a.lb-prev {
  width: 34%;
  left: 0;
  float: left;
  background: url(/images/prev.png) left 48% no-repeat;
  filter: alpha(Opacity=0);
  opacity: 0;
  transition: opacity .6s
}

.lb-nav a.lb-prev:hover {
  filter: alpha(Opacity=100);
  opacity: 1
}

.lb-nav a.lb-next {
  width: 64%;
  right: 0;
  float: right;
  background: url(/images/next.png) right 48% no-repeat;
  filter: alpha(Opacity=0);
  opacity: 0;
  transition: opacity .6s
}

.lb-nav a.lb-next:hover {
  filter: alpha(Opacity=100);
  opacity: 1
}

.lb-dataContainer {
  margin: 0 auto;
  padding-top: 5px;
  width: 100%;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px
}

.lb-dataContainer:after {
  content: "";
  display: table;
  clear: both
}

.lb-data {
  padding: 0 4px;
  color: #ccc
}

.lb-data .lb-details {
  width: 85%;
  float: left;
  text-align: left;
  line-height: 1.1em
}

.lb-data .lb-caption {
  font-size: 13px;
  font-weight: 700;
  line-height: 1em
}

.lb-data .lb-caption a {
  color: #4ae
}

.lb-data .lb-number {
  display: block;
  clear: left;
  padding-bottom: 1em;
  font-size: 12px;
  color: #999
}

.lb-data .lb-close {
  display: block;
  float: right;
  width: 30px;
  height: 30px;
  background: url(/images/icon-close.png) 100% 0 no-repeat;
  text-align: right;
  outline: 0;
  filter: alpha(Opacity=70);
  opacity: .7;
  transition: opacity .2s
}

.lb-data .lb-close:hover {
  cursor: pointer;
  filter: alpha(Opacity=100);
  opacity: 1
}

a, a:link {
  color: #ffffff;
  background-color: transparent;
  text-decoration: none;
}

.link {
  color: #fff;
  cursor: pointer;
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
