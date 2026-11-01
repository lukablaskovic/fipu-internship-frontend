const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { transformSync } = require('esbuild');
const { createApp, nextTick } = require('vue');
const { createPinia } = require('pinia');
const persisted = require('pinia-plugin-persistedstate').default;

const values = new Map([
 ['main', JSON.stringify({ currentUser: { email: 'student@example.test' }, academicYear: 'old', checkedAssignments: [1], logoutModalActive: true })],
 ['admin', JSON.stringify({ students: [{ email: 'old@example.test' }], selectedStudent: { email: 'old@example.test' }, bpmn_diagram: { clicked_task_id: 'old' }, filterModelState: 'B' })],
 ['student', JSON.stringify({ student_process_instance_data: { id: 'old-instance' }, allocated_assignment: { id: 9 } })],
 ['layout', JSON.stringify({ isAsideLgActive: false, isAsideMobileExpanded: true, isLg: false })],
]);
const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
const removed = [];
const pinia = createPinia();
pinia.use(persisted);
createApp({}).use(pinia);
function load(file) {
 const source = readFileSync(`src/stores/${file}_store.ts`, 'utf8');
 const module = { exports: {} };
 const dependency = name => {
  if (name === 'pinia') return require('pinia');
  if (name === '@/helpers/persist-session') {
   const helper = { exports: {} };
   new Function('module', 'exports', 'sessionStorage', transformSync(readFileSync('src/helpers/persist-session.ts', 'utf8'), { loader: 'ts', format: 'cjs' }).code)(helper, helper.exports, storage);
   return helper.exports;
  }
  if (name === '@/services/bpmn_engine_api') return { ProcessInstance: { removeInstance: async id => { removed.push(id); return { status: 'OK' }; } } };
  if (name === '@/services/baserow_client_api') return { Admin: { completeInstanceRemoval: async () => ({ status: 'OK' }) } };
  if (name === '@/stores/snackbar_store') return { useSnackBarStore: () => ({ pushMessage() {} }) };
  if (name === '@/models/CurrentUser') return { CurrentUser: class {} };
  if (name === '@/config') return { appConfig: { admin_emails: [] } };
  return {};
 };
 new Function('require', 'module', 'exports', 'sessionStorage', 'window', transformSync(source, { loader: 'ts', format: 'cjs' }).code)(dependency, module, module.exports, storage, { innerWidth: 1280 });
 return Object.values(module.exports)[0](pinia);
}
(async () => {
 const main = load('main');
 assert.equal(main.currentUser.email, 'student@example.test');
 assert.equal('checkedAssignments' in main.$state, false);
 assert.equal('academicYear' in main.$state, false);
 assert.equal('logoutModalActive' in main.$state, false);
 const admin = load('admin');
 assert.deepEqual(admin.students, []);
 assert.equal(admin.filterModelState, 'B');
 assert.equal('selectedStudent' in admin.$state, false);
 assert.equal('bpmn_diagram' in admin.$state, false);
 assert.equal(await admin.removeInstanceData(null), false);
 assert.deepEqual(removed, []);
 assert.equal(await admin.removeInstanceData({ process_instance_id: 'chosen-instance', process_instance_data: { variables: {} } }), true);
 assert.deepEqual(removed, ['chosen-instance'], 'deletion uses the explicitly supplied student');
 const student = load('student');
 assert.deepEqual(student.student_process_instance_data, {});
 assert.equal(student.allocated_assignment, null);
 const ui = load('ui');
 assert.equal(ui.isAsideLgActive, false);
 assert.equal(ui.isAsideMobileExpanded, false);
 ui.responsiveLayoutControl();
 assert.equal(ui.isLg, true);
 main.maintenanceMode = true;
 await nextTick();
 assert.deepEqual(JSON.parse(values.get('layout')), { isAsideLgActive: false });
 assert.deepEqual(Object.keys(JSON.parse(values.get('main'))).sort(), ['currentUser', 'maintenanceMode']);
 console.log('Store hydration preserves preferences and excludes stale process data and page state.');
})().catch(error => { console.error(error); process.exitCode = 1; });
