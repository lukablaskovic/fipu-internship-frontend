import { BASEROW_URL, LOCAL_DEV } from "@/config.js";
import { mdiMonitor, mdiAccountMultiple, mdiSecurity, mdiDomain, mdiClipboardText, mdiClipboardCheck } from "@mdi/js";

interface MenuItem {
	to?: string;
	icon?: string;
	label: string;
	menu?: MenuItem[];
	externalURL?: string;
}

const menuAsideAdmin: MenuItem[] = [
	{
		to: "/dashboard",
		icon: mdiMonitor,
		label: "Nadzorna ploča",
	},
	{
		to: "/studenti",
		icon: mdiAccountMultiple,
		label: "Studenti",
	},
	{
		to: "/alokacije",
		icon: mdiClipboardCheck,
		label: "Alokacije",
	},
	{
		to: "/zadaci",
		icon: mdiClipboardText,
		label: "Zadaci",
	},
	{
		to: "/poslodavci",
		icon: mdiDomain,
		label: "Poslodavci",
	},

	{
		label: "Admin",
		icon: mdiSecurity,
		menu: [
			...(LOCAL_DEV ? [{ label: "Arhiva akademskih godina", to: "/arhiva" }] : []),
			{
				to: "/poslodavci/novi-zadatak",
				label: "Prijava zadatka",
			},
			{
				label: "Baserow",
				externalURL: BASEROW_URL,
			},
			{
				label: "BPMN Studio",
				externalURL: "http://localhost:5174",
			},
		],
	},
];

export default menuAsideAdmin;
