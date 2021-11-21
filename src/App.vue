<template>
  <layout></layout>
  <!--  <v-app>-->
  <!--    <v-app-bar-->
  <!--      app-->
  <!--      color="primary"-->
  <!--      dark-->
  <!--    >-->
  <!--     -->
  <!--      <div class="text-center">-->
  <!--        <v-menu offset-y>-->
  <!--          <template v-slot:activator="{ on, attrs }">-->
  <!--            <v-btn-->
  <!--              color="primary"-->
  <!--              dark-->
  <!--              v-bind="attrs"-->
  <!--              v-on="on"-->
  <!--            >-->
  <!--              Dropdown-->
  <!--            </v-btn>-->
  <!--          </template>-->
  <!--          <v-list>-->
  <!--            <v-list-item-->
  <!--              v-for="(item, index) in items"-->
  <!--              :key="index"-->
  <!--            >-->
  <!--              <v-list-item-title>{{ item.title }}</v-list-item-title>-->
  <!--            </v-list-item>-->
  <!--          </v-list>-->
  <!--        </v-menu>-->
  <!--      </div>-->
  <!--      <div class="d-flex align-center">-->
  <!--        <v-img-->
  <!--          alt="Vuetify Logo"-->
  <!--          class="shrink mr-2"-->
  <!--          contain-->
  <!--          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"-->
  <!--          transition="scale-transition"-->
  <!--          width="40"-->
  <!--        />-->

  <!--        <v-img-->
  <!--          alt="Vuetify Name"-->
  <!--          class="shrink mt-1 hidden-sm-and-down"-->
  <!--          contain-->
  <!--          min-width="100"-->
  <!--          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"-->
  <!--          width="100"-->
  <!--        />-->
  <!--      </div>-->

  <!--      <v-spacer></v-spacer>-->

  <!--      <v-btn-->
  <!--        href="https://github.com/vuetifyjs/vuetify/releases/latest"-->
  <!--        target="_blank"-->
  <!--        text-->
  <!--      >-->
  <!--        <span class="mr-2">Latest Release</span>-->
  <!--        <v-icon>mdi-open-in-new</v-icon>-->
  <!--      </v-btn>-->
  <!--    </v-app-bar>-->
  <!--    <v-main>-->

  <!--        <div>-->
  <!--          <Navigation/>-->
  <!--          <h1>Pretty player</h1>-->
  <!--          <Search/>-->
  <!--          <Pagination :show-status="false" :user-page="false"/>-->
  <!--        </div>-->
  <!--    </v-main>-->
  <!--  </v-app>-->
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import Layout from './layouts/LayoutDefault.vue';
// import Navigation from './components/Navigation.vue';
// import Search from "./components/Search";
// import Pagination from './components/Pagination.vue';

export default {
  name: 'App',

  components: {
    // HelloWorld,
    Layout,
    // Navigation,
    // Search,
    // Pagination
  },

  data: () => ({
    items: [
      {title: 'Click Me'},
      {title: 'Click Me'},
      {title: 'Click Me'},
      {title: 'Click Me 2'},
    ],
  }),
};
</script>

<style >
a:link {
  color: #ffffff;
  background-color: transparent;
  text-decoration: none;
}

a:visited {
  color: #ffffff;
  background-color: transparent;
  text-decoration: none;
}

a:hover {
  color: #ffffff;
  background-color: transparent;
  text-decoration: underline;
}

a:active {
  color: #ffffff;
  background-color: transparent;
  text-decoration: underline;
}
</style>