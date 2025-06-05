import { mdiLaptop, mdiDomain, mdiChartTimeline, mdiInformation } from "@mdi/js";

interface MenuItem {
	to?: string;
	icon?: string;
	label: string;
	menu?: MenuItem[];
	externalURL?: string;
}

const menuAsideStudent: MenuItem[] = [
	{ to: "/moja-praksa", icon: mdiLaptop, label: "Moja praksa" },
	{ to: "/stanje-procesa", icon: mdiChartTimeline, label: "Stanje procesa" },
	{ to: "/poslodavci", icon: mdiDomain, label: "Poslodavci" },
	{ to: "/upute", icon: mdiInformation, label: "Upute" },
];

export default menuAsideStudent;
