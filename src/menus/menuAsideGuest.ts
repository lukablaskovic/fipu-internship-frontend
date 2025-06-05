import { mdiClipboardTextOutline, mdiDomain, mdiInformation } from "@mdi/js";

interface MenuItem {
	to?: string;
	icon?: string;
	label: string;
	menu?: MenuItem[];
	externalURL?: string;
}

const menuAsideGuest: MenuItem[] = [
	{ to: "/moja-praksa", icon: mdiClipboardTextOutline, label: "Zadaci" },
	{ to: "/poslodavci", icon: mdiDomain, label: "Poslodavci" },
	{ to: "/upute", icon: mdiInformation, label: "Upute" },
];

export default menuAsideGuest;
