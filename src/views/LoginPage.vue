<template>
  <v-container>
    <v-row class="margin-bottom-20">
      <v-col sm="8" md="6" offset-md="3">  <v-card @submit.prevent>
        <v-card-text>
          <v-text-field
              label="Username"
              v-model="username"
              hide-details="auto"
          ></v-text-field>

          <!--          <label for="username"><span>Username</span> <input id="username" type="text" v-model="username"-->
          <!--                                                             placeholder="Username" required/></label>-->
        </v-card-text>
        <v-card-text v-if="!loginSelected">
          <!--          <label for="username">-->
          <v-text-field
              label="Путь dropbox папки"
              v-model="email"
              hide-details="auto"
          ></v-text-field>
          <!--            <span>Email</span>-->
          <!--            <input id="email" type="email" v-model="email" placeholder="Email"-->
          <!--                                                          required/>-->
          <!--          </label>-->
        </v-card-text>
        <v-card-text v-if="!loginSelected">
          <!--          <label for="username"><input id="isSubscribed" type="checkbox" v-model="isSubscribed" placeholder="Subscribe"-->
          <!--                                       required/><span>Subscribe to video processing result</span></label>-->
        </v-card-text>
        <v-card-text>
          <v-text-field
              label="Password"
              v-model="password"
              hide-details="auto"
          ></v-text-field>
          <!--          <label for="password"><span>Password</span> <input id="password" type="password" v-model="password"-->
          <!--                                                             placeholder="Password" required/></label>-->
        </v-card-text>
        <v-card-actions>
          <v-btn @click="onLoginButtonClick">{{ buttonString }}</v-btn>
        </v-card-actions>
      </v-card></v-col>
    </v-row>
    <p v-if="error">{{ error }}</p>
    <!--    <v-btn @click.prevent="toggleLogin">{{ textLoginString }}</v-btn>-->
  </v-container>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "LoginPage",
  components: {
  },
  data() {
    return {
      loginSelected: true,
      username: "",
      password: "",
      email: "",
      isSubscribed: false,
      error: ""
    }
  },
  methods: {
    ...mapActions({
      login: "authMod/login",
      signup: "authMod/signup"
    }),
    toggleLogin() {
      this.loginSelected = !this.loginSelected;
    },
    async onLoginButtonClick() {
      try {
        if (this.loginSelected) {
          await this.login({username: this.username, password: this.password});
        } else {
          await this.signup({
            username: this.username,
            password: this.password,
            email: this.email,
            isSubscribed: this.isSubscribed
          });
        }

        await this.$router.push({name: "home"})
      } catch (error) {
        this.error = error;
      }
    }
  },
  computed: {
    buttonString() {
      if (this.loginSelected) {
        return "LOGIN"
      } else {
        return "SIGNUP"
      }
    },
    textLoginString() {
      if (this.loginSelected) {
        return "Signup instead";
      } else {
        return "Login instead";
      }
    }
  }
}
</script>

<style scoped>
.margin-bottom-20 {
  margin-bottom: 20px;
}
</style>
