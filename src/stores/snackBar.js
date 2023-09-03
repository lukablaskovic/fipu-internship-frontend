import { defineStore } from "pinia";

export const useSnackBarStore = defineStore("snackBar", {
  state: () => ({
    messages: [],
  }),
  actions: {
    pushMessage(text, color, lifetime = 3000) {
      this.messages.push({
        timestamp: Date.now(),
        text,
        color,
        lifetime: parseInt(lifetime),
      });
    },

    cancelMessage(timestamp) {
      const newMessages = [];

      this.messages.forEach((message) => {
        if (timestamp !== message.timestamp) {
          newMessages.push(message);
        }
      });

      this.messages = newMessages;
    },
  },
});
