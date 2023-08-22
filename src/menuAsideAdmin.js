import { mdiMonitor, mdiAccount, mdiEngine, mdiDomain } from "@mdi/js";

export default [
  {
    to: "/dashboard",
    icon: mdiMonitor,
    label: "Nadzorna ploča",
  },
  {
    to: "/students",
    icon: mdiAccount,
    label: "Studenti",
  },
  {
    to: "/companies",
    icon: mdiDomain,
    label: "Poduzeća",
  },

  {
    label: "BPMN Engine",
    icon: mdiEngine,
    menu: [
      {
        to: "/bpmn/models",
        label: "Modeli",
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
