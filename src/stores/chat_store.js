import { defineStore } from "pinia";
import { User } from "@/services/gateway_api";

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
        messages: [],
        content: ''
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
            this.conversations = await User.getConversations(mainStore.currentUser.id);
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
            this.messages = response.sort(compareTimestamps);
        },
        async selectConversation(id) {
            this.selectedConversation == id ? this.selectedConversation = '' : this.selectedConversation = id
            if (this.selectedConversation != '') {
                await this.getMessages(this.selectedConversation)
            }
        },
        async getLastMessage(id) {
            let lastMessage = await User.getLastMessage(id)
            if (lastMessage.detail) lastMessage = lastMessage.detail
            else {
                return lastMessage.content
            }
            return lastMessage;
        },
        async sendMessage() {
            let message = {
                "receiver_id" : this.selectedConversation,
	            "content" : this.content
            }
            let response = await User.sendMessage(message)
            if (response) await this.getMessages(this.selectedConversation)
            this.content = '';
        },
        getUsersWithoutConversations(users, conversations) {
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
                "lastMessageRead": null,
                "user_1_active": true,
                "user_2_active": false
            };
            let response = await User.addConversation(conversation)
            this.conversations = await User.getConversations(mainStore.currentUser.id);
        }   
    },
    persist: true,
});
