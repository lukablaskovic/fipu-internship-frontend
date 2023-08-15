import { createRouter, createWebHashHistory } from "vue-router";
import { useMainStore } from "@/stores/main";
import Home from "@/views/HomeView.vue";

const routes = [
  {
    meta: {
      title: "",
      requiresAuth: false,
    },
    path: "/",
    name: "default",
  },
  {
    meta: {
      title: "Dashboard",
      requiresAuth: true,
    },
    path: "/dashboard",
    name: "dashboard",
    component: Home,
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/TablesView.vue"),
  },
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import("@/views/FormsView.vue"),
  },
  {
    meta: {
      title: "Profile",
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    meta: {
      title: "Ui",
    },
    path: "/ui",
    name: "ui",
    component: () => import("@/views/UiView.vue"),
  },
  {
    meta: {
      title: "Responsive layout",
    },
    path: "/responsive",
    name: "responsive",
    component: () => import("@/views/ResponsiveView.vue"),
  },
  {
    meta: {
      title: "Login",
      requiresAuth: false,
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: "/error",
    name: "error",
    component: () => import("@/views/ErrorView.vue"),
  },
];

//temporary
let isAdminUser = false;

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const mainStore = useMainStore();
  console.log(mainStore.access_token);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAdmin = to.matched.some((record) => record.meta.isAdmin);

  if (requiresAuth && !mainStore.isLoggedIn) {
    next("/login");
  } else if (to.path === "/" && mainStore.isLoggedIn) {
    next("/dashboard");
  } else if (isAdmin && !isAdminUser) {
    next("/error");
  } else {
    next();
  }
});

export default router;
