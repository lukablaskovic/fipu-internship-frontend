import { defineStore } from "pinia";
import { toast } from "vue-sonner";

const notifications: Record<string, typeof toast.success> = { success: toast.success, info: toast.info, warning: toast.warning, danger: toast.error, error: toast.error };

export const useSnackBarStore = defineStore("snackBar", {
	actions: {
		pushMessage(text: string, color: string, lifetime: number = 3000) {
			const notify = notifications[color] ?? toast;
			return notify(text, { duration: lifetime === 0 ? Infinity : lifetime });
		},
	},
});
