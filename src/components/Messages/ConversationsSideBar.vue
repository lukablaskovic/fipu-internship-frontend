<script setup>
import ConversationsGroupsNavbar from "@/components/Messages/ConversationsGroupsNavbar.vue";
import AddConversationButton from "@/components/Messages/AddConversationButton.vue";
import ConversationDivider from "@/components/Messages/ConversationDivider.vue";
import ConversationsSearch from "@/components/Messages/ConversationsSearch.vue";
import ConversationItem from "@/components/Messages/ConversationItem.vue";

import { chatStore } from "@/main.js";
import { mainStore } from "@/main.js";

</script>
<template>
    <div class="flex flex-row flex-shrink-0 bg-gray-100 dark:bg-gray-900 p-4 w-36 lg:w-96 transition-size duration-300">
        <div class="flex flex-col w-full h-full pl-1 lg:pl-4 pr-1 lg:pr-4 py-4 -mr-4">
            <ConversationsSearch/>
            <ConversationsGroupsNavbar/>
            <div class="flxe flex-col">
                <ConversationItem v-for="c in chatStore.conversations" :conversation="c" 
                :selected="chatStore.selectedConversation == (c.user_1_id == mainStore.currentUser.id ? c.user_2_id : c.user_1_id)"/>
            </div>
            <AddConversationButton/>
        </div>
    </div>
</template>