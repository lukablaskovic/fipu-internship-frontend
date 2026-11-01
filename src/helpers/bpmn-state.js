// shortcut: infer history from a graph path, use persisted events when the API supplies them here.
export function pathToTask(model, taskId) {
	function visit(id, visited = new Set()) {
		if (visited.has(id)) return null;
		if (id === taskId) return [id];
		visited.add(id);
		for (const flow of model.flows.filter((item) => item.sourceRef === id)) {
			const path = visit(flow.targetRef, visited);
			if (path) return [id, ...path];
		}
		return null;
	}
	for (const start of model.nodes.filter((node) => node.type === "startEvent")) {
		const path = visit(start.id);
		if (path) return path;
	}
	return [];
}

export function taskAction(node, currentOrder, userTasks, completedSendIds) {
	if (node.type === "sendTask") return completedSendIds.includes(node.id) ? "sendTaskModal" : null;
	if (node.type !== "userTask") return null;
	const task = userTasks.find((item) => item._id === node.id);
	if (!task || (node.id === "evaluacija_poslodavac" && task.order === currentOrder)) return null;
	if (task.order === currentOrder) return "currentTaskModal";
	return task.order < currentOrder ? "pastTaskModal" : null;
}
