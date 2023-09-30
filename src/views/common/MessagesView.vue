<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import MessageInput from "@/components/Messages/MessageInput.vue";
import ConversationsSideBar from "@/components/Messages/ConversationsSideBar.vue";
import ConversationPanel from "@/components/Messages/ConversationPanel.vue";
import Conversation from "@/components/Messages/Conversation.vue";
import Message from "@/components/Messages/Message.vue";
</script>

<template>
  <LayoutAuthenticated>
    <div class="xl:max-w-7xl xl:mx-auto flex flex-col absolute h-full w-full justify-center items-center left-1/2 -translate-x-1/2">     
        <div class="bg-gray-100 dark:bg-slate-800 h-full w-full flex flex-col drop-shadow">
            
            <div class="grow flex flex-col justify-end">
                <div class="flex flex-row grow antialiased text-gray-800 dark:text-gray-300 rounded overflow-hidden">
                    <ConversationsSideBar/>
                    <ConversationPanel>
                        <Conversation>
                            <Message user="Kenobi" text="Hello there"/>
                            <Message reverse user="Grievous" text="General Kenobi"/>
                        </Conversation>
                        <MessageInput/>
                    </ConversationPanel>
                </div>
            </div>
            
        </div>
    </div>
  </LayoutAuthenticated>
</template>