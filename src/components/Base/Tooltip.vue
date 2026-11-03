<script setup>
import { Primitive } from "reka-ui";
import { Tooltip } from "reka-ui/namespaced";
defineOptions({ name: "BaseTooltip", inheritAttrs: false });
defineProps({ content: { type: String, default: "" }, side: { type: String, default: "bottom" }, disabled: Boolean, svg: Boolean });
</script>
<template>
	<Tooltip.Root :disabled="disabled || !content">
		<Tooltip.Trigger as-child v-bind="$attrs"><slot /></Tooltip.Trigger>
		<!-- foreignObject gives portalled SVG tooltips an HTML namespace. -->
		<Primitive :as="svg ? 'foreignObject' : 'template'">
			<Tooltip.Portal>
				<Tooltip.Content :side="side" :side-offset="8" :collision-padding="8" class="reka-animated z-[10000] max-w-[min(24rem,calc(100vw-16px))] whitespace-normal break-words rounded-md bg-[#333] px-2 py-1 text-sm text-white shadow-sm">
					{{ content }}
				</Tooltip.Content>
			</Tooltip.Portal>
		</Primitive>
	</Tooltip.Root>
</template>
