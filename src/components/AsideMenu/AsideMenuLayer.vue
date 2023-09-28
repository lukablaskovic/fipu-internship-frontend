<script setup>
import { mainStore, styleStore } from "@/main.js";
import AsideMenuList from "@/components/AsideMenu/AsideMenuList.vue";
import { useRouter } from "vue-router";

const router = useRouter();
defineProps({
  menu: {
    type: Array,
    default: () => [],
  },
  activeSecondaryMenuKey: {
    type: String,
    default: null,
  },
  zIndex: {
    type: String,
    default: "z-50",
  },
  isCompact: Boolean,
});

const emit = defineEmits(["menu-click"]);

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
</script>

<template>
    <aside id="aside" :class="zIndex" class="lg:py-2 lg:pl-2 flex fixed top-0 h-screen transition-position overflow-hidden">
        <div :class="styleStore.asideStyle" class="lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900">
            <div :class="styleStore.asideBrandStyle" class="flex flex-row w-full shrink-0 items-center dark:bg-slate-900">
                <slot />
            </div>
            <div :class="styleStore.asideScrollbarsStyle" class="flex-1 overflow-y-auto overflow-x-hidden" >
                <AsideMenuList :menu="menu" :is-compact="isCompact" :active-secondary-menu-key="activeSecondaryMenuKey" @menu-click="menuClick"/>
            </div>

            <slot name="footer" />
        </div>
    </aside>
</template>
