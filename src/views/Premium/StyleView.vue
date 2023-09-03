<script setup>
import { mdiThemeLightDark } from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import SectionMain from "@/components/SectionMain.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import { useStyleStore } from "@/stores/style.js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

const styleStore = useStyleStore();

const setStyle = (style) => {
  styleStore.setStyle(style);
  styleStore.setDarkMode(false);
};

const styles = {
  white: "white",
  basic: "bg-gray-500 border-gray-500 hover:bg-gray-600",
  slate: "bg-slate-500 border-slate-500 hover:bg-slate-600",
  zinc: "bg-zinc-500 border-zinc-500 hover:bg-zinc-600",
  neutral: "bg-neutral-500 border-neutral-500 hover:bg-neutral-600",
  stone: "bg-stone-500 border-stone-500 hover:bg-stone-600",
  emerald: "bg-emerald-500 border-emerald-500 hover:bg-emerald-600",
  teal: "bg-teal-500 border-teal-500 hover:bg-teal-600",
  cyan: "bg-cyan-500 border-cyan-500 hover:bg-cyan-600",
  sky: "bg-sky-500 border-sky-500 hover:bg-sky-600",
  blue: "bg-blue-500 border-blue-500 hover:bg-blue-600",
  indigo: "bg-indigo-500 border-indigo-500 hover:bg-indigo-600",
  violet: "bg-violet-500 border-violet-500 hover:bg-violet-600",
  purple: "bg-purple-500 border-purple-500 hover:bg-purple-600",
  fuchsia: "bg-fuchsia-500 border-fuchsia-500 hover:bg-fuchsia-600",
  pink: "bg-pink-500 border-pink-500 hover:bg-pink-600",
  rose: "bg-rose-500 border-rose-500 hover:bg-rose-600",
};

const darkModeToggle = () => {
  styleStore.setDarkMode();
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionTitle> Sidebar Colors </SectionTitle>

    <SectionMain>
      <CardBox class="xl:w-8/12 md:mx-auto">
        <div>
          <BaseButtons type="justify-center">
            <BaseButton
              v-for="(styleBg, style) in styles"
              :key="style"
              :color="style === 'white' ? style : `${styleBg} text-white`"
              :label="style"
              class="capitalize"
              rounded-full
              @click="setStyle(style)"
            />
          </BaseButtons>
        </div>
      </CardBox>
    </SectionMain>

    <SectionTitle> Dark mode </SectionTitle>

    <SectionMain>
      <CardBox class="md:w-7/12 lg:w-5/12 xl:w-4/12 md:mx-auto">
        <div
          class="text-center py-24 lg:py-12 text-gray-500 dark:text-gray-400"
        >
          <BaseButton
            label="Toggle light/dark"
            :icon="mdiThemeLightDark"
            color="contrast"
            @click="darkModeToggle"
          />
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
