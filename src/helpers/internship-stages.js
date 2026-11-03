import { UserTaskMappings } from "@/helpers/maps";

// Task components import this helper through the layout, so defer reading their mappings.
export function getInternshipStages() {
	return [...UserTaskMappings.tasks]
		.sort((a, b) => a.order - b.order)
		.map((task) => task.name)
		.concat("Nepoznata faza");
}

export function getInternshipStage(student) {
	const process = student.process_instance_data;
	const stage = UserTaskMappings.getTaskProperty(process?.pending?.[0], "name", process?.state);
	return getInternshipStages().includes(stage) ? stage : "Nepoznata faza";
}

export function getInternshipProgress(model, process) {
	if (!["A", "B"].includes(model)) return null;
	const stages = UserTaskMappings.tasks
		.filter((task) => task.order > 0 && task._id !== "end_event_student" && (task.model_type === model || (model === "B" && task.order >= 4)))
		.sort((a, b) => a.order - b.order);
	const currentIndex = process.state === "finished" ? -1 : stages.findIndex((task) => process.pending?.includes(task._id));
	const completed = process.state === "finished" ? stages.length : currentIndex;
	return { stages, currentIndex, completed, value: completed < 0 ? null : Math.round(completed / stages.length * 100) };
}

export function countInternshipStages(students, model) {
	const counts = new Map(getInternshipStages().map((stage) => [stage, 0]));
	const seen = new Set();
	for (const student of students) {
		if (!student.process_instance_id || seen.has(student.process_instance_id) || (model !== "AB" && student.Model_prakse?.value !== model)) continue;
		seen.add(student.process_instance_id);
		const stage = getInternshipStage(student);
		counts.set(stage, counts.get(stage) + 1);
	}
	return [...counts].filter(([, count]) => count > 0).map(([stage, count]) => ({ stage, count }));
}
