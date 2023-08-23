import { createRouter, createWebHashHistory } from "vue-router";
import { mainStore } from "@/main.js";

const routes = [
  {
    meta: {
      title: "Dashboard",
      requiresAuth: true,
      requiresAdmin: false,
    },
    path: "/",
    name: "default",
    component: () => import("@/views/DashboardView.vue"),
  },
  {
    meta: {
      title: "Students",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/students",
    name: "students",
    component: () => import("@/views/StudentsInternshipView.vue"),
  },
  {
    meta: {
      title: "Companies",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/companies",
    name: "companies",
    component: () => import("@/views/CompaniesView.vue"),
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
      title: "Moja praksa",
      requiresAuth: true,
      requiresAdmin: false,
    },
    path: "/moja-praksa",
    name: "moja-praksa",
    component: () => import("@/views/MyInternshipView.vue"),
  },
  {
    meta: {
      title: "Dostupni zadaci",
      requiresAuth: false,
    },
    path: "/dostupni-zadaci",
    name: "dostupni-zadaci",
    component: () => import("@/views/AvailableAssignmentsView.vue"),
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
      title: "Korisnički profil",
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
  {
    meta: {
      title: "BPMN - Models",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/bpmn/models",
    name: "bpmn-models",
    component: () => import("@/views/bpmn/ModelsView.vue"),
  },
  {
    meta: {
      title: "BPMN - Microservices",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/bpmn/microservices",
    name: "bpmn-microservices",
    component: () => import("@/views/bpmn/MicroservicesView.vue"),
  },
  {
    meta: {
      title: "BPMN - Modeler",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/bpmn/modeler",
    name: "bpmn-modeler",
    component: () => import("@/views/bpmn/ModelerView.vue"),
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/TablesView.vue"),
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
  let userAuthenticated = mainStore.userAuthenticated;
  let userAdmin = mainStore.userAdmin;

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
