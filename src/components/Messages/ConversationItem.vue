<script setup>
import { ref, onMounted } from "vue";
import moment from "@/moment-setup";
import { chatStore } from "@/main.js";
import { mainStore } from "@/main.js";

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  selected: {
    type: Boolean,
    default: false,
  },
  conversation: {
    type: Object,
    default: {},
  }
});

let last_time_read = 1696092920285;
let messages_unread = 0;
let last_text = ref(null);
let c = ref(null);

onMounted(async () => {
  c = chatStore.getUserDataFromConversationItem(props.conversation);
  last_text.value = await chatStore.getLastMessage(props.conversation.user_1_id == mainStore.currentUser.id ? props.conversation.user_2_id : props.conversation.user_1_id );
});
</script>

<template>
    <div class="flex flex-col -mx-5 lg:-mx-4 mt-1 lg:mt-2" 
        @click="chatStore.selectConversation(c.id)">
        <div class="flex items-center px-2 pt-1.5 pb-6 lg:pt-4 lg:pb-4 lg:px-4 relative hover:bg-white dark:hover:bg-gray-800/25" 
            :class="selected ? 'border-l-2 bg-gradient-to-r from-sky-200 dark:from-sky-950/50 to-transparent border-fipu_dark_blue dark:border-fipu_dark_blue' : 'hover:rounded'">
            
            <div class="absolute text-xs text-gray-500 font-medium lg:right-0 top-11 lg:top-0 lg:mr-4 lg:mt-3"> {{ moment(last_time_read).fromNow() }}</div>
            <div class="flex items-center justify-center h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-fipu_blue text-white font-medium flex-shrink-0"> {{ c != null ? c.ime[0] : '' }} </div>
            
            <div class="flex flex-col ml-3 w-full">
                <div class="flex items-center">
                    <div class="text-sm font-medium truncate w-16 lg:w-40"> {{ c != null ? (c.ime + ' ' + c.prezime) : '' }} </div>
                </div>
                <div class="text-xs truncate w-16 lg:w-40"> {{ last_text }} </div>
            </div>

            <div v-if="messages_unread != 0" class="flex-shrink-0 ml-2 self-end mb-1 ">
                <span class="flex items-center justify-center h-5 w-5 bg-rose-500 text-white font-medium text-xs rounded-full"> {{ messages_unread }} </span>
            </div>

        </div>
    </div>
</template>