import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Connexion from '@/components/Connexion.vue'
import Inscription from '@/components/Inscription.vue'
import Chat from '@/components/Chat.vue'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },

    {
      path: '/connexion',
      name: 'connexion',
      component: Connexion,
    },

    {
      path: '/inscription',
      name: 'inscription',
      component: Inscription,
    },

    {
      path: '/chat',
      name: 'chat',
      component: Chat,
    },
    
  ],
})

export default router
