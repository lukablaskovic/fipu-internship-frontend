<template>
  <aside
    id="aside"
    class="lg:py-2 lg:pl-2 w-60 fixed flex z-40 top-0 h-screen transition-position overflow-hidden"
  >
    <div
      :class="styleStore.asideStyle"
      class="lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900"
    >
      <div
        :class="styleStore.asideBrandStyle"
        class="flex flex-row h-14 items-center justify-between dark:bg-slate-900"
      >
        <div>
          <img
            src="fipu_hr.png"
            alt=""
            class="w-full max-h-12 object-contain mr-2"
          />
        </div>
        <div
          class="text-center flex-1 lg:text-left lg:pl-6 xl:text-center xl:pl-0"
        >
          <b class="font-black"> Internship Dashboard</b>
        </div>

        <button
          class="hidden lg:inline-block xl:hidden p-3"
          @click.prevent="asideLgCloseClick"
        >
          <BaseIcon :path="mdiClose" />
        </button>
      </div>

      <div
        :class="
          styleStore.darkMode
            ? 'aside-scrollbars-[slate]'
            : styleStore.asideScrollbarsStyle
        "
        class="flex-1 overflow-y-auto overflow-x-hidden"
      >
        <AsideMenuList :menu="menu" @menu-click="menuClick" />
      </div>

      <ul v-if="userAuthenticated">
        <AsideMenuItem :item="logoutItem" @menu-click="menuClick" />
      </ul>
      <ul v-else>
        <AsideMenuItem :item="loginItem" @menu-click="menuClick" />
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { mdiLogout, mdiLogin, mdiClose } from "@mdi/js";
import { computed } from "vue";
import { useStyleStore } from "@/stores/style.js";
import { useMainStore } from "@/stores/main";
import AsideMenuList from "@/components/AsideMenuList.vue";
import AsideMenuItem from "@/components/AsideMenuItem.vue";
import BaseIcon from "@/components/BaseIcon.vue";

import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  menu: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["menu-click", "aside-lg-close-click"]);

const styleStore = useStyleStore();
const mainStore = useMainStore();

const userAuthenticated = computed(() => mainStore.userAuthenticated);

const logoutItem = computed(() => ({
  label: "Odjava",
  icon: mdiLogout,
  color: "info",
  logoutModalActive: true,
}));

const loginItem = computed(() => ({
  label: "Prijava",
  icon: mdiLogin,
  color: "info",
}));

const menuClick = (event, item) => {
  if (item.logoutModalActive) {
    mainStore.activateLogoutModal(true);
    return;
  }
  if (item.label == "Prijava") {
    router.push("/login");
    return;
  }

  emit("menu-click", event, item);
};

const asideLgCloseClick = (event) => {
  emit("aside-lg-close-click", event);
};
</script>
