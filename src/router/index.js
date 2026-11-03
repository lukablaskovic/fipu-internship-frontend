import { createRouter, createWebHistory } from "vue-router";
import { useMainStore } from "@/stores/main_store";
import { useStudentStore } from "@/stores/student_store";
import { MAINTENANCE_MODE, DEV_MODE } from "@/config.js";

import { ProcessInstance } from "@/services/bpmn_engine_api";
import { routes } from "./routes.js";

function isTryingToAccess(path, restrictedRoutes) {
	return restrictedRoutes.includes(path);
}

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;
		if (to.path === from.path && to.hash === from.hash) return false;
		return { top: 0 };
	},
});

router.beforeEach(async (to, from, next) => {
	const mainStore = useMainStore();
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
	const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

	// Check if maintenance mode is enabled
	if (!DEV_MODE && (MAINTENANCE_MODE || mainStore.maintenanceMode) && to.path !== "/odrzavanje") {
		return next("/odrzavanje");
	}

	if (!mainStore.userAuthenticated && !["maintenance", "evaluacija"].includes(to.name) && sessionStorage.getItem("google-id-token")) {
		mainStore.userAuthenticated = await mainStore.fetchCurrentUser();
		if (!mainStore.userAuthenticated && to.path === "/moja-praksa") return next("/prijava");
	}
	const userAuthenticated = mainStore.userAuthenticated;
	const userAdmin = mainStore.userAdmin;

	// Handle redirection from root path
	if (to.path === "/") {
		if (userAuthenticated) {
			return next(userAdmin ? "/dashboard" : "/moja-praksa");
		} else {
			return next("/prijava");
		}
	}

	// If route requires authentication and user is not authenticated
	if (requiresAuth && !userAuthenticated && to.path !== "/prijava") {
		return next("/prijava");
	}

	// Admin user trying to access student routes
	let restrictedAdminRoutes = ["/moja-praksa", "/odabir-procesa", "/stanje-procesa"];
	if (userAdmin && isTryingToAccess(to.path, restrictedAdminRoutes)) {
		return next("/dashboard");
	}

	// User without active instance trying to access '/moja-praksa'
	if (to.path === "/moja-praksa" && !mainStore.currentUser.internship_process.id && userAuthenticated) {
		return next("/odabir-procesa");
	}

	// Route requires admin privileges but user isn't an admin
	if (requiresAdmin && !userAdmin) {
		return next("/moja-praksa");
	}

	if (to.name === "administratori" && !mainStore.canViewAdministrators) return next("/dashboard");

	const instanceId = mainStore.currentUser.internship_process.id;
	if (userAuthenticated && to.path === "/odabir-procesa" && instanceId) {
		const loaded = useStudentStore().student_process_instance_data;
		const closedStates = ["finished", "cancelled"];
		if (loaded.id === instanceId && closedStates.includes(loaded.state)) return next();
		const instance = await ProcessInstance.get(instanceId);
		if (!closedStates.includes(instance?.state)) return next("/moja-praksa");
	}
	if (userAuthenticated && to.path === "/prijava") {
		return next(userAdmin ? "/dashboard" : "/moja-praksa");
	}

	// For any other case, simply proceed
	return next();
});

export { router };
