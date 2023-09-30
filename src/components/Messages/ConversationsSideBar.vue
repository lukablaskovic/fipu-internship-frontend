<script setup>
import ConversationsGroupsNavbar from "@/components/Messages/ConversationsGroupsNavbar.vue";
import AddConversationButton from "@/components/Messages/AddConversationButton.vue";
import ConversationDivider from "@/components/Messages/ConversationDivider.vue";
import ConversationsSearch from "@/components/Messages/ConversationsSearch.vue";
import ConversationItem from "@/components/Messages/ConversationItem.vue";
</script>
<template>
    <div class="flex flex-row flex-shrink-0 bg-gray-100 dark:bg-gray-900 p-4 w-36 lg:w-96 transition-size duration-300">
        <div class="flex flex-col w-full h-full pl-1 lg:pl-4 pr-1 lg:pr-4 py-4 -mr-4">
            <ConversationsSearch/>
            <ConversationsGroupsNavbar/>
            <div class="flxe flex-col">
                <ConversationDivider text="Studenti"/>
                <ConversationItem name="User 1" last_text="Hi" :messages_unread="0" status="online" :last_time_read="1696082920285"/>
                <ConversationItem name="User 2" last_text="Hi" :messages_unread="0" status="away" :last_time_read="1696092820285"/>
                <ConversationItem name="User 3" last_text="Hi" :messages_unread="0" status="idle" :last_time_read="1696051120285"/>
                <ConversationItem selected name="Kenobi" last_text="Hello there." :messages_unread="0" status="online" :last_time_read="1696092920285"/>
                <ConversationItem name="User 4" last_text="Hi" :messages_unread="0" status="idle" :last_time_read="1686092920285"/>
                <ConversationItem name="Bob Ross" last_text="Happy Little Trees!" :messages_unread="0" status="away" :last_time_read="1296091920285"/>
                <ConversationDivider text="Ostalo"/>
                <AddConversationButton/>
            </div>
        
        </div>
    </div>
</template>