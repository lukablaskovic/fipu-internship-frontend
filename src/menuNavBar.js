import {
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
} from "@mdi/js";

export default [
  /*
  {
    icon: mdiMenu,
    label: "Sample menu",
    menu: [
      {
        icon: mdiClockOutline,
        label: "Item One",
      },
      {
        icon: mdiCloud,
        label: "Item Two",
      },
      {
        isDivider: true,
      },
      {
        icon: mdiCrop,
        label: "Item Last",
      },
    ],
  },
  */
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
  /*
  {
    icon: mdiGithub,
    label: "GitHub",
    isDesktopNoLabel: true,
    href: "https://github.com/justboil/admin-one-vue-tailwind",
    target: "_blank",
  },
  */
  {
    icon: mdiLogout,
    label: "Log out",
    isDesktopNoLabel: true,
    isLogout: true,
  },
];
