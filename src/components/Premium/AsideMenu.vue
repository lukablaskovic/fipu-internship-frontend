<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useLayoutStore } from "@/stores/layout.js";
import {
  mdiClose,
  mdiChevronRightCircleOutline,
  mdiChevronLeftCircleOutline,
} from "@mdi/js";
import BaseIcon from "@/components/BaseIcon.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import AsideMenuLayer from "@/components/Premium/AsideMenuLayer.vue";
import AsideMenuItem from "@/components/Premium/AsideMenuItem.vue";

defineProps({
  menu: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["menu-click"]);

const layoutStore = useLayoutStore();

const isPrimaryMenuCompact = ref(true);

const secondaryMenuItem = ref(null);

const overlayLayerDisplayType = computed(() => {
  if (secondaryMenuItem.value) {
    return "flex";
  }

  if (!isPrimaryMenuCompact.value) {
    return "hidden lg:flex";
  }

  return "hidden";
});

const closeSecondaryMenu = () => {
  secondaryMenuItem.value = null;
};

const menuClickPrimaryMenu = (event, item) => {
  emit("menu-click", event, item);

  if (item.menu) {
    isPrimaryMenuCompact.value = false;
  }

  if (item.menuSecondary) {
    if (secondaryMenuItem.value && item.key === secondaryMenuItem.value.key) {
      closeSecondaryMenu();
    } else {
      secondaryMenuItem.value = item;
    }
  }
};

const menuClickSecondaryMenu = (event, item) => {
  emit("menu-click", event, item);
};

const overlayClick = () => {
  if (secondaryMenuItem.value) {
    closeSecondaryMenu();
  } else if (!isPrimaryMenuCompact.value) {
    isPrimaryMenuCompact.value = true;
  }
};

window.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    (secondaryMenuItem.value || !isPrimaryMenuCompact.value)
  ) {
    overlayClick();
  }
});

const router = useRouter();

router.afterEach(() => {
  isPrimaryMenuCompact.value = true;
});

const expandCollapseItem = computed(() => ({
  label: isPrimaryMenuCompact.value ? "Exapand" : "Collapse",
  icon: isPrimaryMenuCompact.value
    ? mdiChevronRightCircleOutline
    : mdiChevronLeftCircleOutline,
  color: "info",
}));
</script>

<template>
  <AsideMenuLayer
    :menu="menu"
    :class="[
      layoutStore.isAsideMobileExpanded ? 'left-0' : '-left-60 lg:left-0',
      isPrimaryMenuCompact ? 'lg:w-22' : 'lg-w-64',
      { 'lg:hidden xl:flex': !layoutStore.isAsideLgActive },
    ]"
    :is-compact="isPrimaryMenuCompact"
    :z-index="secondaryMenuItem ? 'z-40 md:z-50' : 'z-50'"
    :active-secondary-menu-key="secondaryMenuItem?.key"
    @menu-click="menuClickPrimaryMenu"
  >
    <div class="flex-1 px-3 flex justify-center">
      <b class="font-black">One</b>
    </div>

    <template #footer>
      <ul class="hidden lg:block">
        <AsideMenuItem
          :item="expandCollapseItem"
          :is-compact="isPrimaryMenuCompact"
          @menu-click="isPrimaryMenuCompact = !isPrimaryMenuCompact"
        />
      </ul>
    </template>
  </AsideMenuLayer>
  <AsideMenuLayer
    v-if="secondaryMenuItem"
    :menu="secondaryMenuItem.menuSecondary"
    :class="[isPrimaryMenuCompact ? 'lg:left-22' : 'md:left-60']"
    class="right-0 md:right-auto animate-fade-in-right-fast lg:animate-fade-in-left-fast"
    @menu-click="menuClickSecondaryMenu"
  >
    <BaseIcon
      v-if="secondaryMenuItem.icon"
      :path="secondaryMenuItem.icon"
      w="w-16"
    />
    <div class="flex-1">
      {{ secondaryMenuItem.label }}
    </div>
    <BaseIcon
      :path="mdiClose"
      class="cursor-pointer"
      w="w-12"
      @click="closeSecondaryMenu"
    />
  </AsideMenuLayer>
  <OverlayLayer
    :type="overlayLayerDisplayType"
    z-index="z-40"
    @overlay-click="overlayClick"
  />
</template>
