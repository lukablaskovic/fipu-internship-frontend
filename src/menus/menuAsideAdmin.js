import { mdiMonitor, mdiAccountMultiple, mdiEngine, mdiDomain } from "@mdi/js";

export default [
  {
    to: "/dashboard",
    icon: mdiMonitor,
    label: "Nadzorna ploča",
  },
  {
    to: "/students",
    icon: mdiAccountMultiple,
    label: "Studenti",
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
