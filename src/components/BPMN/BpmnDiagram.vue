<template>
	<div ref="canvas" class="bpmn-container"></div>
</template>

<script setup>
import { UserTaskMappings, SendTaskMappings } from "@/helpers/maps";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { adminStore, mainStore } from "@/main";
import BpmnViewer from "bpmn-js";

const props = defineProps({
	xml: {
		type: String,
		required: true,
	},
	highlightColor: {
		type: String,
		default: "#79d4f2", // fipu blue
	},
	highlightElementId: {
		type: String,
		default: "",
	},
	currentOrder: {
		type: Number,
		required: true,
	},
});

const canvas = ref(null);
const emit = defineEmits(["currentTaskModal", "pastTaskModal", "sendTaskModal"]);

function handleWindowResize(viewer) {
	viewer.get("canvas").zoom("fit-viewport");
}

const transversedSendTasks = ref([]);

onMounted(async () => {
	const viewer = initializeBpmnViewer(canvas.value);

	try {
		await importBpmnDiagram(viewer, props.xml);
		setupEventListeners(viewer);
		applyCustomStyling(props.highlightColor, props.highlightElementId, viewer);
		handleWindowResize(viewer);
		window.addEventListener("resize", () => handleWindowResize(viewer));
	} catch (err) {
		return null;
	}

	onBeforeUnmount(() => {
		window.removeEventListener("resize", () => handleWindowResize(viewer));
	});
});

function initializeBpmnViewer(container) {
	return new BpmnViewer({ container });
}

async function importBpmnDiagram(viewer, xml) {
	const result = await viewer.importXML(xml);
}

function setupEventListeners(viewer) {
	const eventBus = viewer.get("eventBus");

	eventBus.on("element.hover", (event) => {
		handleElementHover(event, canvas.value);
	});

	viewer.on("element.click", (event) => {
		handleElementClick(event, emit, viewer);
	});
}

function isHighlightableElement(elementType) {
	const highlightableTypes = ["bpmn:UserTask", "bpmn:ServiceTask", "bpmn:SendTask", "bpmn:ManualTask", "bpmn:ExclusiveGateway", "bpmn:ParallelGateway", "bpmn:InclusiveGateway", "bpmn:EventBasedGateway", "bpmn:EndEvent"];
	return highlightableTypes.includes(elementType);
}

function handleElementHover(event, canvasElement) {
	const element = event.element;
	if (isHighlightableElement(element.type)) {
		const taskOrder = getUserTaskOrder(element.id);

		if (element.id === "evaluacija_poslodavac" && taskOrder === props.currentOrder) {
			canvasElement.style.cursor = "not-allowed";
			return;
		}

		// Check if the task is 'ServiceTask' or if it's a future task
		if (element.type === "bpmn:ServiceTask" || element.type === "bpmn:ParallelGateway" || element.type === "bpmn:ExclusiveGateway" || taskOrder > props.currentOrder) {
			canvasElement.style.cursor = "not-allowed";
			return;
		}

		// If the task is current or past
		if (taskOrder === props.currentOrder || taskOrder < props.currentOrder) {
			canvasElement.style.cursor = "pointer";
		}
	} else {
		canvasElement.style.cursor = "default";
	}
}

function handleElementClick(event, emitFunction, viewer) {
	const element = event.element;
	if (element.type === "bpmn:SendTask") {
		const sendTask = getSendTask(element.id);

		if (transversedSendTasks.value.includes(sendTask._id)) {
			emitFunction("sendTaskModal", element);
			adminStore.bpmn_diagram.clicked_task_id = element.id;

			return;
		}
	}

	if (element) {
		// Fetch the path from the start to the current task
		const elementRegistry = viewer.get("elementRegistry");
		const startEvents = elementRegistry.filter((el) => el.type === "bpmn:StartEvent");
		let pathToCurrent = [];
		startEvents.forEach((startElement) => {
			const path = traverseFromStartToCurrent(startElement, element.id, elementRegistry);
			if (path.length > 0) {
				pathToCurrent = path;
			}
		});

		if (element.type === "bpmn:UserTask") {
			const taskOrder = getUserTaskOrder(element.id);

			// Check if the task is 'evaluacija_poslodavac' and if it's the current task
			if (element.id === "evaluacija_poslodavac" && taskOrder === props.currentOrder) {
				return;
			}

			adminStore.bpmn_diagram.clicked_task_id = element.id;

			if (taskOrder === props.currentOrder) {
				emitFunction("currentTaskModal", element);
			} else if (taskOrder < props.currentOrder) {
				emitFunction("pastTaskModal", element);
			}
		}
	}
}
function getUserTaskOrder(taskId) {
	const task = UserTaskMappings.tasks.find((task) => task._id === taskId);
	return task ? task.order : -1;
}

function getSendTask(taskId) {
	const task = SendTaskMappings.tasks.find((task) => task._id === taskId);
	return task;
}

function traverseFromStartToCurrent(startElement, currentTaskId, elementRegistry, visited = new Set(), path = []) {
	if (visited.has(startElement.id)) {
		return [];
	}
	visited.add(startElement.id);

	if (startElement.id === currentTaskId) {
		return [...path, startElement];
	}

	const outgoing = startElement.outgoing || [];
	for (let connection of outgoing) {
		const targetElement = elementRegistry.get(connection.target.id);
		const newPath = traverseFromStartToCurrent(targetElement, currentTaskId, elementRegistry, visited, [...path, startElement, connection]);
		if (newPath.length > 0) {
			return newPath;
		}
	}
	return [];
}

function applyCustomStyling(highlightColor, highlightElementId, viewer) {
	const canvasInstance = viewer.get("canvas");
	canvasInstance.zoom("fit-viewport");
	canvasInstance.viewbox();

	const elementRegistry = viewer.get("elementRegistry");
	const startEvents = elementRegistry.filter((element) => element.type === "bpmn:StartEvent");

	let directPath = [];
	startEvents.forEach((startElement) => {
		directPath = traverseFromStartToCurrent(startElement, highlightElementId, elementRegistry);
	});

	// Function to apply the highlight, given an element and a style
	function applyHighlight(element, styleClass) {
		if (element.type && isHighlightableElement(element.type)) {
			canvasInstance.addMarker(element.id, styleClass);

			// If the element is a SendTask, mark it as traversed
			if (element.type === "bpmn:SendTask") {
				const task = getSendTask(element.id);
				if (task && !transversedSendTasks.value.includes(task._id)) {
					transversedSendTasks.value.push(task._id);
				}
			}
		}
	}
	// must be tested
	// Animate the highlighting in order
	directPath.forEach((element, index) => {
		setTimeout(
			() => {
				if (element.id !== highlightElementId) {
					applyHighlight(element, "highlight-previous");
				} else {
					applyHighlight(element, "highlight");
				}

				// If the element is a Gateway, apply highlights to all outgoing connections
				if (element.type === "bpmn:ParallelGateway" || element.type === "bpmn:ExclusiveGateway") {
					const outgoing = element.outgoing || [];
					outgoing.forEach((connection) => {
						applyHighlight(connection.target, "highlight-previous");
					});
				}
			},
			0.025 * 1000 * index,
		);
	});

	const style = document.createElement("style");
	style.innerHTML = `
    .highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
      fill: ${highlightColor} !important;
    }
    .highlight-previous:not(.djs-connection) .djs-visual > :nth-child(1) {
      fill: #86efac !important;
    }
  `;
	document.head.appendChild(style);
}
</script>

<style scoped>
.bpmn-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 70vh;
	width: 100%;
	user-select: none;
}

@media (max-width: 600px) {
	.bpmn-container {
		height: 50vh;
	}
}
</style>
