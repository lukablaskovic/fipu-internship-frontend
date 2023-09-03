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
    label: "BPMN Engine",
    icon: mdiEngine,
    menu: [
      {
        to: "/bpmn/models",
        label: "Models",
      },
      {
        to: "/bpmn/microservices",
        label: "Mikroservisi",
      },
      {
        to: "/bpmn/modeler",
        label: "Modeler",
      },
      {
        label: "PDF Generator",
      },
    ],
  },
];
