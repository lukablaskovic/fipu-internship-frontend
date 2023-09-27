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
      title: "Studenti",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/studenti/:process_instance_id",
    name: "student",
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
      title: "Alokacije",
      requiresAuth: true,
      requiresAdmin: false,
    },
    path: "/alokacije",
    name: "alokacije",
    component: () => import("@/views/student/AllocationsView.vue"),
  },
  {
    meta: {
      title: "Dostupni zadaci",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/dostupni-zadaci",
    name: "dostupni-zadaci",
    component: () => import("@/views/admin/AvailableAssignmentsView.vue"),
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
      transition: "login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/common/LoginView.vue"),
  },
  {
    meta: {
      title: "Registracija",
      requiresAuth: false,
      transition: "register",
    },
    path: "/register",
    name: "register",
    component: () => import("@/views/common/RegisterView.vue"),
  },
  {
    meta: {
      title: "BPMN - Procesi",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/bpmn/models",
    name: "bpmn-models",
    component: () => import("@/views/admin/bpmn/ModelsView.vue"),
  },
  {
    meta: {
      title: "BPMN - Mikroservisi",
      requiresAuth: true,
      requiresAdmin: true,
    },
    path: "/bpmn/microservices",
    name: "bpmn-microservices",
    component: () => import("@/views/admin/bpmn/MicroservicesView.vue"),
  },

  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/common/TablesView.vue"),
  },
  {
    meta: {
      title: "Evaluacija studenta",
      requiresAuth: false,
      requiresAdmin: false,
    },
    path: "/evaluacija/:process_instance_id",
    name: "evaluacija",
    component: () => import("@/views/EvaluationView.vue"),
  },
];

export { routes };
