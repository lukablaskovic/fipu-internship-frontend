import { createRouter, createWebHashHistory } from "vue-router";
import { mainStore } from "@/main.js";

const routes = [
  {
    path: "/",
    redirect: () => {
      if (mainStore.userAuthenticated) {
        return mainStore.userAdmin ? "/dashboard" : "/moja-praksa";
      }
      return "/login";
    },
  },
  {
    meta: {
      title: "Studenti",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/studenti",
    name: "studenti",
    component: () => import("@/views/admin/StudentsInternshipView.vue"),
  },
  {
    meta: {
      title: "Poslodavci",
      requiresAuth: true,
      requiresAdmin: false,
    },
    path: "/poslodavci",
    name: "poslodavci",
    component: () => import("@/views/common/CompaniesView.vue"),
  },
  {
    meta: {
      title: "Alokacije - Javno",
      requiresAuth: true,
      requiresAdmin: false,
    },
    path: "/alokacije-javno",
    name: "alokacije",
    component: () => import("@/views/student/AllocationsPublicView.vue"),
  },
  {
    meta: {
      title: "Dashboard",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/admin/DashboardView.vue"),
  },
  {
    meta: {
      title: "Moja praksa",
      requiresAuth: false,
      requiresAdmin: false,
    },
    path: "/moja-praksa",
    name: "moja-praksa",
    component: () => import("@/views/student/MyInternshipView.vue"),
  },
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import("@/views/common/FormsView.vue"),
  },
  {
    meta: {
      title: "Korisnički profil",
      requiresAuth: true,
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/common/ProfileView.vue"),
  },
  {
    meta: {
      title: "Prijava",
      requiresAuth: false,
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/common/LoginView.vue"),
  },
  {
    meta: {
      title: "Registracija",
      requiresAuth: false,
    },
    path: "/register",
    name: "register",
    component: () => import("@/views/common/RegisterView.vue"),
  },
  {
    meta: {
      title: "BPMN - Models",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/bpmn/models",
    name: "bpmn-models",
    component: () => import("@/views/admin/bpmn/ModelsView.vue"),
  },
  {
    meta: {
      title: "BPMN - Microservices",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/bpmn/microservices",
    name: "bpmn-microservices",
    component: () => import("@/views/admin/bpmn/MicroservicesView.vue"),
  },
  {
    meta: {
      title: "BPMN - Modeler",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/bpmn/modeler",
    name: "bpmn-modeler",
    component: () => import("@/views/admin/bpmn/ModelerView.vue"),
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/common/TablesView.vue"),
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
  const userAuthenticated = mainStore.userAuthenticated;
  const userAdmin = mainStore.userAdmin;

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  // If route requires authentication and user is not authenticated
  if (requiresAuth && !userAuthenticated) {
    return next("/login");
  }

  // If route requires admin role but user isn't admin
  if (requiresAdmin && !userAdmin) {
    return next("/moja-praksa");
  }

  // If user is trying to access login page but is already authenticated
  if (to.path === "/login" && userAuthenticated) {
    // Send admins to the dashboard, others to "moja-praksa"
    return next(userAdmin ? "/dashboard" : "/moja-praksa");
  }

  // For any other case, simply proceed
  next();
});

export default router;
