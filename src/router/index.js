import { createRouter, createWebHistory } from "vue-router";
import { mainStore, layoutStore } from "@/main.js";

import { routes } from "./routes.js";

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

	if (!mainStore.servicesUp && to.name !== "ErrorView") {
		return next({ name: "ErrorView" });
	} else if (mainStore.servicesUp && to.name === "ErrorView") {
		return next({ name: "root" });
	}

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

export { router };
