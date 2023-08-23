<template>
  <div ref="canvas" class="bpmn-container"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BpmnViewer from "bpmn-js";

let props = defineProps({
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

onMounted(async () => {
  const viewer = new BpmnViewer({
    container: canvas.value,
  });
  try {
    const result = await viewer.importXML(props.xml);
    const { warnings } = result;

    console.log("success !", warnings);

    const canvasInstance = viewer.get("canvas");
    canvasInstance.zoom("fit-viewport");
  } catch (err) {
    const { warnings, message } = err;

    console.log("something went wrong:", warnings, message);
  }

  const canvasInstance = viewer.get("canvas");
  canvasInstance.zoom("fit-viewport");
  if (props.highlightElementId) {
    canvasInstance.addMarker(props.highlightElementId, "highlight");
  }
  // Dynamically add styles
  const style = document.createElement("style");
  style.innerHTML = `
    .highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
      fill: ${props.highlightColor} !important;
    }
  `;
  document.head.appendChild(style);
});
</script>

<style scoped>
div.bpmn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 100%;
}
</style>
