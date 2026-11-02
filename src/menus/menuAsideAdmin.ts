import { BPMN_STUDIO_URL, BASEROW_URL } from "@/config.js";
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
			{ label: "BPMN engine", to: "/engine" },
			{ label: "Administratori", to: "/administratori" },
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
				externalURL: BPMN_STUDIO_URL + "/",
			},
		],
	},
];

export default menuAsideAdmin;
