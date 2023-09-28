import {
  mdiAccount,
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
    ],
  },
  {
    icon: mdiHelpBoxOutline,
    label: "Pomoć",
    isDesktopNoLabel: true,
    isHelp: true,
    size: 32
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
    isLogout: true,
  },
];
