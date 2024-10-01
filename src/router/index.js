import { createRouter, createWebHistory } from "vue-router";
import { mainStore, layoutStore } from "@/main.js";

import { routes } from "./routes.js";

function isTryingToAccess(path, restrictedRoutes) {
	return restrictedRoutes.includes(path);
}

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		return savedPosition || { top: 0 };
	},
});

router.beforeEach((to, from, next) => {
	const userAuthenticated = mainStore.userAuthenticated;
	const userAdmin = mainStore.userAdmin;
	layoutStore.tooltip.content = "";

	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
	const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
	console.log("to", to, "from", from, "next", next);

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
		console.log("...");
		return next("/dashboard");
	}

	// User without active instance trying to access '/moja-praksa'
	if (to.path === "/moja-praksa" && !mainStore.userHasActiveInstance && userAuthenticated) {
		return next("/odabir-procesa");
	}

	// Route requires admin privileges but user isn't an admin
	if (requiresAdmin && !userAdmin) {
		return next("/moja-praksa");
	}

	if (userAuthenticated && (to.path === "/prijava" || (to.path === "/odabir-procesa" && mainStore.userHasActiveInstance))) {
		console.log("....");
		return next(userAdmin ? "/dashboard" : "/moja-praksa");
	}

	// For any other case, simply proceed
	return next();
});

export { router };
