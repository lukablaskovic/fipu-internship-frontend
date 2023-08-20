import {
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
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
        icon: mdiCogOutline,
        label: "Postavke",
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
    icon: mdiThemeLightDark,
    label: "Light/Dark",
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
  {
    icon: mdiLogout,
    label: "Log out",
    isDesktopNoLabel: true,
    isLogout: true,
  },
];
