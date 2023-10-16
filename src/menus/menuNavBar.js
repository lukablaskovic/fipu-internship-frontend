import { mdiAccount, mdiEmail, mdiLogout, mdiThemeLightDark, mdiHelpBoxOutline, mdiBug } from "@mdi/js";

export default [
	[
		{
			isCurrentUser: true,
			menu: [
				{
					icon: mdiAccount,
					label: "Moj profil",
					to: "/profil",
				},
				{
					icon: mdiEmail,
					label: "Poruke",
					to: "/poruke",
				},
			],
		},
		{
			icon: mdiHelpBoxOutline,
			label: "Pomoć",
			isDesktopNoLabel: true,
			isHelp: true,
			size: 22,
		},
		{
			icon: mdiBug,
			label: "Prijavi bug",
			isDesktopNoLabel: true,
			externalURL: "https://github.com/lukablaskovic/fipu-internship-frontend/issues",
			size: 22,
		},
		{
			icon: mdiThemeLightDark,
			label: "Promjena teme",
			isDesktopNoLabel: true,
			isToggleLightDark: true,
		},
		{
			icon: mdiLogout,
			label: "Odjava",
			isDesktopNoLabel: true,
			isLogout: true,
		},
	],
	[
		{
			icon: mdiAccount,
			label: "Moj profil",
			to: "/profil",
		},
		{
			icon: mdiEmail,
			label: "Poruke",
			to: "/poruke",
		},
		{
			icon: mdiHelpBoxOutline,
			label: "Pomoć",
			isDesktopNoLabel: true,
			isHelp: true,
			size: 22,
		},
		{
			icon: mdiBug,
			label: "Prijavi bug",
			isDesktopNoLabel: true,
			externalURL: "https://github.com/lukablaskovic/fipu-internship-frontend/issues",
			size: 22,
		},
		{
			icon: mdiThemeLightDark,
			label: "Promjena teme",
			isDesktopNoLabel: true,
			isToggleLightDark: true,
		},
		{
			icon: mdiLogout,
			label: "Odjava",
			isDesktopNoLabel: true,
			isLogout: true,
		},
	],
];
