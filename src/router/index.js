// ✅ 正确的方式2：使用 common 版本
import Vue from "vue";
import VueRouter from "vue-router/dist/vue-router.common.js";

Vue.use(VueRouter);

// 路由懒加载
const Home = () => import("@/views/Home/index.vue");
// const About = () => import('@/views/About.vue')
// const Contact = () => import('@/views/Contact.vue')
// const Login = () => import('@/views/Login.vue')
// const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  {
    // 首页配置
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "首页",
      requiresAuth: false, // 是否需要登录
    },
  },
  //   {
  //     path: "/about",
  //     name: "About",
  //     component: About,
  //     meta: {
  //       title: "关于我们",
  //     },
  //   },
  //   {
  //     path: "/contact",
  //     name: "Contact",
  //     component: Contact,
  //     meta: {
  //       title: "联系我们",
  //     },
  //   },
  //   {
  //     path: "/login",
  //     name: "Login",
  //     component: Login,
  //     meta: {
  //       title: "登录",
  //       hideHeader: true, // 隐藏头部
  //     },
  //   },
  // 404页面
  //   {
  //     path: "*",
  //     name: "NotFound",
  //     component: NotFound,
  //     meta: {
  //       title: "页面不存在",
  //     },
  //   },
];

const router = new VueRouter({
  mode: "history", // 使用 history 模式，需要服务器配置支持
  // mode: 'hash', // 或者使用 hash 模式，不需要服务器配置
  base: process.env.BASE_URL,
  routes,
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title + " - 我的应用";
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) {
      next("/login");
      return;
    }
  }

  next();
});

export default router;
