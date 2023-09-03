<script setup>
import { ref } from "vue";
import { Control } from "@/services/microservices_control";
import { mdiRefresh, mdiRestartAlert } from "@mdi/js";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import SkeletonLoaderTable from "@/components/SkeletonLoaderTable.vue";

import moment from "@/moment-setup";

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
  localServices.value[serviceName].loading = true;

  try {
    let { [serviceName]: updatedService } = await Control.checkServiceStatus(
      serviceName
    );
    localServices.value[serviceName] = {
      ...localServices.value[serviceName],
      ...updatedService,
    };
  } finally {
    // Reset loading state after fetching data or if an error occurs
    localServices.value[serviceName].loading = false;
  }
}
</script>
<template>
  <table>
    <thead>
      <tr>
        <th v-if="checkable"></th>
        <th>Naziv</th>
        <th>Status</th>
        <th>Poruka</th>
        <th>URL</th>
        <th>Zadnja provjera</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(service, serviceName) in localServices">
        <!-- Display the skeleton loader when the service is loading -->
        <SkeletonLoaderTable
          v-if="service.loading"
          :key="'skeleton-' + serviceName"
          :checkable="checkable"
        />

        <!-- Display the actual row when the service isn't loading -->
        <tr v-else :key="serviceName">
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
          <td data-label="Zadnji put aktivan">
            {{ moment(service["status_check_timestamp"]).fromNow() }}
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton
                color="fipu_blue"
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
      </template>
    </tbody>
  </table>
</template>
