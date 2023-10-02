<script setup>
const props = defineProps({
    reverse: {
        type: Boolean,
        default: false,
    },
    text: {
        type: String,
        default: '',
    },
    user: {
        type: String,
        default: '',
    },
});
</script>
<template>
    <div class="flex gap-3 items-end" :class="{'flex-row-reverse': reverse}">
        <div :class="!reverse ? 'bg-fipu_blue' : 'bg-rose-600/70 dark:bg-rose-500/75'" class="flex items-center justify-center h-9 w-9 rounded-full text-white dark:text-fipu_gray dark:font-bold  font-medium flex-shrink-0"> {{ user[0] }} </div>
        <div :class="reverse ? 'bg-indigo-100 dark:bg-gray-950/75 text-slate-900 dark:text-slate-300' : 
            'bg-stone-100  dark:bg-zinc-950/75 text-fipu_gray dark:text-zinc-300'"
            class="relative text-sm  py-2 px-4 shadow rounded-xl">
            {{ text }}
        </div>
    </div>
</template>