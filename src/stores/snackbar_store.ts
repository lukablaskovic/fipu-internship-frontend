import { defineStore } from "pinia";

// Define an interface for the message type
interface Message {
	timestamp: number;
	text: string;
	color: string;
	lifetime: number;
}

export const useSnackBarStore = defineStore("snackBar", {
	state: () => ({
		messages: [] as Message[], // Typed array of Message objects
	}),
	actions: {
		pushMessage(text: string, color: string, lifetime: number = 3000) {
			this.messages.push({
				timestamp: Date.now(),
				text,
				color,
				lifetime: parseInt(lifetime.toString()), // Convert lifetime to number explicitly
			});
		},

		cancelMessage(timestamp: number) {
			const newMessages: Message[] = [];

			this.messages.forEach((message) => {
				if (timestamp !== message.timestamp) {
					newMessages.push(message);
				}
			});

			this.messages = newMessages;
		},
	},
});
