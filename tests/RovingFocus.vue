<script setup>
import NavBar from "../src/components/Navbar/NavBar.vue";
import AsideMenuList from "../src/components/AsideMenu/AsideMenuList.vue";
import NavBarMenuList from "../src/components/Navbar/NavBarMenuList.vue";
import { ref } from "vue";
import { Tooltip } from "reka-ui/namespaced";
import BaseButtons from "../src/components/Base/BaseButtons.vue";
import BaseButton from "../src/components/Base/BaseButton.vue";
import ButtonMenu from "../src/components/Premium/ButtonMenu.vue";
import "../src/css/main.css";
const disabled = ref(false);
const count = ref(0);
</script>
<template>
	<Tooltip.Provider>
		<button id="before">Before</button>
		<BaseButtons id="actions">
			<BaseButton label="First" @click="count++" />
			<BaseButton label="Disabled" disabled />
			<BaseButton label="Loading" loading />
			<BaseButton label="Disabled link" href="#disabled" disabled />
			<BaseButton v-for="label in ['Second', 'Third']" :key="label" :label="label" :disabled="label === 'Second' && disabled" />
			<ButtonMenu label="Menu" :options="[[{ id: 1, label: 'Edit' }]]" />
		</BaseButtons>
		<button id="after" @click="disabled = !disabled">After</button>
		<BaseButton label="Standalone" />
		<AsideMenuList id="sidebar" :menu="[{ label: 'Overview', to: '/overview' }, { label: 'More', menu: [{ label: 'Child', to: '/child' }] }, { label: 'Last', href: '#last' }]" />
		<NavBarMenuList id="navbar" :menu="[[{ label: 'Account', menu: [{ label: 'Profile', to: '/profile' }, { label: 'Sign out' }] }, { label: 'Help' }], [{ label: 'Mobile profile', to: '/profile' }, { label: 'Mobile help' }]]" />
		<NavBar id="responsive-nav" style="position: static" :menu="[[{ label: 'Desktop action' }], [{ label: 'Mobile action' }]]" />
		<output>{{ count }}</output>
	</Tooltip.Provider>
</template>
