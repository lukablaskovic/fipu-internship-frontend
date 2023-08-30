import {
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
  mdiHelpBoxOutline,
} from "@mdi/js";

export default [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: "Moj profil",
        to: "/profile",
      },
      {
        icon: mdiEmail,
        label: "Poruke",
      },
      {
        isDivider: true,
      },
      {
        icon: mdiLogout,
        label: "Odjava",
        isLogout: true,
      },
    ],
  },
  {
    icon: mdiHelpBoxOutline,
    label: "Pomoć",
    isDesktopNoLabel: true,
  },
  {
    icon: mdiThemeLightDark,
    label: "Light/Dark",
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
  {
    icon: mdiLogout,
    label: "Odjava",
    isDesktopNoLabel: true,
  },
];
