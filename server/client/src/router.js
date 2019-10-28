import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Nofind from './views/404.vue'
import Home from './views/Home'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index'

    },
    { path: '*', name: '/404', component: Nofind },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '', component: Home },
        { path: '/home', name: 'home', component: Home }
      ]
    }

  ]
})
// 添加路由守卫
router.beforeEach((to, from, next) => {

  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == "/login" || to.path == "/register") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
})

export default router;