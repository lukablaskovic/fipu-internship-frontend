<script setup>
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent } from "reka-ui";
defineOptions({ name: "BaseTooltip" });
defineProps({ content: { type: String, default: "" }, side: { type: String, default: "bottom" }, disabled: Boolean });
</script>
<template>
	<TooltipRoot :disabled="disabled || !content">
		<TooltipTrigger as-child><slot /></TooltipTrigger>
		<TooltipPortal>
			<TooltipContent :side="side" :side-offset="8" :collision-padding="8" class="z-[10000] max-w-[calc(100vw-16px)] rounded-[5px] bg-[#333] p-[5px] text-sm text-white shadow-sm">
				{{ content }}
			</TooltipContent>
		</TooltipPortal>
	</TooltipRoot>
</template>
