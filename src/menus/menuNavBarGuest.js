import { mdiLogin, mdiThemeLightDark, mdiHelpBoxOutline } from "@mdi/js";

export default [
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
    icon: mdiLogin,
    label: "Prijava",
    isDesktopNoLabel: true,
  },
];
