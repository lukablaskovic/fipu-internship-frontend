import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, ref } from "vue";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const routes = runInNewContext(read("../src/router/routes.js").replace("export { routes };", "routes;"));
const route = routes.find(route => route.path === "/moj-odabir");
assert.equal(route.meta.requiresAuth, true);
assert.equal(route.meta.requiresAdmin, true);
assert.match(read("../src/views/admin/AvailableAssignments.vue"), /to="\/moj-odabir"/);

const source = read("../src/components/Internship/Student_ChooseAvailableAssignments.vue");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
let submissions = 0;
const mainStore = { userAuthenticated: true, userAdmin: true, currentUser: { internship_process: { id: "test" } } };
const page = runInNewContext(`${script}\n({ registerPreferences })`, {
	ref, computed, watch: () => {},
	useMainStore: () => mainStore,
	useStudentStore: () => ({ registerPreferences: async () => { submissions++; return { status: "OK" }; }, getPendingUserTask: async () => {} }),
	useSnackBarStore: () => ({ pushMessage: () => {} }),
	useCompanyLogos: () => ({ getCompanyLogo: () => "" }),
	window: { matchMedia: () => ({ matches: false }) },
});
await page.registerPreferences();
assert.equal(submissions, 0, "Admins cannot submit preview selections");
mainStore.userAdmin = false;
await page.registerPreferences();
assert.equal(submissions, 1, "Student submission still works");
assert.match(source, /v-if="isDraggableEnabled && !mainStore.userAdmin"/);
assert.match(source, /<CardBoxModal v-if="!mainStore.userAdmin" v-model="modalConfirmPreferences"/);
console.log("Admin preview route, navigation, submission guard and student submission passed.");
