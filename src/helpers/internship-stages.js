import { UserTaskMappings } from "@/helpers/maps";

export const internshipStages = [...UserTaskMappings.tasks]
	.sort((a, b) => a.order - b.order)
	.map((task) => task.name)
	.concat("Nepoznata faza");

export function getInternshipStage(student) {
	const process = student.process_instance_data;
	const stage = UserTaskMappings.getTaskProperty(process?.pending?.[0], "name", process?.state);
	return internshipStages.includes(stage) ? stage : "Nepoznata faza";
}

export function countInternshipStages(students, model) {
	const counts = new Map(internshipStages.map((stage) => [stage, 0]));
	const seen = new Set();
	for (const student of students) {
		if (!student.process_instance_id || seen.has(student.process_instance_id) || (model !== "AB" && student.Model_prakse?.value !== model)) continue;
		seen.add(student.process_instance_id);
		const stage = getInternshipStage(student);
		counts.set(stage, counts.get(stage) + 1);
	}
	return [...counts].filter(([, count]) => count > 0).map(([stage, count]) => ({ stage, count }));
}
