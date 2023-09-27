<template>
  <div ref="canvas" class="bpmn-container"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BpmnViewer from "bpmn-js";
import { adminStore } from "@/main";
import { UserTaskMappings } from "@/helpers/maps";

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
const emit = defineEmits(["currentTaskModal", "pastTaskModal"]);

onMounted(async () => {
  const viewer = initializeBpmnViewer(canvas.value);

  try {
    await importBpmnDiagram(viewer, props.xml);
    setupEventListeners(viewer);
    applyCustomStyling(props.highlightColor, props.highlightElementId, viewer);
  } catch (err) {
    handleError(err);
  }
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
    handleElementClick(event, emit);
  });
}

function handleElementHover(event, canvasElement) {
  const element = event.element;

  if (element && element.type === "bpmn:UserTask") {
    const taskOrder = getTaskOrder(element.id);

    // If the task is 'evaluacija_poslodavac' and it's the current task
    if (
      element.id === "evaluacija_poslodavac" &&
      taskOrder === props.currentOrder
    ) {
      canvasElement.style.cursor = "not-allowed";
      return;
    }

    if (taskOrder === props.currentOrder || taskOrder < props.currentOrder) {
      canvasElement.style.cursor = "pointer";
    } else {
      canvasElement.style.cursor = "not-allowed";
    }
  } else {
    canvasElement.style.cursor = "default";
  }
}

function handleElementClick(event, emitFunction) {
  const element = event.element;
  console.log("%cBPMNDiagram.vue: Element clicked:", "color: red;", element);

  if (element && element.type === "bpmn:UserTask") {
    const taskOrder = getTaskOrder(element.id);

    // Check if the task is 'evaluacija_poslodavac' and if it's the current task
    if (
      element.id === "evaluacija_poslodavac" &&
      taskOrder === props.currentOrder
    ) {
      console.log(
        "%cBPMNDiagram.vue: 'evaluacija_poslodavac' is the current task. Not clickable.",
        "color: red;"
      );
      return;
    }

    adminStore.bpmn_diagram.clicked_task_id = element.id;

    if (taskOrder === props.currentOrder) {
      console.log(
        "%cBPMNDiagram.vue: Emitting currentTaskModal",
        "color: red;"
      );
      emitFunction("currentTaskModal", element);
    } else if (taskOrder < props.currentOrder) {
      console.log("%cBPMNDiagram.vue: Emitting pastTaskModal", "color: red;");
      emitFunction("pastTaskModal", element);
    } else {
      console.log(
        "%cBPMNDiagram.vue: Task in the future. Not clickable.",
        "color: red;"
      );
    }
  }
}

function getTaskOrder(taskId) {
  const task = UserTaskMappings.tasks.find((task) => task._id === taskId);
  return task ? task.order : -1;
}

function applyCustomStyling(highlightColor, highlightElementId, viewer) {
  const canvasInstance = viewer.get("canvas");
  canvasInstance.zoom("fit-viewport");
  canvasInstance.viewbox();

  // Highlight specific element if provided
  if (highlightElementId) {
    canvasInstance.addMarker(highlightElementId, "highlight");
  }

  // Highlight all previous user tasks in green except the current one
  const elements = viewer
    .get("elementRegistry")
    .filter((element) => element.type === "bpmn:UserTask");
  elements.forEach((element) => {
    const taskOrder = getTaskOrder(element.id);
    if (
      taskOrder < props.currentOrder ||
      (taskOrder === props.currentOrder && element.id !== highlightElementId)
    ) {
      canvasInstance.addMarker(element.id, "highlight-previous");
    }
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

function handleError(err) {
  console.log(
    "%cBPMNDiagram.vue: something went wrong!",
    "color: red;",
    err.warnings,
    err.message
  );
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
</style>
