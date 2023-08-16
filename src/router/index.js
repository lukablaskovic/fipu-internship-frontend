import { createRouter, createWebHashHistory } from "vue-router";
import { useMainStore } from "@/stores/main";

const routes = [
  {
    meta: {
      title: "Dashboard",
      requiresAuth: true,
    },
    path: "/",
    name: "default",
    component: () => import("@/views/DashboardView.vue"),
  },
  {
    meta: {
      title: "Dashboard",
      requiresAuth: true,
    },
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/DashboardView.vue"),
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
      title: "Moja praksa",
      requiresAuth: true,
    },
    path: "/moja-praksa",
    name: "moja praksa",
    component: () => import("@/views/MojaPraksaView.vue"),
  },
  {
    meta: {
      title: "Dostupni zadaci",
      requiresAuth: false,
    },
    path: "/dostupni-zadaci",
    name: "dostupni-zadaci",
    component: () => import("@/views/DostupniZadaciView.vue"),
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
      requiresAuth: true,
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
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
  console.log("mainStore.userAuthenticated", mainStore.userAuthenticated);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAdmin = to.matched.some((record) => record.meta.isAdmin);

  if (requiresAuth && !mainStore.userAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && mainStore.userAuthenticated) {
    next("/dashboard");
  } else if (isAdmin && !isAdminUser) {
    next("/error");
  } else {
    next();
  }
});

export default router;
