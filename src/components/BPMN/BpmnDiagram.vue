<template>
  <div ref="canvas" class="bpmn-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import BpmnViewer from "bpmn-js";
import { adminStore } from "@/main";
import { UserTaskMappings, SendTaskMappings } from "@/helpers/maps";

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
const emit = defineEmits([
  "currentTaskModal",
  "pastTaskModal",
  "sendTaskModal",
]);

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
    handleError(err);
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
  const highlightableTypes = [
    "bpmn:UserTask",
    "bpmn:ServiceTask",
    "bpmn:SendTask",
    "bpmn:ManualTask",
    "bpmn:ExclusiveGateway",
    "bpmn:ParallelGateway",
    "bpmn:InclusiveGateway",
    "bpmn:EventBasedGateway",
  ];
  return highlightableTypes.includes(elementType);
}

function handleElementHover(event, canvasElement) {
  const element = event.element;

  if (isHighlightableElement(element.type)) {
    const taskOrder = getUserTaskOrder(element.id);

    // Checking for 'evaluacija_poslodavac' task remains unchanged
    if (
      element.id === "evaluacija_poslodavac" &&
      taskOrder === props.currentOrder
    ) {
      canvasElement.style.cursor = "not-allowed";
      return;
    }

    // Check if the task is 'ServiceTask' or if it's a future task
    if (
      element.type === "bpmn:ServiceTask" ||
      element.type === "bpmn:ParallelGateway" ||
      element.type === "bpmn:ExclusiveGateway" ||
      taskOrder > props.currentOrder
    ) {
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
  console.log("%cBPMNDiagram.vue: Element clicked:", "color: red;", element);
  if (element.type === "bpmn:SendTask") {
    const sendTask = getSendTask(element.id);
    console.log("transversedSendTasks", transversedSendTasks.value);
    console.log("sendTask", sendTask);
    if (transversedSendTasks.value.includes(sendTask._id)) {
      emitFunction("sendTaskModal", element);
      adminStore.bpmn_diagram.clicked_task_id = element.id;

      return;
    }
  }
  if (element) {
    // Fetch the path from the start to the current task
    const elementRegistry = viewer.get("elementRegistry");
    const startEvents = elementRegistry.filter(
      (el) => el.type === "bpmn:StartEvent"
    );
    let pathToCurrent = [];
    startEvents.forEach((startElement) => {
      const path = traverseFromStartToCurrent(
        startElement,
        element.id,
        elementRegistry
      );
      if (path.length > 0) {
        pathToCurrent = path;
      }
    });

    if (element.type === "bpmn:UserTask") {
      const taskOrder = getUserTaskOrder(element.id);

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
}

function getUserTaskOrder(taskId) {
  const task = UserTaskMappings.tasks.find((task) => task._id === taskId);
  return task ? task.order : -1;
}

function getSendTask(taskId) {
  const task = SendTaskMappings.tasks.find((task) => task._id === taskId);
  return task;
}

function traverseFromStartToCurrent(
  startElement,
  currentTaskId,
  elementRegistry,
  visited = new Set(),
  path = []
) {
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
    const newPath = traverseFromStartToCurrent(
      targetElement,
      currentTaskId,
      elementRegistry,
      visited,
      [...path, startElement, connection]
    );
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
  const startEvents = elementRegistry.filter(
    (element) => element.type === "bpmn:StartEvent"
  );

  let directPath = [];
  startEvents.forEach((startElement) => {
    directPath = traverseFromStartToCurrent(
      startElement,
      highlightElementId,
      elementRegistry
    );
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

  // Animate the highlighting in order
  directPath.forEach((element, index) => {
    setTimeout(() => {
      if (element.id !== highlightElementId) {
        applyHighlight(element, "highlight-previous");
      } else {
        applyHighlight(element, "highlight");
      }
    }, 0.025 * 1000 * index);
  });

  // Add styles
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
