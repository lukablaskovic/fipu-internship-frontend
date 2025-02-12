import { mdiMonitor, mdiAccountMultiple, mdiSecurity, mdiDomain, mdiClipboardText, mdiClipboardCheck } from "@mdi/js";

export default [
	{
		to: "/dashboard",
		icon: mdiMonitor,
		label: "Nadzorna ploča",
	},
	{
		to: "/studenti",
		icon: mdiAccountMultiple,
		label: "Studenti",
		updateMark: "danger",
	},
	{
		to: "/alokacije",
		icon: mdiClipboardCheck,
		label: "Alokacije",
	},
	{
		to: "/dostupni-zadaci",
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
			{
				label: "PDF Generator",
				externalURL: "https://html-to-pdf-maker.netlify.app/",
			},
			{
				to: "/poslodavci/novi-zadatak",
				label: "Forma za prijavu zadatka",
			},
			{
				label: "Baserow baza",
				externalURL: "https://baserow.unipu.hr/dashboard",
			},
		],
	},
];
