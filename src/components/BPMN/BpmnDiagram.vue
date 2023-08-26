<template>
  <div ref="canvas" class="bpmn-container"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BpmnViewer from "bpmn-js";

const props = defineProps({
  xml: {
    type: String,
    required: true,
  },
  highlightColor: {
    type: String,
    default: "#79d4f2",
  },
  highlightElementId: {
    type: String,
    default: "",
  },
});

const canvas = ref(null);
const emit = defineEmits(["openModal"]);

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
  console.log("success !", result.warnings);
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
  canvasElement.style.cursor =
    element && element.type === "bpmn:UserTask" ? "pointer" : "default";
}

function handleElementClick(event, emitFunction) {
  const element = event.element;
  console.log("Element clicked:", element);

  if (element && element.type === "bpmn:UserTask") {
    console.log("Emitting openModal");
    emitFunction("openModal", element);
  }
}

function applyCustomStyling(highlightColor, highlightElementId, viewer) {
  const canvasInstance = viewer.get("canvas");
  canvasInstance.zoom("fit-viewport");

  if (highlightElementId) {
    canvasInstance.addMarker(highlightElementId, "highlight");
  }

  const style = document.createElement("style");
  style.innerHTML = `
    .highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
      fill: ${highlightColor} !important;
    }
  `;
  document.head.appendChild(style);
}

function handleError(err) {
  console.log("something went wrong:", err.warnings, err.message);
}
</script>

<style scoped>
.bpmn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 100%;
}
</style>
