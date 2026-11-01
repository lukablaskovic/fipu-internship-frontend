const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
	const source = fs.readFileSync(path.join(__dirname, "../src/helpers/bpmn-state.js"), "utf8");
	const { pathToTask, taskAction } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
	const model = {
		nodes: [{ id: "start", type: "startEvent" }, { id: "mail", type: "sendTask" }, { id: "current", type: "userTask" }],
		flows: [{ sourceRef: "start", targetRef: "mail" }, { sourceRef: "mail", targetRef: "start" }, { sourceRef: "mail", targetRef: "current" }],
	};
	assert.deepEqual(pathToTask(model, "current"), ["start", "mail", "current"]);
	assert.deepEqual(pathToTask(model, "missing"), []);
	const tasks = [{ _id: "current", order: 2 }, { _id: "past", order: 1 }, { _id: "future", order: 3 }, { _id: "evaluacija_poslodavac", order: 2 }];
	assert.equal(taskAction(model.nodes[1], 2, tasks, ["mail"]), "sendTaskModal");
	assert.equal(taskAction(model.nodes[1], 2, tasks, []), null);
	for (const [id, expected] of [["current", "currentTaskModal"], ["past", "pastTaskModal"], ["future", null], ["unknown", null], ["evaluacija_poslodavac", null]]) {
		assert.equal(taskAction({ id, type: "userTask" }, 2, tasks, []), expected);
	}
	assert.equal(taskAction({ id: "current", type: "serviceTask" }, 2, tasks, []), null);
	console.log("BPMN path and modal interaction checks passed.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
