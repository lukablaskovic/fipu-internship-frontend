<script setup>
import { computed, nextTick, ref } from "vue";
import { ComboboxVirtualizer, FieldControl, injectFieldRootContext } from "reka-ui";
import { TagGroup } from "reka-ui/namespaced";
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxList, ComboboxTrigger, ComboboxViewport } from "@/components/ui/combobox";
import { mdiCheck, mdiChevronDown, mdiClose } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { normalizeString } from "@/helpers/search-utils";
import devicons from "devicon/devicon.json";

const iconSources = import.meta.glob("/node_modules/devicon/icons/*/*.svg", { eager: true, query: "?url", import: "default" });

const props = defineProps({ disabled: Boolean });
const selected = defineModel({ type: Array, default: () => [] });
const fieldContext = injectFieldRootContext(null);
const disabled = computed(() => props.disabled || fieldContext?.disabled.value);
const search = ref("");
const searchInput = ref(null);
const labels = {
	adobeillustrator: "Adobe Illustrator", aftereffects: "After Effects", amazonwebservices: "AWS", android: "Android", androidstudio: "Android Studio",
	angular: "Angular", angularjs: "AngularJS", apache: "Apache", apacheairflow: "Apache Airflow", apachekafka: "Apache Kafka", apachespark: "Apache Spark",
	arduino: "Arduino", aspnet: "ASP.NET", azure: "Azure", azuredevops: "Azure DevOps", bash: "Bash", bootstrap: "Bootstrap", c: "C", cplusplus: "C++", csharp: "C#",
	css3: "CSS", d3js: "D3.js", dart: "Dart", digitalocean: "DigitalOcean", django: "Django", docker: "Docker", dotnetcore: ".NET Core", "dot-net": ".NET",
	elasticsearch: "Elasticsearch", electron: "Electron", express: "Express", fastapi: "FastAPI", figma: "Figma", firebase: "Firebase", flask: "Flask", flutter: "Flutter",
	git: "Git", github: "GitHub", githubactions: "GitHub Actions", gitlab: "GitLab", go: "Go", godot: "Godot", googlecloud: "Google Cloud", graphql: "GraphQL",
	html5: "HTML", intellij: "IntelliJ IDEA", ios: "iOS", java: "Java", javascript: "JavaScript", jenkins: "Jenkins", jest: "Jest", jquery: "jQuery", jupyter: "Jupyter",
	keras: "Keras", kotlin: "Kotlin", kubernetes: "Kubernetes", laravel: "Laravel", linux: "Linux", mariadb: "MariaDB", matlab: "MATLAB", mongodb: "MongoDB",
	mysql: "MySQL", nestjs: "NestJS", nextjs: "Next.js", nginx: "Nginx", nodejs: "Node.js", nuxt: "Nuxt", numpy: "NumPy", opencv: "OpenCV", opengl: "OpenGL",
	pandas: "pandas", photoshop: "Photoshop", php: "PHP", phpstorm: "PhpStorm", playwright: "Playwright", postgresql: "PostgreSQL", postman: "Postman",
	powerbi: "Power BI", premierepro: "Premiere Pro", python: "Python", pytorch: "PyTorch", r: "R", rabbitmq: "RabbitMQ", raspberrypi: "Raspberry Pi", react: "React",
	redis: "Redis", ruby: "Ruby", rubyonrails: "Ruby on Rails", rust: "Rust", sass: "Sass", scikitlearn: "scikit-learn", spring: "Spring", sqlite: "SQLite",
	svelte: "Svelte", swift: "Swift", symfony: "Symfony", tailwindcss: "Tailwind CSS", tensorflow: "TensorFlow", terraform: "Terraform", threejs: "Three.js",
	typescript: "TypeScript", unity: "Unity", unrealengine: "Unreal Engine", vite: "Vite", visualstudio: "Visual Studio", vscode: "VS Code", vuejs: "Vue.js", vuetify: "Vuetify",
	webflow: "Webflow", webpack: "Webpack", woocommerce: "WooCommerce", wordpress: "WordPress", xcode: "Xcode",
};
const technologies = devicons.filter(({ name }) => !["nuxtjs", "vitejs"].includes(name)).map((icon) => {
	const label = labels[icon.name] || icon.name.charAt(0).toUpperCase() + icon.name.slice(1);
	const version = icon.versions.svg.find((version) => !version.includes("wordmark")) || icon.versions.svg[0];
	return { label, icon: iconSources[`/node_modules/devicon/icons/${icon.name}/${icon.name}-${version}.svg`], search: normalizeString([label, icon.name, ...icon.altnames].join(" ")) };
}).sort((a, b) => a.label.localeCompare(b.label, "hr"));
const iconsByLabel = new Map(technologies.map((technology) => [technology.label, technology.icon]));
const filteredTechnologies = computed(() => {
	const query = normalizeString(search.value);
	return technologies.filter((technology) => technology.search.includes(query));
});
const filteredLabels = computed(() => filteredTechnologies.value.map(({ label }) => label));

function removeTechnologies(values) {
	if (disabled.value) return;
	const remaining = selected.value.filter((value) => !values.includes(value));
	selected.value = remaining;
	if (!remaining.length) nextTick(() => searchInput.value?.$el?.focus());
}
</script>

<template>
	<div class="min-w-0 space-y-2">
		<Combobox v-model="selected" multiple :disabled="!!disabled" ignore-filter open-on-focus open-on-click>
			<ComboboxAnchor class="form-control-surface relative rounded-sm border border-gray-700">
				<FieldControl as-child :model-value="search">
					<ComboboxInput ref="searchInput" v-model="search" aria-label="Pretražite tehnologije" placeholder="Pretražite tehnologije, npr. Python, PHP, Vue.js…" class="block w-full rounded-sm border-0 bg-white p-3 pr-12 text-gray-900 placeholder-gray-500 focus:ring-0 dark:bg-slate-800 dark:text-white" />
				</FieldControl>
				<ComboboxTrigger :disabled="!!disabled" aria-label="Prikaži tehnologije" class="absolute inset-y-0 right-1 flex items-center px-2 focus-visible:outline-solid focus-visible:outline-fipu_blue">
					<BaseIcon :path="mdiChevronDown" w="w-5" h="h-5" :size="20" class="text-gray-500 dark:text-slate-400" aria-hidden="true" />
				</ComboboxTrigger>
			</ComboboxAnchor>
			<ComboboxList position="popper" :side-offset="4" class="z-10000 max-h-[min(24rem,var(--reka-combobox-content-available-height))] max-w-[calc(100vw-2rem)]">
				<ComboboxViewport class="max-h-[min(16rem,var(--reka-combobox-content-available-height))]">
					<ComboboxEmpty class="px-3 py-3 text-sm text-gray-500 dark:text-slate-400">Nema rezultata. Tehnologiju možete dopisati u polje ispod.</ComboboxEmpty>
					<ComboboxVirtualizer v-slot="{ option: label }" :options="filteredLabels" :estimate-size="48" :overscan="4" :text-content="(label) => label">
						<ComboboxItem :value="label" :text-value="label" class="h-12 w-full gap-3 py-2">
							<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-white" aria-hidden="true"><img :src="iconsByLabel.get(label)" alt="" width="24" height="24" loading="lazy" /></span>
							<span class="min-w-0 flex-1 wrap-break-word">{{ label }}</span>
							<ComboboxItemIndicator><BaseIcon :path="mdiCheck" w="w-5" h="h-5" :size="20" aria-hidden="true" /></ComboboxItemIndicator>
						</ComboboxItem>
					</ComboboxVirtualizer>
				</ComboboxViewport>
			</ComboboxList>
		</Combobox>
		<TagGroup.Root v-if="selected.length" :disabled="!!disabled" aria-label="Odabrane tehnologije" class="flex flex-wrap gap-2" @remove="removeTechnologies">
			<TagGroup.Item v-for="label in selected" :key="label" :value="label" :text-value="label" class="flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-1 pl-2 pr-1 text-sm focus-visible:outline-solid focus-visible:outline-fipu_blue focus-visible:outline-offset-2 data-disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800">
				<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-white" aria-hidden="true"><img :src="iconsByLabel.get(label)" alt="" width="18" height="18" /></span>
				<TagGroup.ItemText class="min-w-0 wrap-break-word">{{ label }}</TagGroup.ItemText>
				<TagGroup.ItemDelete aria-label="Ukloni" class="shrink-0 rounded-sm p-1 text-gray-500 hover:bg-gray-200 focus-visible:outline-solid focus-visible:outline-fipu_blue disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700">
					<BaseIcon :path="mdiClose" w="w-4" h="h-4" :size="16" aria-hidden="true" />
				</TagGroup.ItemDelete>
			</TagGroup.Item>
		</TagGroup.Root>
	</div>
</template>
