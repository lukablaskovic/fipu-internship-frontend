const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const ts = require('typescript');
const { transformSync } = require('esbuild');
const { reactive, ref, computed } = require('vue');

// Execute the real handlers without mounting their layouts or calling live APIs.
function declaration(path, name) {
	const source = readFileSync(path, 'utf8').match(/<script setup>([\s\S]*?)<\/script>/)[1];
	const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
	for (const node of ast.statements) {
		if (ts.isFunctionDeclaration(node) && node.name.text === name) return node.getText(ast);
		if (ts.isVariableStatement(node) && node.declarationList.declarations.some((item) => item.name.text === name)) return node.getText(ast);
	}
	throw new Error(`Missing handler ${name} in ${path}`);
}
function handler(path, name, env) {
	return new Function(...Object.keys(env), `${declaration(path, name)}; return ${name};`)(...Object.values(env));
}
const cases = [
	['src/components/Tables/TableAssignments.vue', 'confirmTaskAction', 'handleTask'],
	['src/components/Tables/TableNewCompanies.vue', 'saveUpdatedCompany', 'saveUpdatedCompany'],
	['src/views/admin/StudentsInternshipView.vue', 'handleNewInstance', 'handleNewInstance'],
	['src/views/EvaluationView.vue', 'handleNewInstance', 'handleNewInstance'],
	['src/views/NewAssignmentFormPublic.vue', 'onSubmit', 'submitNewInternshipProject'],
	['src/views/common/SelectProcess.vue', 'onSubmit', 'createInternshipInstance'],
	['src/components/Internship/Student_ChooseAvailableAssignments.vue', 'registerPreferences', 'registerPreferences'],
	['src/components/Internship/Model_B/Model_B_Student_DirectApplication.vue', 'directApplication', 'direct_application_B'],
	['src/components/Internship/Student_PrijavnicaForm.vue', 'submit_application_form', 'submitApplicationForm'],
	['src/components/Internship/Student_DnevnikPrakseForm.vue', 'submit_diary_form', 'submitDiaryForm'],
];
function fixture() {
	let resolve, reject;
	const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
	const calls = { mutations: 0, refreshes: 0, resets: 0, messages: [], navigations: [] };
	let refreshFails = false;
	const refresh = async () => { calls.refreshes++; if (refreshFails) throw new Error('offline'); return true; };
	const mutate = () => { calls.mutations++; return promise; };
	const instance = { id: 'instance', pending: ['task'], variables: {} };
	const student = { process_instance_id: 'instance', process_instance_data: instance };
	const mainStore = { userAuthenticated: true, currentUser: { internship_process: { id: 'instance' } } };
	const adminStore = { students: [student], setSelectedStudent(value) { this.selectedStudent = value; }, getStudents: refresh };
	const studentStore = { student_process_instance_data: instance, getPendingUserTask: refresh };
	for (const store of [mainStore, adminStore, studentStore]) {
		for (const [, , method] of cases) store[method] = mutate;
	}
	const env = {
		mainStore, adminStore, studentStore, submitNewInternshipProject: mutate, selectedStudent: ref(student),
		snackBarStore: { pushMessage: (...message) => calls.messages.push(message) },
		UserTaskMappings: { getTaskProperty: (_, property) => property === 'snackbar_msg' ? 'Saved' : 'success' },
		currentStep: ref(3), steps: [{}, {}, {}],
		isLoading: ref(false), isSubmitting: ref(false), disabledCondition: ref(false),
		confirmationModal: ref({ isActive: true, action: 'accept', assignment: { id_zadatak: 'assignment' } }),
		selectedCompany: ref(1), companyForms: ref({ 1: { naziv: 'Company' } }),
		form: { input: 'keep this', potvrda_attachment: { size: 1, type: "application/pdf" }, dnevnik_attachment: { size: 1, type: "application/pdf" }, prijavljen_rok: 'today', nastavak_radnog_odnosa: false },
		v$: ref({ $touch() {}, $reset() {}, $invalid: false, $validate: async () => true }),
		checkedAssignments: ref([{ id_zadatak: 1 }, { id_zadatak: 2 }, { id_zadatak: 3 }]), napomena: ref('note'),
		prviOdabirDetails: ref({ id_zadatak: 1 }), process_instance_data: ref(instance),
		process_instance_id: ref('instance'), instanceInfo: ref(instance), formDynamicValues: ref({}),
		fixedUserData: { ime_prezime: 'Student', email: 'student@example.test' }, selectedProcess: ref('A'),
		refreshAssignments: refresh, refreshCompanies: refresh,
		resetForm() { calls.resets++; },
		router: { push: async (path) => { calls.navigations.push(path); } },
	};
	return { env, calls, resolve, reject, failRefresh: () => { refreshFails = true; } };
}
async function checkHandlers() {
	for (const [path, name] of cases) {
		for (const outcome of ['success', 'null', 'reject']) {
			const f = fixture();
			const action = handler(path, name, f.env);
			const pending = action();
			await Promise.resolve(); // company validation is asynchronous too
			assert.equal(f.calls.mutations, 1, `${path}: mutation starts once`);
			await action(); // a second click while pending must not submit again
			assert.equal(f.calls.mutations, 1, `${path}: duplicate click ignored`);
			assert.deepEqual(f.calls.messages, [], `${path}: no premature message`);
			assert.equal(f.calls.refreshes, 0, `${path}: no premature refresh`);
			assert.deepEqual(f.calls.navigations, [], `${path}: no premature navigation`);
			if (outcome === 'reject') f.reject(new Error('offline'));
			else f.resolve(outcome === 'success' ? { status: 'OK' } : null);
			await pending;
			assert.equal(f.env.isLoading.value || f.env.isSubmitting.value, false, `${path}: loading clears`);
			assert.equal(f.calls.messages[0][1], outcome === 'success' ? 'success' : 'danger', `${path}: accurate result`);
			if (outcome !== 'success') {
				assert.equal(f.calls.refreshes, 0, `${path}: failed mutations do not refresh`);
				assert.deepEqual(f.calls.navigations, [], `${path}: failures stay on the form`);
				assert.equal(f.calls.resets, 0);
				assert.equal(f.env.form.input, 'keep this');
			} else {
				assert.equal(f.calls.refreshes + f.calls.navigations.length, 1, `${path}: refresh or navigate after saving`);
			}
		}
		if (!['src/views/EvaluationView.vue', 'src/views/common/SelectProcess.vue'].includes(path)) {
			const f = fixture(); f.failRefresh();
			const pending = handler(path, name, f.env)();
			f.resolve({ status: 'OK' }); await pending;
			assert.equal(f.calls.messages.at(-1)[1], 'danger');
			assert.match(f.calls.messages.at(-1)[0], /spremljen|prijavljen/, `${path}: distinguishes saved data from failed refresh`);
		}
	}
}
function storeOptions(path, imports) {
	const source = readFileSync(path, 'utf8');
	const { code } = transformSync(source, { loader: 'ts', format: 'cjs' });
	const module = { exports: {} };
	new Function('require', 'module', 'exports', 'sessionStorage', code)((name) => name === 'pinia' ? { defineStore: (_, options) => options } : name === '@/helpers/persist-session' ? { persistSession: () => ({}) } : imports[name] || {}, module, module.exports, {});
	return Object.values(module.exports)[0];
}
async function checkStoreAndRendering() {
	const mainStore = { currentUser: { internship_process: { id: 'instance', pending_user_task: 'diary' } } };
	const calls = [];
	let uploadResult = null;
	const options = storeOptions('src/stores/student_store.ts', {
		'@/stores/main_store': { useMainStore: () => mainStore },
		'@/services/bpmn_engine_api': { ProcessInstance: { handleNewInstance: async () => { calls.push('advance'); return { status: 'OK' }; } } },
		'@/services/baserow_client_api': { Student: {
			storeDnevnik: async () => { calls.push('diary'); return uploadResult; },
			storeIspunjenaPotvrda: async () => { calls.push('certificate'); return uploadResult; },
		} },
	});
	const store = reactive({ ...options.state(), ...options.actions });
	store.student_process_instance_data = { variables: { id_dnevnik_prakse: 1 }, pending: ['diary'] };
	assert.equal(await store.submitDiaryForm({}), null);
	assert.deepEqual(calls, ['diary'], 'failed upload never advances the workflow');
	calls.length = 0; uploadResult = {};
	assert.equal((await store.submitDiaryForm({})).handleNewInstance.status, 'OK');
	assert.deepEqual(calls, ['diary', 'certificate', 'advance']);
	store.getInstanceInfo = async () => { store.student_process_instance_data = { pending: [], state: 'finished' }; return store.student_process_instance_data; };
	const line = declaration('src/views/student/MyInternshipView.vue', 'pendingProcessTask');
	const pendingTask = new Function('computed', 'studentStore', `${line}; return pendingProcessTask;`)(computed, store);
	assert.equal(pendingTask.value, 'diary');
	assert.equal(await store.getPendingUserTask(1), null);
	assert.equal(mainStore.currentUser.internship_process.pending_user_task, null, 'completion clears the previous pending task');
	assert.equal(pendingTask.value, undefined, 'the rendered task follows refreshed state');
	store.getInstanceInfo = async () => null;
	await assert.rejects(store.getPendingUserTask(1), /could not be fetched/);
	let companyResponse = { data: { results: [] } };
	let linked = false;
	const main = storeOptions('src/stores/main_store.ts', {
		'@/services/baserow_client_api': {
			Guest: { fetchCompanies: async () => companyResponse },
			Student: { setProcessData: async () => { linked = true; } },
		},
		'@/services/bpmn_engine_api': { ProcessInstance: { create: async () => ({ status: 500 }) } },
	}).actions;
	assert.deepEqual(await main.fetchCompanies('', true), [], 'an empty company list is valid');
	companyResponse = null;
	await assert.rejects(main.fetchCompanies('', true), /could not be fetched/, 'a failed refresh is not an empty list');
	assert.equal(await main.createInternshipInstance(), null);
	assert.equal(linked, false, 'a failed engine request must not link an undefined process ID');
}
(async () => {
	await checkHandlers();
	await checkStoreAndRendering();
	console.log('Awaited-update checks passed for 10 handlers, failed refreshes, diary uploads, and reactive process completion.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
