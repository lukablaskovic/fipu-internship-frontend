<script setup>
import { Tooltip } from "reka-ui/namespaced";
defineOptions({ name: "BaseTooltip" });
defineProps({ content: { type: String, default: "" }, side: { type: String, default: "bottom" }, disabled: Boolean });
</script>
<template>
	<Tooltip.Root :disabled="disabled || !content">
		<Tooltip.Trigger as-child><slot /></Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content :side="side" :side-offset="8" :collision-padding="8" class="z-[10000] max-w-[calc(100vw-16px)] rounded-[5px] bg-[#333] p-[5px] text-sm text-white shadow-sm">
				{{ content }}
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</template>
