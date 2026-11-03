import { watch } from "vue";

export function useUnsavedChangesWarning(hasChanges) {
	function warnBeforeUnload(event) {
		event.preventDefault();
		event.returnValue = true;
	}

	return watch(hasChanges, (dirty, _, onCleanup) => {
		if (!dirty) return;
		window.addEventListener("beforeunload", warnBeforeUnload);
		onCleanup(() => window.removeEventListener("beforeunload", warnBeforeUnload));
	}, { immediate: true });
}
