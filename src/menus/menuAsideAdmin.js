import {
  mdiMonitor,
  mdiAccountMultiple,
  mdiEngine,
  mdiDomain,
  mdiClipboardText,
  mdiClipboardCheck,
} from "@mdi/js";

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
    to: "/dostupni-zadaci",
    icon: mdiClipboardText,
    label: "Zadaci",
  },
  {
    to: "/alokacije",
    icon: mdiClipboardCheck,
    label: "Alokacije",
  },
  {
    to: "/poslodavci",
    icon: mdiDomain,
    label: "Poslodavci",
  },

  {
    label: "Admin",
    icon: mdiEngine,
    menu: [
      {
        to: "/bpmn/models",
        label: "Procesi",
      },
      {
        to: "/bpmn/microservices",
        label: "Mikroservisi",
      },

      {
        label: "PDF Generator",
        externalURL: "https://html-to-pdf-maker.netlify.app/",
      },
    ],
  },
];
