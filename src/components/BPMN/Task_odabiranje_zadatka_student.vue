<template>
  <TableRegisteredAssignments> </TableRegisteredAssignments>
</template>
<script setup>
import TableRegisteredAssignments from "@/components/Tables/TableRegisteredAssignments.vue";
const props = defineProps({
  variables: {
    type: Object,
    default: () => {},
  },
});
</script>
