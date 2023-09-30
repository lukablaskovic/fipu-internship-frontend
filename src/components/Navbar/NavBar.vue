<script setup>
import { ref } from "vue";
import { mdiClose, mdiDotsVertical } from "@mdi/js";
import { containerMaxW } from "@/config.js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import NavBarMenuList from "@/components/Navbar/NavBarMenuList.vue";
import NavBarItemPlain from "@/components/Navbar/NavBarItemPlain.vue";
import { useLayoutStore } from "@/stores/layout.js";

const layoutStore = useLayoutStore();

defineProps({
  menu: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["menu-click"]);

const menuClick = (event, item) => {
  emit("menu-click", event, item);
};

const isMenuNavBarActive = ref(false);
</script>

<template>
    <nav class="top-0 inset-x-0 fixed bg-gray-50 h-14 z-30 transition-position w-screen lg:w-auto dark:bg-slate-800" >
        <div class="flex lg:items-stretch" :class="containerMaxW">
            <div class="flex flex-1 items-stretch h-14"> <slot /> </div>
            <div class="flex-none items-stretch flex h-14 lg:hidden">
                <NavBarItemPlain @click.prevent="isMenuNavBarActive = !isMenuNavBarActive">
                    <BaseIcon :path="isMenuNavBarActive ? mdiClose : mdiDotsVertical" size="24" />
                </NavBarItemPlain>
            </div>
            <div class="max-h-screen-menu overflow-y-auto lg:overflow-visible absolute w-screen top-14 -left-2 transition-size duration-300
                bg-gray-50 shadow-lg lg:w-auto lg:flex lg:static lg:shadow-none dark:bg-slate-800"
                :style="isMenuNavBarActive && !layoutStore.isLg ? 'height: '+menu[1].length*42+'px;' : ''"
                :class="[isMenuNavBarActive ? 'h-64 lg:h-auto' : 'h-0 lg:h-auto']">
                <NavBarMenuList :menu="menu" @menu-click="menuClick" />
            </div>
        </div>
    </nav>
</template>
<style scoped>
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track-piece {
    background: #f9fafb
}
::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 100px;
}
::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
    border-radius: 32px;
}
</style>