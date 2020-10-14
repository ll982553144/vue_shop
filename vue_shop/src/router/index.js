import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
// Home组件，D1-24
import Home from '@/components/Home.vue'
// Welcome组件,访问home 重定向到welcome,D2-10
import Welcome from '@/components/Welcome.vue'
// 2.Users组件，D2-12
import Users from '@/components/user/Users.vue'

// 权限管理,D3-2
import Rights from '@/components/power/Rights.vue'
// D3-7
import Roles from '@/components/power/Roles.vue'

// D4-3
import Cate from '@/components/goods/Cate.vue'

Vue.use(VueRouter)



const router = new VueRouter({
  routes:[
    { path: '/',redirect: 'login'},
    { path: '/login',component: Login},
    { 
      // 只要访问home 就能重定向到welcome，D2-10
      path: '/home',
      component: Home,  
      redirect: '/welcome',
      children: [
      {path: '/welcome',component: Welcome}, 
      // 3.用户管理-用户列表，转到users， D2-12
      {path: '/users', component: Users},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      // 3.商品管理-商品分类，转到users， D4-3
      {path: '/categories', component: Cate},
    ]
  }
  ]
})
// 挂载路由导航守卫,D1-25
// router.beforeEach((to, from, next) => {
//   // to 将要访问的路径
//   // from 代表从哪个路径跳转而来
//   // next 是一个函数，表示放行
//   //     next()  放行    next('/login')  强制跳转
//   if(to.path === '/login') return next();
//   //获取token
//   const tokenStr = window.sessionStorage.getItem('token');
//   if(!tokenStr) return next('/login');
// })
export default router
