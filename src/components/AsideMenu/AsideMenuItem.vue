<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";
import { useStyleStore } from "@/stores/style_store.js";
import { mdiMinus, mdiPlus, mdiChevronRight } from "@mdi/js";
import { getButtonColor } from "@/colors.js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import AsideMenuList from "@/components/AsideMenu/AsideMenuList.vue";
import UpdateMark from "@/components/Premium/UpdateMark.vue";
import { adminStore } from "@/main.js";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  activeSecondaryMenuKey: {
    type: String,
    default: null,
  },
  isDropdownList: Boolean,
  isCompact: Boolean,
});

const emit = defineEmits(["menu-click"]);

const styleStore = useStyleStore();

const asideMenuItemInactiveStyle = computed(() =>
  hasColor.value
    ? ""
    : `${styleStore.asideMenuItemInactiveStyle} dark:text-gray-300`
);

const asideMenuItemActiveBgStyle = computed(
  () => `${styleStore.asideMenuItemActiveBgStyle} dark:bg-slate-700/25`
);

const asideMenuItemActiveStyle = computed(() =>
  hasColor.value ? "" : styleStore.asideMenuItemActiveStyle
);

const isAsideCompact = computed(() => props.isCompact);

watch(isAsideCompact, (value) => {
  if (value) {
    isDropdownActive.value = false;
  }
});

const isDropdownActive = ref(false);

const isSecondaryMenuActive = computed(
  () =>
    props.activeSecondaryMenuKey &&
    props.item?.key &&
    props.item?.key === props.activeSecondaryMenuKey
);

const hasColor = computed(() => props.item && props.item.color);

const componentClass = computed(() => {
  const base = [
    props.isDropdownList ? "py-3 px-6 text-sm" : "py-3",
    hasColor.value
      ? getButtonColor(props.item.color, false, true)
      : `${styleStore.asideMenuItemStyle} dark:hover:bg-gray-700/50`,
  ];

  if (
    !hasColor.value &&
    (isDropdownActive.value || isSecondaryMenuActive.value)
  ) {
    base.push(asideMenuItemActiveBgStyle.value);
  }

  return base;
});

const hasDropdown = computed(() => !!props.item.menu);

const hasSecondary = computed(() => !!props.item.menuSecondary);

const hasSub = computed(() => hasDropdown.value || hasSecondary.value);

const subIcon = computed(() => {
  if (hasSecondary.value) {
    return mdiChevronRight;
  }

  return isDropdownActive.value ? mdiMinus : mdiPlus;
});

const menuClick = (event) => {
  emit("menu-click", event, props.item);

  if (props.item.externalURL) {
    window.open(props.item.externalURL, "_blank");
    return;
  }

  if (hasDropdown.value) {
    isDropdownActive.value = !isDropdownActive.value;
  }
};

const updateMarkPosition = computed(() => {
  const base = "top-0.5 right-4";

  return props.isCompact ? `${base} lg:right-6` : base;
});
</script>

<template>
    <li>
        <component v-slot="vSlot" :is="item.to ? RouterLink : 'a'" @click="menuClick"
            :to="item.to ?? null" :href="item.href ?? null" :target="item.target ?? null"
            :exact-active-class="activeSecondaryMenuKey ? null : asideMenuItemActiveBgStyle"
            class="flex cursor-pointer" :class="[componentClass, isCompact ? 'justify-center' : 'justify-start']">

            <BaseIcon v-if="item.icon" :path="item.icon" class="flex-none transition-all duration-300" :w="isCompact ? 'w-8 lg:w-16' : 'w-8'" :size="item.size ? item.size : 18"
                :class="[ vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle,
                        { relative: item.updateMark },
                        item.color == 'info' ? 'text-slate-800' : '']">
                <UpdateMark v-if="item.updateMark && adminStore.dashboard_data.waiting_for_allocation > 0" :color="item.updateMark" :position="updateMarkPosition"/>
            </BaseIcon>

            <span class="transition-all duration-300 overflow-hidden text-ellipsis line-clamp-1"
                :class="[{ '': isCompact, '': !hasSub },
                        vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle,
                        isCompact ? (item.menu == undefined ? 'w-52 lg:w-0' : 'w-40 lg:w-0') : 'w-40',
                        item.color == 'info' ? 'text-slate-800 font-bold hover:underline' : '']">
                {{ item.label }}
            </span>

            <BaseIcon v-if="hasSub" :path="subIcon" class="flex-none animate-fade-in-fast" w="w-12"
                :class="[{ 'lg:hidden': isCompact }, vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle]"/>
                
        </component>
        <AsideMenuList v-if="hasDropdown" :menu="item.menu" is-dropdown-list :class="[styleStore.asideMenuDropdownStyle, isDropdownActive ? 'block dark:bg-slate-800/50' : 'hidden']"/>
    </li>
</template>