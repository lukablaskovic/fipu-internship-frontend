<script setup>
import { chatStore, layoutStore, mainStore } from "@/main.js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiStarOutline, mdiStar, mdiArchiveOutline, mdiArchive  } from '@mdi/js';
</script>
<template>
    <div v-if="cstatus == chatStore.grouping || mainStore.currentUser.account_type != 'admin'" class="flex flex-col -mx-5 lg:-mx-4 mt-1 lg:mt-2" 
        @click="!hover ? chatStore.selectConversation(c.id, conversation) : ''">
        <div class="flex items-center pt-2.5 pb-2.5 lg:pt-4 lg:pb-4 relative hover:bg-white dark:hover:bg-gray-800/25" 
            :class="selected ? 'border-l-2 bg-gradient-to-r pl-1.5 pr-2 lg:pr-4 lg:pl-3.5 from-sky-200 dark:from-sky-950/50 to-transparent border-fipu_dark_blue dark:border-fipu_dark_blue' 
            : 'pl-2 pr-2 lg:pr-4 lg:pl-4 hover:rounded'">
            
            <div class="absolute text-xs text-gray-500 font-medium right-2 lg:right-0 top-2 lg:top-0 lg:mr-4 lg:mt-3"> {{ timestamp }}</div>
            <div class="flex items-center justify-center h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-fipu_blue text-white dark:text-fipu_gray dark:font-bold font-medium flex-shrink-0 relative"> 
                {{ c != null ? c.ime[0] : '' }} 
                <div v-if="checkNewMessage() && conversation.id != chatStore.selectedConversationID" 
                    class="flex items-center justify-center animate-ping h-1.5 w-1.5 bg-rose-500 text-white font-medium text-xs rounded-full
                        absolute -top-1 -right-1"></div>
            </div>

            <div v-if="mainStore.currentUser.account_type == 'admin'" class="absolute right-1 lg:right-3 bottom-0 lg:bottom-2 flex gap-0 lg:gap-2">
                <div @mouseover="hover = true" @mouseleave="hover = false" @click="cstatus == 'stared' ? cstatus = 'normal' : cstatus = 'starred'; chatStore.updateConversationStatus('starred', conversation)"> 
                    <BaseIcon class="hover:text-fipu_dark_blue hover:cursor-pointer" :size="layoutStore.isLg ? 22 : 18"
                    :path="conversation.status == 'starred' && cstatus == 'starred' || cstatus == 'starred' ? mdiStar : mdiStarOutline"></BaseIcon> 
                </div>
                <div @mouseover="hover = true" @mouseleave="hover = false" @click="cstatus == 'archived' ? cstatus = 'normal' : cstatus = 'archived'; chatStore.updateConversationStatus('archived', conversation)"> 
                    <BaseIcon class="hover:text-fipu_dark_blue hover:cursor-pointer" :size="layoutStore.isLg ? 22 : 18"
                    :path="conversation.status == 'archived' && cstatus == 'archived' || cstatus == 'archived' ? mdiArchive : mdiArchiveOutline"></BaseIcon> 
                </div>
            </div>
            
            <div class="flex flex-col ml-3 w-full">
                <div class="flex items-center">
                    <div class="text-sm font-medium truncate w-40"> {{ c != null ? (c.ime + ' ' + c.prezime) : '' }} </div>
                </div>
                <div class="text-xs truncate w-40"> {{ last_text != null ? last_text.content : '' }} </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import moment from "@/moment-setup";
import { chatStore } from "@/main.js";
import { mainStore } from "@/main.js";

export default {
    props: {
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
    },
    data() {
        return {
            timestamp: "",
            last_text: null,
            c: null,
            intervalId: null,
            hover: false,
            cstatus: this.conversation.status
        }
    },
    beforeDestroy() {
        clearInterval(this.intervalId);
    },
    async mounted() {
        clearInterval(this.intervalId);
        this.last_text = await chatStore.getLastMessage(this.conversation.user_1_id == mainStore.currentUser.id ? this.conversation.user_2_id : this.conversation.user_1_id );
        this.c = chatStore.getUserDataFromConversationItem(this.conversation);
        this.timestamp = this.last_text != null ? (this.last_text.timestamp != null ? moment(this.last_text.timestamp).fromNow() : '') : ''
    },
    methods: {
        checkNewMessage() {
            if (this.conversation.user_1_id == mainStore.currentUser.id)
                return this.conversation.user_1_last_message_read_id < this.conversation.user_2_last_message_read_id;
            else  return this.conversation.user_1_last_message_read_id > this.conversation.user_2_last_message_read_id;
        }
    }
}
</script>