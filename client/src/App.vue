<template>
  <div id="app">
    <v-app>
      <clients></clients>
    </v-app>
  </div>
</template>

<script>
import Clients from './components/clients.vue'

export default {
  name: 'App',
  components: {
    Clients
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
