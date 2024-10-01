import { mainStore } from "@/main.js";

const routes = [
	{
		path: "/",
		name: "root",
		redirect: () => {
			if (mainStore.userAuthenticated) {
				return mainStore.userAdmin ? "/dashboard" : "/moja-praksa";
			}
			return "/prijava";
		},
	},
	{
		meta: {
			title: "Stanje procesa",
			requiresAuth: true,
			requiresAdmin: false,
		},
		path: "/stanje-procesa",
		name: "stanje-procesa",
		component: () => import("@/views/student/ProcessStateViewStudent.vue"),
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
			requiresAuth: false,
			requiresAdmin: false,
		},
		path: "/poslodavci",
		name: "poslodavci",
		component: () => import("@/views/common/CompaniesView.vue"),
	},
	{
		meta: {
			title: "Poslodavac",
			requiresAuth: true,
			requiresAdmin: true,
		},
		path: "/poslodavci/:naziv",
		name: "poslodavac",
		component: () => import("@/views/common/CompaniesView.vue"),
	},
	{
		meta: {
			title: "Alokacije",
			requiresAuth: true,
			requiresAdmin: true,
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
		component: () => import("@/views/admin/AvailableAssignments.vue"),
	},
	{
		meta: {
			title: "Zadatak",
			requiresAuth: true,
			requiresAdmin: true,
		},
		path: "/dostupni-zadaci/:id_zadatak",
		name: "zadatak",
		component: () => import("@/views/admin/AvailableAssignments.vue"),
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
		path: "/profil",
		name: "profil",
		component: () => import("@/views/common/ProfileView.vue"),
	},
	{
		meta: {
			title: "Prijava",
			requiresAuth: false,
			transition: "login",
		},
		path: "/prijava",
		name: "login",
		component: () => import("@/views/common/LoginView.vue"),
	},

	{
		meta: {
			title: "Odabir procesa",
			requiresAuth: true,
		},
		path: "/odabir-procesa",
		name: "odabir-procesa",
		component: () => import("@/views/common/SelectProcess.vue"),
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
	{
		meta: {
			title: "Dodavanje zadatka",
			requiresAuth: false,
			requiresAdmin: false,
		},
		path: "/poslodavci/novi-zadatak",
		name: "dodavanje zadatka",
		component: () => import("@/views/NewAssignmentFormPublic.vue"),
	},
	{
		path: "/error",
		name: "ErrorView",
		component: () => import("@/views/common/ErrorView.vue"),
	},
];

export { routes };
