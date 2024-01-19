import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from '../views/MainView.vue'
import { ElMessage } from 'element-plus'



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
    // 마이페이지
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('../views/MyPageView.vue')
    },
  ]
})

router.beforeEach((to:any, from:any, next:any) => {
  // 로그인이 필요한 페이지인지 확인
  const authPages = ['main', 'project'];
  const authRequired = authPages.includes(to.name as string);
  const isLoggedIn = localStorage.getItem('userState');

  // 로그인이 필요한 페이지인데 로그인이 안된 경우
  if (authRequired && !isLoggedIn) {    

    if(to.name !== 'login') {
      next('/login');
      ElMessage({
        showClose: true,
        message: '로그인이 필요합니다.',
        type: 'warning'
      });
    }
    
  } else {
    next();
  }
});

export default router