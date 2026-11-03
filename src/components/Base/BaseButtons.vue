<script>
import { h, defineComponent, provide } from "vue";
import { RovingFocusGroup } from "reka-ui";

export default defineComponent({
	name: "BaseButtons",
	props: {
		noWrap: Boolean,
		type: {
			type: String,
			default: "justify-start",
		},
		classAddon: {
			type: String,
			default: "mr-3 last:mr-0 mb-3",
		},
		mb: {
			type: String,
			default: "-mb-3",
		},
	},
	setup() {
		provide("buttonRovingFocus", true);
	},
	render() {
		const hasSlot = this.$slots && this.$slots.default;

		const parentClass = ["flex", "items-center", this.type, this.noWrap ? "flex-nowrap" : "flex-wrap"];

		if (this.mb) {
			parentClass.push(this.mb);
		}

		return h(
			RovingFocusGroup,
			{ class: parentClass, orientation: "horizontal", loop: true },
			() => hasSlot
				? this.$slots.default().map((element) => {
						if (element && Array.isArray(element.children)) {
							return h(
								element,
								{},
								element.children.map((child) => {
									return h(child, { class: [this.classAddon] });
								})
							);
						}

						return h(element, { class: [this.classAddon] });
				  })
				: null
		);
	},
});
</script>
