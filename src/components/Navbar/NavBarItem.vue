<script setup>
import { mdiChevronUp, mdiChevronDown } from "@mdi/js";
import { RouterLink } from "vue-router";
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { mainStore, styleStore } from "@/main.js";
import { useLayoutStore } from "@/stores/layout.js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import UserAvatarCurrentUser from "@/components/User/UserAvatarCurrentUser.vue";
import NavBarMenuList from "@/components/Navbar/NavBarMenuList.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";

const layoutStore = useLayoutStore();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["menu-click"]);

const is = computed(() => {
  if (props.item.href) {
    return "a";
  }

  if (props.item.to) {
    return RouterLink;
  }

  return "div";
});

const componentClass = computed(() => {
  const base = [
    isDropdownActive.value
      ? `${styleStore.navBarItemLabelActiveColorStyle} dark:text-slate-400`
      : `${styleStore.navBarItemLabelStyle} dark:text-white dark:hover:text-slate-400 ${styleStore.navBarItemLabelHoverStyle}`,
    props.item.menu ? "lg:py-2 lg:px-3" : "py-2 px-3",
  ];

  if (props.item.isDesktopNoLabel) {
    base.push("lg:w-16", "lg:justify-center");
  }

  return base;
});

const itemLabel = computed(() =>
  props.item.isCurrentUser
    ? mainStore.currentUser.username ||
      `${mainStore.currentUser.ime} ${mainStore.currentUser.prezime}`
    : props.item.label
);

const isDropdownActive = ref(false);

const menuClick = (event) => {
  emit("menu-click", event, props.item);

  if (props.item.menu) {
    isDropdownActive.value = !isDropdownActive.value;
  }
};

const menuClickDropdown = (event, item) => {
  emit("menu-click", event, item);
};

const root = ref(null);

const forceClose = (event) => {
  if (root.value && !root.value.contains(event.target)) {
    isDropdownActive.value = false;
  }
};

onMounted(() => {
  if (props.item.menu) {
    window.addEventListener("click", forceClose);
  }
});

onBeforeUnmount(() => {
  if (props.item.menu) {
    window.removeEventListener("click", forceClose);
  }
});
</script>

<template>
    <BaseDivider v-if="item.isDivider" nav-bar />

    <component :is="is" v-else ref="root" class="block lg:flex items-center relative cursor-pointer" @click="menuClick"
        :class="componentClass" :to="item.to ?? null" :href="item.href ?? null" :target="item.target ?? null">
        
        <div class="flex items-center" :class="{'bg-gray-100 dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent p-3 lg:p-0' : item.menu}">

            <UserAvatarCurrentUser v-if="item.isCurrentUser" class="w-6 h-6 mr-3 inline-flex"/>
            <BaseIcon v-if="item.icon" :size="item.size ? item.size : 19" :path="item.icon" 
                class="transition-colors text-fipu_gray hover:text-fipu_blue dark:text-white dark:hover:text-fipu_blue"  
                @mouseover="item.isDesktopNoLabel ? layoutStore.tooltip = { content: itemLabel, offsetx: 0, offsety: 40, justify: 'justify-center items-center' } : ''" 
                @mouseleave="layoutStore.tooltip = { content: '', offsetx: 0, offsety: 0 }"/>

            <span class="px-2 transition-colors text-base" :class="{ 'lg:hidden': item.isDesktopNoLabel && item.icon }">
                {{ itemLabel }}
            </span>
            <BaseIcon v-if="item.menu != undefined" :path="isDropdownActive ? mdiChevronUp : mdiChevronDown" class="hidden lg:inline-flex transition-colors"/>
        
        </div>

        <div v-if="item.menu" :style="isDropdownActive ? 'height: '+item.menu.length*42+'px;' : 'height: 0px;'"
            class="text-sm lg:absolute lg:top-full lg:left-0 lg:min-w-full overflow-hidden
                lg:z-20 lg:rounded-lg lg:shadow-lg transition-size duration-300">
            <NavBarMenuList :isSubmenu="true" :menu="item.menu" @menu-click="menuClickDropdown" />
        </div>

    </component>

</template>
