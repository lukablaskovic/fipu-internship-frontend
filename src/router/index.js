import { createRouter, createWebHashHistory } from "vue-router";
import { useMainStore } from "@/stores/main_store.js";

const routes = [
  {
    meta: {
      title: "Moja praksa",
      requiresAuth: true,
      requiresAdmin: false,
    },
    path: "/",
    name: "default",
    component: () => import("@/views/MojaPraksaView.vue"),
  },
  {
    meta: {
      title: "Moja praksa",
      requiresAuth: true,
      requiresAdmin: false,
    },
    path: "/moja-praksa",
    name: "moja praksa",
    component: () => import("@/views/MojaPraksaView.vue"),
  },
  {
    meta: {
      title: "Dashboard",
      requiresAuth: true,
      requiresAdmin: true,
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
      title: "Prijava",
      requiresAuth: false,
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Registracija",
      requiresAuth: false,
    },
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const mainStore = useMainStore();

  let userAuthenticated = mainStore.userAuthenticated;
  let userAdmin = mainStore.userAdmin;
  console.log("userAuthenticated", userAuthenticated);
  console.log("userAdmin", userAdmin);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth && !userAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && userAuthenticated && !userAdmin) {
    next("/moja-praksa");
  } else if (to.path === "/login" && userAuthenticated && userAdmin) {
    next("/dashboard");
  } else if (requiresAdmin && !userAdmin && userAuthenticated) {
    next("/moja-praksa");
  } else {
    next();
  }
});

export default router;
