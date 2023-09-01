<script setup>
import { computed, ref, onMounted } from "vue";
import { Control } from "@/services/microservices_control";
import { mdiRefresh, mdiRestartAlert } from "@mdi/js";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";

const props = defineProps({
  checkable: Boolean,
  services: {
    type: Object,
    required: true,
  },
});

// Making a local reactive copy of services
const localServices = ref({ ...props.services });

async function checkServiceStatus(serviceName) {
  console.log("Checking service status:", serviceName);
  let result = await Control.checkServiceStatus(serviceName);

  // Update the local copy with the new service status
  localServices.value[serviceName] = result[serviceName];
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Naziv</th>
        <th>Status</th>
        <th>Poruka</th>
        <th>URL</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(service, serviceName) in localServices" :key="serviceName">
        <TableCheckboxCell v-if="checkable" />

        <td data-label="Naziv">
          {{ serviceName }}
        </td>
        <td data-label="Status">
          {{ service["status"] }}
        </td>
        <td data-label="Poruka">
          {{ service["message"] }}
        </td>
        <td data-label="URL">
          {{ service["url"] }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiRefresh"
              small
              @click="checkServiceStatus(serviceName)"
            />
            <BaseButton
              color="danger"
              :icon="mdiRestartAlert"
              small
              @click="isModalDangerActive = true"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
</template>
