import { defineStore } from "pinia";
import { User } from "@/services/gateway_api";
import { nextTick } from "vue";

import { mainStore } from "@/main.js";
 
let wait = function (seconds) {
    return new Promise((resolveFn) => {
        setTimeout(resolveFn, seconds * 1000);
    });
};

export const useChatStore = defineStore("chat", {
    state: () => ({
        users: [],
        conversations: [],
        selectedConversation: "",
        c: {},
        selectedConversationID: null,
        messages: [],
        content: "",
        update: true,
        loading: false,
        grouping: "normal",
        collapsed: true,
    }),
    actions: {
        async wait(time) { await wait(time); },
        getUserName(m) {
            for (let i = 0; i < this.users.length; i++) 
                if (this.users[i].id == m.sender_id) 
                    return this.users[i].ime;
            return mainStore.currentUser.ime
        },
        getUserDataFromConversationItem(c) {
            let id = c.user_1_id == mainStore.currentUser.id ? c.user_2_id : c.user_1_id 
            let user = {}
            for (let i = 0; i < this.users.length; i++) 
                if (this.users[i].id == id) 
                    user = this.users[i];
            return user
        },
        async getAllUsers() {
            const users = mainStore.currentUser.account_type == 'student' ? await User.getAllAdmins() : await User.getAllUsers();
            this.conversations = await this.getConversations(mainStore.currentUser.id);
            if (users) this.users = users;
            if (this.selectedConversation != '') {
                await this.getMessages(this.selectedConversation)
            }
        },
        async getMessages(id) {
            let response = await User.getMessages(id);
            function compareTimestamps(a, b) {
                return new Date(a.timestamp) - new Date(b.timestamp);
            }
            response = response.sort(compareTimestamps);
            if (JSON.stringify(this.messages) != JSON.stringify(response)) {
                this.messages = response;

                let lastMessage = this.messages[this.messages.length-1];
                if (this.conversations != null) {
                    let conversationWithId = this.conversations.find(conversation => conversation.id == this.selectedConversationID);
                    if (conversationWithId != null && lastMessage != null) {
                        let updates = {
                            "status": null,
                            "user_1_last_message_read_id": conversationWithId.user_1_id == mainStore.currentUser.id ? lastMessage.id : null,
                            "user_2_last_message_read_id": conversationWithId.user_2_id == mainStore.currentUser.id ? lastMessage.id : null,
                            "user_1_active": null,
                            "user_2_active": null,
                        }
                        await User.updateConversation(this.selectedConversationID, updates);
                    }
                }
                await this.scrollToBottom();
            }
            
        },
        async selectConversation(id, c) {
            this.updateUserActivity(false);
            this.selectedConversation = id;
            this.c = c;
            this.selectedConversationID = c.id;
            if (this.selectedConversation != '') {
                await this.getMessages(this.selectedConversation)
            }
            this.update = false;
            await nextTick();
            this.update = true;
            const doc = document.getElementById("messageContainer")
            doc.scrollTop = doc.scrollHeight;
        },
        async getLastMessage(id) {
            let lastMessage = await User.getLastMessage(id)
            if (lastMessage.detail) lastMessage = { "content": "Nema poruka" }
            else {
                return lastMessage
            }
            return lastMessage;
        },
        async getConversations(id) {
            function compareTimestamps(b, a) {
                return new Date(a.timestamp) - new Date(b.timestamp);
            }
            let response = await User.getConversations(id);
            this.update = false;
            await nextTick()
            this.update = true;
            return response.sort(compareTimestamps);
        },
        async updateConversations(id) {
            function compareTimestamps(b, a) {
                return new Date(a.timestamp) - new Date(b.timestamp);
            }
            let response = await User.getConversations(id);
            response = response.sort(compareTimestamps);
            if (JSON.stringify(response) != JSON.stringify(this.conversations)) {
                this.conversations = response.sort(compareTimestamps);
                this.update = false;
                await nextTick()
                this.update = true;
                this.c = this.conversations.find(conversation => conversation.id == this.selectedConversationID); 
            }            
        },
        async sendMessage() {
            let message = {
                "conversation_id": this.selectedConversationID,
                "receiver_id" : this.selectedConversation,
	            "content" : this.content
            }
            let response = await User.sendMessage(message)
            if (response) await this.getMessages(this.selectedConversation)
            this.content = '';
            this.update = false;
            await nextTick();
            await this.updateUserActivity(false)
            this.conversations = await this.getConversations(mainStore.currentUser.id);
            await nextTick();
            this.update = true;
        },
        getUsersWithoutConversations(users, conversations) {
            if (conversations == null ) return []
            const usersWithoutConversations = users.filter(user => {
                const userId = user.id;
                return !conversations.some(conversation => {
                return conversation.user_1_id === userId || conversation.user_2_id === userId;
                });
            });

            return usersWithoutConversations;
        },
        async addConversation(id) {
            let conversation = {
                "user_1_id": mainStore.currentUser.id,
                "user_2_id": id,
                "status": "normal",
                "user_1_last_message_read_id": null,
                "user_2_last_message_read_id": null,
                "user_1_active": true,
                "user_2_active": false
            };
            this.update = false;
            await User.addConversation(conversation);
            this.conversations = await this.getConversations(mainStore.currentUser.id);
            this.update = true;
        },
        async scrollToBottom() {
            await this.wait(0.1)
            let element = document.getElementById("messageContainer")
            if (element != null) {
                element = element.firstElementChild.lastElementChild
                element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }
        },
        async updateConversationStatus(status, c) {
            this.update = false;
            let updates = {
                "status": c.status == status ? 'normal' : status,
                "user_1_last_message_read_id": null,
                "user_2_last_message_read_id": null,
                "user_1_active": null,
                "user_2_active": null,
            }
            await User.updateConversation(c.id, updates);
            this.grouping = updates.status;   
            this.c.status = updates.status;   
            await nextTick();
            this.update = true;
        },
        async updateUserActivity(value) {
            let updates = {
                "status": this.c.status,
                "user_1_last_message_read_id": this.c.user_1_last_message_read_id,
                "user_2_last_message_read_id": this.c.user_2_last_message_read_id,
                "user_1_active": this.c.user_1_id == mainStore.currentUser.id ? value : null,
                "user_2_active": this.c.user_2_id == mainStore.currentUser.id ? value : null,
            }
            await User.updateConversation(this.c.id, updates);         
        }
    },
    persist: true,
});
