import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from '../views/MainView.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: {name: 'main'},
      children: [
        {
          path: '/main',
          name: 'main',
          component: MainView
        },
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    // 로그인
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    // 회원가입
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/JoinView.vue')
    },
    // 프로젝트 관리
    {
      path: '/project',
      name: 'project',
      component: () => import('../views/ProjectView.vue')
    },
  ]
})

export default router
