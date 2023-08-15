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
});

const canvas = ref(null);

onMounted(() => {
  const viewer = new BpmnViewer({
    container: canvas.value,
  });

  viewer
    .importXML(props.xml)
    .then(function (result) {
      const { warnings } = result;

      console.log("success !", warnings);

      viewer.get("canvas").zoom("fit-viewport");
    })
    .catch(function (err) {
      const { warnings, message } = err;

      console.log("something went wrong:", warnings, message);
    });
});
</script>
<style scoped>
/* Home View's CSS or SCSS */
div.bpmn-container {
  display: flex;
  justify-content: center; /* centers horizontally */
  align-items: center; /* centers vertically */
  height: 50vh; /* adjust as needed, 100vh makes it full viewport height */
  width: 100%; /* adjust as needed */
}
</style>
