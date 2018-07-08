import Vue from 'vue'
import Router from 'vue-router'
import Clients from '@/components/clients'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Clients',
      component: Clients
    }
  ]
})
